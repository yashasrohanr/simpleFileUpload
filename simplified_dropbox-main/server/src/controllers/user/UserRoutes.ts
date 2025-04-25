import * as express from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import UserControllers from "./UserControllers";
import upload from "../../middlewares/multer";
import rateLimit from "express-rate-limit";
import rateLimitMiddleWare from "../../middlewares/rateLimitMiddleWare";
import authenticator from "../../middlewares/auth";
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        data: "Too many requests, please try again later.",
    },
});

export default class UserRoutes {
    public router = express.Router();
    constructor() {
        console.log("Mounting UserRoutes");
        this.initialize();
    }

    private initialize() {
        // this.router.use(limiter);
        this.router.get("/getList", authenticator, UserControllers.getFileList);
        this.router.get("/search", authenticator, UserControllers.searchFiles);
        this.router.use(rateLimitMiddleWare as express.RequestHandler);
        this.router.get(
            "/download/:_fileName",
            authenticator,
            UserControllers.downloadFile
        );
        this.router.post(
            "/upload",
            authenticator,
            (req: Request, res: Response, next: NextFunction) => {
                upload.single("file")(req, res, (err: any) => {
                    if (err instanceof multer.MulterError) {
                        console.error("Multer Error:", err.message);
                        return res
                            .status(400)
                            .json({ success: false, data: err.message });
                    } else if (err) {
                        console.error("Error:", err.message);
                        return res
                            .status(500)
                            .json({ success: false, data: err.message });
                    }
                    next();
                });
            },
            UserControllers.uploadFile
        );
    }
}
