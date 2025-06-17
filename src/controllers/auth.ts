import { Request, Response } from "express";
import { wrap } from "../util";
import { manager as globalManager } from "../orm";
import { EntityManager } from "typeorm";
import { authService, tokenService, walletService } from "../services";
import { HttpStatus, TokenType } from "../enums";
import env from "../env";

export const register = wrap(async (req: Request, res: Response) => {
  const payload = req.body;
  const error = await globalManager.transaction(
    async (manager: EntityManager) => {
      try {
        const { id } = await authService.create(manager)(payload);
        await walletService.create(manager)(id, payload.pin);
      } catch (error) {
        return error;
      }
    }
  );

  if (error) throw error;
  res.status(HttpStatus.CREATED).end();
});

export const login = wrap(async (req: Request, res: Response) => {
  const payload = req.body;
  const { channel } = req.query;
  const { value: token } = await authService.authenticate(payload);

  // If the request origin is the same as the server origin, store in cookie else just return token

  if (channel && channel === "web") {
    return res
      .status(HttpStatus.OK)
      .cookie("br_x_sess", token, {
        httpOnly: true,
        domain: env.origin,
      })
      .end();
  }

  return {
    auth: {
      token,
    },
  };
});

export const logout = wrap(async (req: Request, res: Response) => {
  const { user } = req;
  await tokenService.invalidate(user.token, TokenType.AUTH, user.id);
  res.status(HttpStatus.OK).end();
});

export const user = wrap((req: Request, res: Response) => {
  const {
    user: { token, ...others },
  } = req;

  return others;
});
