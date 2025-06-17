import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class BadRequestException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.BAD_REQUEST, response);
  }
}
