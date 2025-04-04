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

export const searchFiles = async (query) => {
  try {
    console.log("searchFiles called inside fileFetchService")
    const response = await apiClient.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching files:", error);
    return { success: false, error: error.message };
  }
};

