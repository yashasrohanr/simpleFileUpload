import UserRoutes from "./user/UserRoutes";
import HealthRoutes from "./health/HealthRoutes";
import UploadRoutes from "./upload/UploadRoutes";
import AuthRoutes from "./auth/AuthRoutes";
let uploadRoutes;
try {
    uploadRoutes = new UploadRoutes();
    console.log("UploadRoutes loaded successfully");
} catch (err) {
    console.error("Failed to load UploadRoutes:", err);
}

export const Routes = [
    new HealthRoutes(),
    new UserRoutes(),
    uploadRoutes, // keep it in the list, even if it's undefined,
    new AuthRoutes(),
];
