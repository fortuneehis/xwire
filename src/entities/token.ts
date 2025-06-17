import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Model } from "../abstracts";
import { TokenType as Type } from "../enums";
import User from "./user";

@Entity({
  name: "tokens",
})
export default class Token extends Model {
  @Column({ unique: true })
  @Index()
  value: string;

  @Column("date", {
    nullable: true,
  })
  expiresAt: Date;

  @Column({
    type: "enum",
    enum: Type,
  })
  type: Type;

  @ManyToOne(() => User)
  user: User;
}
