import apiClient from "../utils/apiClient";

export const downloadFile = async (fileName, actionType) => {
  try {
    const response = await apiClient.get(`/download/${fileName}`, {
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorResponse = JSON.parse(reader.result);
          console.log("Error Response:", errorResponse);
          console.error("Error from server:", errorResponse.success, errorResponse.type);
          alert(`Error: ${errorResponse.type}`);
        } catch (err) {
          console.error("Failed to parse error response as JSON:", err);
          alert("An unknown error occurred.");
        }
      };
      reader.onerror = () => {
        console.error("Error reading the response blob.");
        alert("An error occurred while processing the server response.");
      };
      reader.readAsText(response.data);
      return;
    }

    const fileBlob = new Blob([response.data], { type: contentType });
    const fileURL = window.URL.createObjectURL(fileBlob);

    if (actionType === "view") {
      const previewWindow = window.open(fileURL, "_blank");
      if (!previewWindow) {
        throw new Error("Failed to open new tab for file preview. Please check your popup blocker settings.");
      }
    }
    else {
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    console.error("Error downloading or previewing file:", error);
    throw error;
  }
};
