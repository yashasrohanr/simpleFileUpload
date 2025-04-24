import userRateLimit from "../services/UserRateLimit";
import express from "express";

function rateLimitMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const username = req.headers["x-username"] as string | undefined;

    if (!userRateLimit.allowUser(username)) {
        return res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Please try again later.",
        });
    }

    next();
}

export default rateLimitMiddleware;
