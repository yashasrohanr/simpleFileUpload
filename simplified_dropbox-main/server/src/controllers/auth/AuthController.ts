import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = "some_secret";
const users = [
    { username: "Rohan", password: "1234", role: "user" },
    { username: "Shreya", password: "1234", role: "user" },
];

const login = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { username, password } = req.body;
        const user = users.find(
            (it) => it.username === username && it.password === password
        );

        if (!user) {
            res.status(401).json({
                success: false,
                type: "AuthError",
            });
            return;
        }

        const token = jwt.sign(
            { username: user.username, role: user.role },
            JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.json({ success: true, token });
        return;
    } catch (e) {
        next(e);
    }
};

export default login;
