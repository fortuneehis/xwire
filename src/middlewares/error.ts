import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import {
  HTTPException,
  InternalServerException,
  NotFoundException,
  UnprocessableEntityException,
} from "../exceptions";
import { EntityNotFoundError, TypeORMError } from "typeorm";
import { Codes } from "../enums";

export default (
  err: ErrorRequestHandler | HTTPException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: Record<string, any>;

  response = getResponse(err as Error);

  res.status(response.status).json(response);
};

const getResponse = (err: Error) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  let message = "An unknown error occurred";

  if (err instanceof SyntaxError) {
    return new UnprocessableEntityException({
      code: Codes.INVALID_REQUEST_FORMAT,
      message: "Check the request and try again",
    }).getResponse();
  }

  if (err instanceof EntityNotFoundError) {
    return new NotFoundException({
      code: Codes.ENTITY_NOT_FOUND,
      message: "The provided entity does not exist",
    }).getResponse();
  }

  if (err instanceof TypeORMError) {
    message = "An error occurred from our end.";
  }

  return new InternalServerException(message).getResponse();
};
