import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ResponseType from "../utils/Response";

const JWT_SECRET = "some_secret";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(`auth token received = ${token}`);
    if (!token) {
        return ResponseType.authError(res, "User not Authenticated");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (e) {
        ResponseType.forbidden(
            res,
            "Forbidden from entering ",
            JSON.stringify(e)
        );
    }
};

export default authenticateToken;
