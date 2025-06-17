import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class ConflictException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.CONFLICT, response);
  }
}
