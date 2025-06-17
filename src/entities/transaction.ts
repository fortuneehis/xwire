import { Column, Entity, ManyToOne } from "typeorm";
import { Money } from "../abstracts";
import User from "./user";
import Wallet from "./wallet";
import {
  TransactionChannel,
  TransactionStatus,
  TransactionType,
} from "../enums";

export type ExternalTransaction = {
  name: string;
  bank: string;
};

@Entity({ name: "transactions" })
export default class Transaction extends Money {
  @ManyToOne(() => User, { nullable: true })
  recipient: User;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: "enum",
    enum: TransactionChannel,
  })
  channel: TransactionChannel;

  @Column("text", { nullable: true })
  reason: string;

  @Column({ type: "jsonb", nullable: true })
  external: ExternalTransaction;
}
