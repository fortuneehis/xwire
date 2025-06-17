import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class UnprocessableEntityException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, response);
  }
}
