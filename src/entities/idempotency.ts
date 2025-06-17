import { Column, Entity, Index } from "typeorm";
import { Model } from "../abstracts";
import { IdempotencyStatus as Status } from "../enums";

@Entity({ name: "idempotency" })
export default class Idempotency extends Model {
  @Column({ unique: true })
  @Index()
  key: string;

  @Column()
  method: string;
  /** This will contain the steps of the operation and
   * will be determined by the operation
   * handler or better still called a "checkpoint" */
  @Column({
    default: "init",
  })
  step: string;

  @Column()
  path: string;

  @Column()
  bodyHash: string;

  @Column("jsonb", { nullable: true })
  response: Record<string, any> | null;
}
