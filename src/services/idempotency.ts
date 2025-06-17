import { Idempotency } from "../entities";
import { manager as globalManager } from "../orm";
import { hash } from "../util";
import { BadRequestException } from "../exceptions";
import { EntityManager } from "typeorm";
import { Codes } from "../enums";

export const create =
  (manager: EntityManager) =>
  async ({
    key,
    path,
    method,
    body,
    response,
  }: {
    key: string;
    path: string;
    method: string;
    body: Record<string, unknown>;
    response?: Record<string, unknown>;
  }) => {
    const idempotencyRepository = manager.getRepository(Idempotency);
    const bodyHash = hash(body);
    const instance = idempotencyRepository.create({
      key,
      bodyHash,
      path,
      method,
      response,
    });
    return idempotencyRepository.save(instance);
  };

export const get = async (
  key: string,
  path: string,
  method: string,
  body: Record<string, unknown>
) => {
  const idempotencyRepository = globalManager.getRepository(Idempotency);

  const bodyHash = hash(body);

  const idempotency = await idempotencyRepository.findOne({
    where: {
      key,
      path,
      method,
    },
  });

  if (!idempotency) {
    return null;
  }

  if (idempotency.bodyHash !== bodyHash)
    throw new BadRequestException({
      code: Codes.DUPLICATE_IDEMPOTENCY_KEY,
      message:
        "Cannot use an existing idempotency key to initialize a new request",
    });
  return idempotency;
};

export const update = async (idempotency: Partial<Idempotency>) => {
  const idempotencyRepository = globalManager.getRepository(Idempotency);

  return idempotencyRepository.update(
    {
      key: idempotency.key,
      path: idempotency.path,
      method: idempotency.method,
      bodyHash: idempotency.bodyHash,
    },
    {
      step: idempotency.step,
    }
  );
};
