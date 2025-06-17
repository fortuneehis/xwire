declare namespace Express {
  interface Request {
    user: {
      id: string;
      tag: string;
      email: string;
      token: string;
    };
  }
}
