import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class InternalServerException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, response);
  }
}
