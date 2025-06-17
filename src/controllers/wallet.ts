import { Request, Response } from "express";
import { wrap } from "../util";
import { idempotencyService, userService, walletService } from "../services";
import {
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from "../exceptions";
import { manager as globalManager } from "../orm";
import { randomUUID } from "crypto";
import { Codes, HttpStatus } from "../enums";

export const transfer = wrap(async (req: Request, res: Response) => {
  const { tag, amount, reason } = req.body;
  const {
    user: { id, tag: senderTag },
  } = req;

  if (tag === senderTag)
    throw new ForbiddenException("Cannot send money to yourself");

  const key = req.headers["idempotency-key"];

  const receiver = await userService.getBy("tag", tag);

  if (!receiver)
    throw new NotFoundException({
      code: Codes.ENTITY_NOT_FOUND,
      message: "User with the provided tag does not exist",
    });

  const idempotencyKey = `${id}.${
    Array.isArray(key) ? key[0] : !key || key.length === 0 ? randomUUID() : key
  }.transfer`;

  const idempotency = await idempotencyService.get(
    idempotencyKey,
    req.path,
    req.method,
    req.body
  );

  if (idempotency) {
    return idempotency.response;
  }

  const response = {
    message: `Your request to transfer ${amount} to ${tag} is being processed`,
  };

  const senderWallet = await walletService.get()(id);

  if (senderWallet.amount < amount)
    throw new UnprocessableEntityException({
      code: Codes.INSUFFICIENT_FUNDS,
      message: "Could not process request due to insufficient funds",
    });

  const error = await globalManager.transaction(async (manager) => {
    try {
      await walletService.transfer(manager)(id, receiver.id, amount, reason);
      await idempotencyService.create(manager)({
        key: idempotencyKey,
        path: req.path,
        method: req.method,
        body: req.body,
        response: {
          code: Codes.REQUEST_ALREADY_PROCESSED,
          message: "This request has been processed",
        },
      });
    } catch (err) {
      return err;
    }
  });

  if (error) throw error;

  return response;
});

export const getWallet = wrap(async (req: Request, res: Response) => {
  const { user, query } = req;

  const { amount, currency, precision } = await walletService.get()(user.id);

  return {
    amount:
      !query.amount || query.amount !== "show"
        ? "*****"
        : currency.toUpperCase() + amount.toString(),
    precision,
    currency,
  };
});

export const deposit = wrap(async (req: Request, res: Response) => {
  const {
    user,
    body: { amount },
  } = req;
  await walletService.deposit(user.id, amount);
  res.status(HttpStatus.OK).end();
});

export const withdraw = wrap(async (req: Request, res: Response) => {});
