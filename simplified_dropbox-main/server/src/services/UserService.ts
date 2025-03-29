import VError from "verror";
import Database from "../db";
import path from "path";
import fs from "fs";
import tmp from "tmp"
import { Readable } from "stream";
import Config from "../config";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export default class UserService {
    public static s3: S3Client = new S3Client({
        region: Config.AWS_REGION,
        credentials: {
            accessKeyId: Config.AWS_ACCESS_KEY_ID,
            secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
        },
    });

    public static async getList(): Promise<any> {
        try {
            const files = await Database.FIle.find({}, { _id: 0, __v: 0 }).lean();
            if (files) {
                return files;
            }
            console.log("file list fetch failed!");
            return null;
        }
        catch(err) {
            throw err;
        }
    }

    public static async uploadFile(fileMetadata: any): Promise<any> {
        try {
            const existingFile = await Database.FIle.findOne({ _name: fileMetadata._name });
            if(existingFile) {
                throw new VError({name: "User Error"}, "File already Stored - " + fileMetadata._name);
            }
            const s3UploadResult = await UserService.uploadFileToS3(fileMetadata)
            fileMetadata.storageType = (s3UploadResult ? "s3" : "local");
            const fileDoc = new Database.FIle(fileMetadata);
            await fileDoc.save();
            return fileDoc;
        }
        catch(err) {
            throw err;
        }
    }

    public static async downloadFile(fileName: String): Promise<any> {
        try {
            const file = await Database.FIle.findOne({ _name: fileName }).lean();
            console.log(file);
            if (!file) {
                throw new VError({name: "SearchError"}, "cannot find fileName in DB " + fileName);
            }
            
            if(!fileName || typeof fileName !== "string") {
                throw new VError({ name: "InvalidInputError" }, "File name cannot be undefined or empty");
            }

            if (file.storageType === "s3") {

              const tempFile = tmp.fileSync({ postfix: path.extname(fileName) });
              const downloadParams = {
                Bucket: Config.AWS_S3_BUCKET_NAME,
                Key: file._name,
              };

              const { Body } = await UserService.s3.send(new GetObjectCommand(downloadParams));
              console.log(Body);

              if (Body instanceof Readable) {
                const writeStream = fs.createWriteStream(tempFile.name);
                Body.pipe(writeStream);

                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                });
                return tempFile.name;
              } 
              else {
                throw new VError({ name: "ServerError" }, "Expected a Readable stream from S3");
              }
            } 
            else {
              const filePath = path.resolve(file.path || "");
              if (!fs.existsSync(filePath)) {
                throw new VError({ name: "ServerError" }, "File Not found on Server " + fileName);
              }
              return filePath;
            }
        }
        catch(err) {
            throw err;
        }
    }

    public static checkEnvVariables(): boolean {
        const requiredEnvVars = [
          Config.AWS_ACCESS_KEY_ID,
          Config.AWS_SECRET_ACCESS_KEY,
          Config.AWS_REGION,
          Config.AWS_S3_BUCKET_NAME
        ];
      
        for (const envVar of requiredEnvVars) {
          if (!envVar) {
            console.error("Missing required environment variable.");
            return false; 
          }
        }
        return true;
    };

    public static async uploadFileToS3(fileMetadata: any): Promise<any> {
      try {
        if(!UserService.checkEnvVariables()) return false;

        const fileContent = fs.readFileSync(fileMetadata.path);
        const uploadParams = {
          Bucket: Config.AWS_S3_BUCKET_NAME,
          Key: fileMetadata._name,
          Body: fileContent,
          ContentType: fileMetadata.fileType,
        };
        const result = await UserService.s3.send(new PutObjectCommand(uploadParams));
        console.log(result);
        fs.unlink(fileMetadata.path, (err) => {
            if(err) console.error("File Deletion Error: " + fileMetadata.path);
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
}