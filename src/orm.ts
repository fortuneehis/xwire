import { DataSource } from "typeorm";
import env from "./env";
import path from "path";

export const dataSource = new DataSource({
  ...env.db,
  synchronize: true,
  // logging: ["info", "query"],
  type: "postgres",
  entities: [path.join(__dirname, "./entities/**/*.{ts,js}")],
});

export const manager = dataSource.manager;
