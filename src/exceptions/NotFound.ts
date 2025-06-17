import { HttpStatus } from "../enums";
import HTTPException from "./Http";

export default class NotFoundException extends HTTPException {
  constructor(response: string | object) {
    super(HttpStatus.NOT_FOUND, response);
  }
}
