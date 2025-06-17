import { User } from "../entities";
import { manager } from "../orm";

export const getBy = async (key: keyof User, value: string) => {
  const userRepository = manager.getRepository(User);
  return userRepository.findOne({
    where: {
      [key]: value,
    },
  });
};
