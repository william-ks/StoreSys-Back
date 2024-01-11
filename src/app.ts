import express from "express";
import router from "./api/v2/routes";
import "dotenv/config";
import cors from "cors";

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
	}
}

export default new App().express;
