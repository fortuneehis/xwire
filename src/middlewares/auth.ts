import { NextFunction, Request, Response } from "express";
import { wrap } from "../util";
import { UnauthorizedException } from "../exceptions";
import { tokenService } from "../services";
import { TokenType } from "../enums";

export default wrap(async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  const token =
    authorization && typeof authorization === "string"
      ? authorization.split(" ")[1].trim()
      : typeof req.cookies?.br_x_sess === "string"
      ? req.cookies?.sess
      : false;

  if (!token) throw new UnauthorizedException("Invalid token");

  let result = await tokenService.verify(token, TokenType.AUTH);

  if (!result) {
    throw new UnauthorizedException("Invalid token");
  }

  const { user, value } = result;

  req.user = {
    ...user,
    token: value,
  };
}, true);
