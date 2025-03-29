import * as express from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import UserControllers from "./UserControllers";
import upload from "../../middlewares/multer";

export default class UserRoutes {
    public router = express.Router();
    constructor() {
        console.log("Mounting UserRoutes");
        this.initialize();
    }

    private initialize() {
        this.router.get("/getList", UserControllers.getFileList);
        this.router.get("/download/:_fileName", UserControllers.downloadFile);
        this.router.post(
          "/upload",
          (req: Request, res: Response, next: NextFunction) => {
            upload.single("file")(req, res, (err: any) => {
              if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ success:false, data: err.message });
              } else if (err) {
                console.error("Error:", err.message);
                return res.status(500).json({ success:false, data: err.message });
              }
              next();
            });
          },
          UserControllers.uploadFile
        );
    }
}
