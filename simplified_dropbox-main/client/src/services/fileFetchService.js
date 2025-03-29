import apiClient from "../utils/apiClient";

export const fetchFiles = async () => {
  try {
    const response = await apiClient.get("/getList");
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};
