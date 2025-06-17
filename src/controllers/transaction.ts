import { Request, Response } from "express";
import { wrap } from "../util";
import { transactionService, walletService } from "../services";

export const getAllTransactions = wrap(async (req: Request) => {
  const {
    user: { id },
  } = req;
  const transactions = await transactionService.getAll(id);
  return transactions.length
    ? transactions.map(({ recipient, ...transaction }) => {
        const { tag } = recipient;
        return {
          ...transaction,
          tag,
        };
      })
    : transactions;
});
