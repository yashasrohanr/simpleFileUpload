import * as express from "express";
import { Request, Response } from "express";
import login from "./AuthController";
import authenticateToken from "../../middlewares/auth";

export default class AuthRoutes {
    public router = express.Router();
    constructor() {
        console.log("Mounting AuthRoutes");
        this.initialize();
    }

    private initialize() {
        this.router.post("/auth/login", login);
        this.router.get(
            "/protected",
            authenticateToken,
            (req: Request, res: Response) => {
                res.json({
                    message: "You are authorized 🎉",
                    user: (req as any).user,
                });
            }
        );
    }
}
