import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Money } from "../abstracts";
import User from "./user";

@Entity({ name: "wallets" })
export default class Wallet extends Money {
  @Column()
  pin: string;

  @Column({
    type: "int2",
    unsigned: true,
    default: 0,
  })
  currentTries: number;

  @Column({
    type: "timestamptz",
    default: null,
  })
  timeoutAt: Date | null;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.wallet)
  user: User;
}
