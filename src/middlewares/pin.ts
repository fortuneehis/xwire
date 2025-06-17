import { Request, Response } from "express";
import { wrap } from "../util";
import { walletService } from "../services";
import { UnauthorizedException } from "../exceptions";

export default wrap(async (req: Request, res: Response) => {
  const { user } = req;
  const { pin } = req.body;
  const timeout = await walletService.getTimeout(user.id);
  console.log("timeout: ", timeout);
  if (timeout && timeout.getTime() >= Date.now()) {
    throw new UnauthorizedException(
      `You have been locked out for ${
        timeout.getMinutes() - new Date().getMinutes()
      } minutes`
    );
  }
  const isPin = await walletService.verifyPin(pin, user.id);
  if (!isPin) {
    await walletService.addWalletTries(user.id);
    throw new UnauthorizedException("Invalid pin");
  }
}, true);
