import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadBar from "./components/UploadBar";
import Table from "./components/Table";
import { fetchFiles } from "./services/fileFetchService";

export default function App() {

  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    try {
      const fileList = await fetchFiles();
      console.log(fileList);
      if(fileList.success) {
        setFiles(fileList.data);
      }
      else {
        alert(`Server failed to fetch fileList: ${fileList.type}`);
      }
    } catch (error) {
      alert("Failed to fetch files. Please try again later.");
    }
  };

  useEffect(() => {
    loadFiles(); // Load files on initial render
  }, []);

  return (
    <div class="container-fluid text-center">
      <div class="col">
        <div class="row pb-3">
          <Navbar />
        </div>

        <div class="row">
          <UploadBar onUploadSuccess={loadFiles} />
        </div>

        <div class="row">
          <Table files={files} />
        </div>
      </div>
    </div>
  );
}
