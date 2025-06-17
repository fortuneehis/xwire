export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum TransactionType {
  WITHDRAW = "WITHDRAW",
  SENT = "SENT",
  RECEIVED = "RECEIVED",
  DEPOSIT = "DEPOSIT",
}

export enum TransactionChannel {
  WEB = "WEB",
  APP = "APP",
  EXTERNAL = "EXTERNAL",
}
