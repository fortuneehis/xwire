import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import { ValidatorOptions, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { formatErrors, wrap } from "../util";
import { UnprocessableEntityException } from "../exceptions";

export default <T extends object>(
  object: ClassConstructor<T>,
  key: "body" | "params" | "query" = "body"
) =>
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req[key] as unknown;

    const instance = plainToInstance(object, payload);

    const errors = await validate(instance, {
      stopAtFirstError: true,
      whitelist: true,
    } as ValidatorOptions);

    if (errors.length > 0)
      throw new UnprocessableEntityException(formatErrors(errors));

    req[key] = instanceToPlain(instance);
  }, true);
