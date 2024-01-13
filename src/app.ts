import express from "express";
import "express-async-errors";
import router from "./api/v2/routes";
import "dotenv/config";
import cors from "cors";
import { handleError } from "./api/v2/middlewares/handleError";

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private routes(): void {
    this.express.use(router);
    this.express.use(handleError);
  }
}

export default new App().express;
