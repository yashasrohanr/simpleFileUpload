import * as express from 'express';
import Response from "../../utils/Response";

export default class HealthRoutes {
    public router = express.Router();
    constructor() {
        console.log("Mounting HealthRoutes");
        this.initialize();
    }

    private initialize() {
        this.router.get("/", (req: express.Request, res: express.Response) => {
            Response.ok(res, {
                title: "DropBox Clone",
                time: new Date().toISOString(),
                version: 1.0
            });
        });

        this.router.get("/ping", (req: express.Request, res: express.Response) => {
            res.send("pong");
        });
    }
}
