import mongoose from "mongoose";
import Config from "../config";
import { IFile, FileSchema } from "./models/Files";

const masterConnection = mongoose.createConnection(Config.DB_URI, { minPoolSize: 5, maxPoolSize: 500 });
export default class Database {
    public static async waitForConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            masterConnection.on("connected", () => {
                console.log("Mongoose connection is up");
                resolve();
            });
            masterConnection.on("error", (err: Error) => {
                console.log("Mongoose connection errored");
                console.log(err);
                reject(err);
            });
            masterConnection.on("disconnected", () => {
                console.log("Mongoose connection disconnected");
                reject(new Error("Mongoose connection disconnected"));
            });
        });
    }

    public static FIle = masterConnection.model<IFile>("File", FileSchema, "File");
}
