import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { EntityManager, EntityTarget, ObjectLiteral } from "typeorm";
import { ConflictException } from "./exceptions";
import { createHash } from "crypto";

export const wrap =
  (fn: (...args: any[]) => unknown, middleware?: boolean) =>
  (...args: any[]) => {
    const next = args[args.length - 1] as NextFunction;
    const req = args[0] as Request;
    const res = args[1] as Response;
    // store req and res for logging purposes

    Promise.resolve(fn(...args))
      .then((result) => {
        if (middleware) {
          return next();
        }
        if (result) {
          // add logs for both request and response
          res.json(result);
        }
      })
      .catch(next);
  };

export const formatErrors = (errors: ValidationError[]) => {
  return errors.reduce((errors, { property, constraints }: ValidationError) => {
    if (!constraints) return {};
    return {
      ...errors,
      [property]: Object.values(constraints),
    };
  }, {});
};

export const formatTag = (tag: string) => {
  const unwantedCharsRegexp = /[\.\W]+/gi;
  return tag.replace(unwantedCharsRegexp, "");
};

export const fieldsExists =
  (manager: EntityManager) =>
  async (
    entity: EntityTarget<ObjectLiteral>,
    fields: Record<keyof EntityTarget<ObjectLiteral>, unknown>
  ) => {
    const userRepository = manager.getRepository(entity);

    const keys = Object.keys(fields) as (keyof EntityTarget<ObjectLiteral>)[];

    for (const key of keys) {
      const value = fields[key];
      const exists = await userRepository.existsBy({
        [key]: value,
      });

      if (exists) throw new ConflictException(`${key} already exists`);
    }
  };

export const generatePin = (length: number) => {
  let pin = "";
  for (let index = 0; index <= length - 1; index++)
    pin += Math.floor(Math.random() * 9).toString();
  return pin;
};

export const hash = (body: unknown) => {
  const hash = createHash("sha256");
  const bodyHash = hash.update(JSON.stringify(body)).digest().toString();
  return bodyHash;
};
