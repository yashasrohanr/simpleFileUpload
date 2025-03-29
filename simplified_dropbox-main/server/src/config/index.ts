import { config } from "dotenv";
import  { IConfig } from "./types";

config();

export const Config: IConfig = Object.freeze({
    APP: "dropbox-clone",
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string
});

export default Config;