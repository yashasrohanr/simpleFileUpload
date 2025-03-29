import express from "express";

export default class Response {
    public static ok(res: express.Response, payload: any): void {
        res.status(200).json({success: true, data: payload});
    }

    public static badRequest(res: express.Response, error?: string, payload?: any): void {
        res.status(400).json({success: false, type: "PayloadError", data: payload, error: error || "invalid request"});
    }

    public static okError(res: express.Response, type?: string, error?: string, payload?: any): void {
        res.status(200).json({success: false, type,data: payload, error: error});
    }

    public static serverError(res: express.Response, error?: string, payload?: any): void {
        res.status(500).json({success: false, type: "ServerError",data: payload, error: error});
    }

    public static authError(res: express.Response, error?: string, payload?: any): void {
        res.status(401).json({success: false, type: "AuthError",data: payload, error: error});
    }
}