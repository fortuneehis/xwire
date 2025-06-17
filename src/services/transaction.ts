import { EntityManager } from "typeorm";
import { Transaction } from "../entities";
import {
  TransactionChannel,
  TransactionStatus,
  TransactionType,
} from "../enums";
import { manager as globalManager } from "../orm";
import { ExternalTransaction } from "../entities/transaction";

export const create =
  (manager?: EntityManager) =>
  async ({
    receipientId,
    amount,
    walletId,
    reason,
    userId,
    status,
    channel,
    type,
    external,
  }: {
    receipientId: string;
    walletId: string;
    amount: number;
    userId: string;
    type: TransactionType;
    channel: TransactionChannel;
    status: TransactionStatus;
    reason?: string;
    external?: ExternalTransaction;
  }) => {
    const transactionRepository = (manager || globalManager).getRepository(
      Transaction
    );
    const instance = transactionRepository.create({
      recipient: {
        id: receipientId,
      },
      amount,
      reason,
      user: {
        id: userId,
      },
      wallet: {
        id: walletId,
      },
      channel,
      status,
      type,
      external,
    });
    return transactionRepository.save(instance);
  };

export const updateStatus =
  (manager?: EntityManager) => (id: string, status: TransactionStatus) => {
    const transactionRepository = (manager || globalManager).getRepository(
      Transaction
    );
    return transactionRepository.update(
      {
        id,
      },
      {
        status,
      }
    );
  };

export const getAll = (userId: string) => {
  const transactionRepository = globalManager.getRepository(Transaction);
  return transactionRepository.find({
    select: {
      recipient: {
        tag: true,
      },
    },
    order: {
      createdAt: "DESC",
    },
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      recipient: true,
    },
  });
};
