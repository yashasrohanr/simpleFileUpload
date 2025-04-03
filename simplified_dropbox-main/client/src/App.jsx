import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadBar from "./components/UploadBar";
import Table from "./components/Table";
import { fetchFiles, searchFiles } from "./services/fileFetchService";
export default function App() {

  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      loadFiles(); 
      return;
    }

    try {
      const searchResult = await searchFiles(query);
      if (searchResult.success) {
        setFiles(searchResult.data);
      } else {
        alert("No files found.");
      }
    } catch (error) {
      alert("Error while searching.");
    }
  };

  useEffect(() => {
    loadFiles(); // Load files only on initial render
  }, []);

  return (
    <div className="container-fluid text-center">
      <div className="col">
        <div className="row pb-3">
          <Navbar onSearch = {handleSearch}/>
        </div>

        <div className="row">
          <UploadBar onUploadSuccess={loadFiles} />
        </div>

        <div className="row">
          <Table files={files} />
        </div>
      </div>
    </div>
  );
}
