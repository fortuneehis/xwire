export default class HTTPException extends Error {
  constructor(private status: number, private response: string | object) {
    super();
  }

  getResponse(): { status: number } & Record<string, unknown> {
    return {
      status: this.status,
      ...(typeof this.response === "string"
        ? { message: this.response }
        : this.response),
    };
  }
}
