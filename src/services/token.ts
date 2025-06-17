import { randomBytes } from "crypto";
import { Token } from "../entities";
import { manager } from "../orm";
import { TokenType } from "../enums";
import { addMinutes } from "date-fns";

export const create = (type: TokenType, userId: string) => {
  const tokenRepsoitory = manager.getRepository(Token);
  const value = randomBytes(20).toString("hex");
  const instance = tokenRepsoitory.create({
    value,
    type,
    user: {
      id: userId,
    },
    expiresAt: addMinutes(Date.now(), 30),
  });
  return tokenRepsoitory.save(instance);
};

export const verify = async (token: string, type: TokenType) => {
  const tokenRepsoitory = manager.getRepository(Token);
  return tokenRepsoitory.findOne({
    select: {
      id: true,
      value: true,
      expiresAt: true,
      user: {
        id: true,
        tag: true,
        email: true,
      },
    },
    where: {
      value: token,
      type,
    },
    relations: {
      user: true,
    },
  });
};

export const invalidate = async (
  token: string,
  type: TokenType,
  userId: string
) => {
  const tokenRepsoitory = manager.getRepository(Token);
  await tokenRepsoitory.delete({
    type,
    value: token,
    user: {
      id: userId,
    },
  });
};

export const refresh = async (token: string, userId: string) => {
  await invalidate(token, TokenType.AUTH, userId);
  return create(TokenType.AUTH, userId);
};
