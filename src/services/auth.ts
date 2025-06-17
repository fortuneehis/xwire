import { EntityManager, EntityTarget, ObjectLiteral } from "typeorm";
import { Register, Login } from "../dtos";
import { User } from "../entities";
import { manager as globalManager } from "../orm";
import { UnauthorizedException } from "../exceptions";
import { fieldsExists } from "../util";
import { compare, genSalt, hash } from "bcryptjs";
import { tokenService } from ".";
import { Codes, TokenType } from "../enums";

export const create = (manager: EntityManager) => async (payload: Register) => {
  const userRepository = manager.getRepository(User);

  await fieldsExists(manager)(User, {
    email: payload.email,
    tag: payload.tag,
  });

  const encryptedPassword = await hash(payload.password, await genSalt());

  const userInstance = userRepository.create({
    ...payload,
    password: encryptedPassword,
  });
  return userRepository.save(userInstance);
};

export const authenticate = async (payload: Login) => {
  const userRepository = globalManager.getRepository(User);
  const { tag, password } = payload;

  const user = await userRepository.findOne({
    select: {
      id: true,
      password: true,
    },
    where: {
      tag,
    },
  });

  if (!user || !(await compare(password, user.password))) {
    throw new UnauthorizedException({
      code: Codes.INVALID_TAG_OR_PASSWORD,
      message: "Invalid tag or password",
    });
  }
  return tokenService.create(TokenType.AUTH, user.id);
};
