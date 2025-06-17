import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Model } from "../abstracts";
import Wallet from "./wallet";
import { formatTag } from "../util";

@Entity({ name: "users" })
export default class User extends Model {
  @Column({ unique: true })
  @Index()
  tag: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @BeforeInsert()
  beforeInsert() {
    this.tag = formatTag(this.tag);
  }
}
