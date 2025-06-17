import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class ForbiddenException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.FORBIDDEN, response);
  }
}
