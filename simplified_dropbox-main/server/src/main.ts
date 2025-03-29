import * as express from "express";
import Config from "./config";
import Database from "./db";
import cors from "cors";

class Server {
    readonly express: express.Application;
    readonly port: string;

    options: cors.CorsOptions = {
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "X-Access-Token"
        ],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: process.env.API_URL,
        preflightContinue: false,
    };

    constructor() {
        this.express = express.default();
        this.port = Config.PORT || "8005";
        this.express.use(cors(this.options));
    }

    public async init(): Promise<void> {
        this.applyProcessLevelHandlers();
        await Database.waitForConnection();
        this.mountRoutes();
        this.express.listen(this.port, () => {
            console.log("Server listening on " + this.port);
        });
    }


    private applyProcessLevelHandlers(): void {
        process
            .on("unhandledRejection", this.processHandler)
            .on("uncaughtException", this.processHandler);
    }

    private processHandler(err: Error, origin: string): void {
        console.error(origin === "uncaughtException" ? "uncaught exception" : "unhandled rejection" , {
            error: err ? err.message : "",
            stack: err && err.stack ? err.stack.toString() : ""
        });
        process.exit(1);
    }

    private mountRoutes() {
        if (Config.NODE_ENV === "development") {
            this.express.use(require("morgan")("dev"));
        }
        require("./controllers").Routes.forEach((routes: any) => {
            this.express.use("/", routes.router);
        });
    }

}


try {
    new Server().init();
} catch (e) {
    console.log(`Server init error: ${e}`);
}
