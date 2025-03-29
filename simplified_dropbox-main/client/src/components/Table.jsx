import React from "react";
import { downloadFile } from "../services/fileDownloadService";

export default function Table({ files }) {
  const handleDownload = async (fileName, actionType) => {
    try {
      await downloadFile(fileName, actionType);
    } catch (error) {
      alert(`Failed to download ${fileName}. Please try again.`);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-start">Uploaded files </h4>
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">File Name</th>
            <th scope="col">Date</th>
            <th scope="col">User</th>
            <th scope="col">Stored In</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <tr key={file.id}>
                <th scope="row">{index + 1}</th>
                <td>{file._name}</td>
                <td>{file.updatedAt}</td>
                <td>{file.user}</td>
                <td>{file.storageType}</td>
                <td>
                  <a
                    href={file.url}
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleDownload(file._name, "view")}
                  >
                    View
                  </a>
                  <a
                    href={file.url}
                    className="btn btn-success btn-sm"
                    onClick={() => handleDownload(file._name, "download")}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No files uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
