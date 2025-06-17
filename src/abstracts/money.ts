import { BeforeInsert, Column } from "typeorm";
import Model from "./model";
import env from "../env";

export default abstract class Money extends Model {
  @Column("int", { default: 0 })
  amount: number;

  @Column("smallint")
  precision: number;

  @Column({
    type: "char",
    length: 3,
  })
  currency: string;

  @BeforeInsert()
  beforeInsert() {
    const {
      currencies: {
        naira: { precision, currency },
      },
    } = env;
    this.precision = precision as number;
    this.currency = currency;
  }
}
