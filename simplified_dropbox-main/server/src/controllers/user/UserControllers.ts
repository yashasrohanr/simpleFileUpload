import express from "express";
import Response from "../../utils/Response";
import UserService from "../../services/UserService";
import { MulterRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { IFile } from "../../db/models/Files";
import fs from "fs";

export default class UserControllers {
  /**
   * Get the list of files stored in the database.
   * @param req
   * @param res
   */
  public static getFileList(req: express.Request, res: express.Response): void {
    UserService.getList()
      .then((data) => {
        Response.ok(res, data);
      })
      .catch((err) => {
        console.log(err);
        Response.okError(res, err.message);
      });
  }

  /**
   * Upload a file and store metadata in the database.
   * @param req
   * @param res
   */
  public static uploadFile(
    req: MulterRequest,
    res: express.Response
  ): void {
    if (!req.file) {
      Response.badRequest(res, "User sent bad request without file");
      return;
    }

    console.log(req.file);
    const fileMetadata : IFile = {
      uuid: uuidv4(),
      _name: req.file.originalname,
      size: req.file.size,
      fileType: req.file.mimetype,
      user: req.body.user || "Unknown User",
      path: req.file.path,
      schemaVersion: 1,
    };

    UserService.uploadFile(fileMetadata)
      .then((data) => {
        Response.ok(res, data);
      })
      .catch((err) => {
        fs.unlink(req.file!.path, (err) => {
          if (err) console.error("File Deletion Error: " + fileMetadata.path);
        });
        Response.okError(res, err.message);
      });
  }

  /**
   * Download a file by its file name.
   * @param req
   * @param res
   */
  public static downloadFile(
    req: express.Request,
    res: express.Response
  ): void {
    const fileName = req.params._fileName;

    UserService.downloadFile(fileName)
      .then((data : string | undefined) => {
        if (data) {
          res.download(data, fileName, (err) => {
            if (err) {
              console.error("Error during file download:", err);
              Response.serverError(res, "Failed to download file");
            }
          });
        } 
        else {
          Response.serverError(res, "File data is undefined");
        }
      })
      .catch((err) => {
        console.log(err);
        Response.okError(res, err.message);
      });
  }
}
