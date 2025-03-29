import apiClient from "../utils/apiClient";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("user", "USER123");
    formData.append("file", file); // Key must match multer's field name

    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
