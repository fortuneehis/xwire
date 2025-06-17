import { dataSource } from "./orm";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter, transactionsRouter, walletsRouter } from "./routes";
import { error } from "./middlewares";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
    type: "application/json",
  })
);

app.use("/auth", authRouter);
app.use("/wallets", walletsRouter);
app.use("/transactions", transactionsRouter);
app.use(error);

dataSource
  .initialize()
  .then(() => {
    app.listen(9000, () => {
      console.log("listening...");
    });
  })
  .catch((err) => {
    console.error(err);
  });
