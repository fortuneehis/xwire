import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class UnauthorizedException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.UNAUTHORIZED, response);
  }
}
