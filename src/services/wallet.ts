import { EntityManager } from "typeorm";
import { Wallet } from "../entities";
import { manager as globalManager, manager } from "../orm";
import {
  TransactionChannel,
  TransactionStatus,
  TransactionType,
  WalletOperation,
} from "../enums";
import { compare, genSalt, hash } from "bcryptjs";
import { transactionService } from ".";
import { ExternalTransaction } from "../entities/transaction";

export const create =
  (manager?: EntityManager) => async (userId: string, pin: string) => {
    const walletRepository = (manager || globalManager).getRepository(Wallet);
    const walletInstance = walletRepository.create({
      pin: await hash(pin, await genSalt()),
      user: {
        id: userId,
      },
    });
    await walletRepository.save(walletInstance);
  };

export const get = (manager?: EntityManager) => async (userId: string) => {
  const walletRepository = (manager || globalManager).getRepository(Wallet);
  return walletRepository.findOneOrFail({
    where: {
      user: {
        id: userId,
      },
    },
  });
};

export const transfer =
  (manager: EntityManager) =>
  async (
    senderId: string,
    receiverId: string,
    amount: number,
    reason?: string
  ) => {
    const [senderWallet, receiverWallet] = await Promise.all([
      process(manager)(senderId, amount, WalletOperation.subtraction),
      process(manager)(receiverId, amount, WalletOperation.addition),
    ]);

    const transactionProperties = {
      status: TransactionStatus.SUCCESS,
      reason,
      channel: TransactionChannel.WEB,
      amount,
    };

    await Promise.all([
      transactionService.create(manager)({
        receipientId: receiverId,
        type: TransactionType.SENT,
        ...transactionProperties,
        userId: senderId,
        walletId: senderWallet.id,
      }),
      transactionService.create(manager)({
        receipientId: senderId,
        type: TransactionType.RECEIVED,
        ...transactionProperties,
        userId: receiverId,
        walletId: receiverWallet.id,
      }),
    ]);
  };

export const deposit = async (
  userId: string,
  amount: number,
  e?: ExternalTransaction
) => {
  await process()(userId, amount, WalletOperation.addition);
};

// whatever is needed to process an external withdrawal
export const withdraw = async (
  userId: string,
  amount: number,
  { name, bank }: ExternalTransaction
) => {
  await process()(userId, amount, WalletOperation.subtraction);
};

export const process =
  (manager?: EntityManager) =>
  async (userId: string, amount: number, operation: WalletOperation) => {
    const walletRepository = (globalManager || manager).getRepository(Wallet);
    const wallet = await walletRepository.findOneOrFail({
      where: {
        user: {
          id: userId,
        },
      },
    });

    switch (operation) {
      case WalletOperation.addition:
        wallet.amount += amount;
        break;
      case WalletOperation.subtraction:
        wallet.amount -= amount;
        break;
      default:
        throw new Error("Invalid wallet operation.");
    }

    return walletRepository.save(wallet);
  };

export const verifyPin = async (pin: string, userId: string) => {
  const walletRepository = globalManager.getRepository(Wallet);
  const wallet = await walletRepository.findOneOrFail({
    where: {
      user: {
        id: userId,
      },
    },
  });
  return compare(pin, wallet.pin);
};

export const addWalletTries = async (userId: string) => {
  const wallet = await get()(userId);
  wallet.currentTries += 1;

  if (wallet.currentTries >= 3 && !wallet.timeoutAt) {
    const timeout = new Date();
    timeout.setMinutes(timeout.getMinutes() + 5);
    wallet.timeoutAt = timeout;
  }

  if (
    wallet.currentTries >= 3 &&
    wallet.timeoutAt &&
    wallet.timeoutAt.getTime() < new Date().getTime()
  ) {
    wallet.currentTries = 1;
    wallet.timeoutAt = null;
  }

  await manager.save(wallet);
};

export const getTimeout = async (userId: string) => {
  const wallet = await get()(userId);
  return wallet.timeoutAt;
};
