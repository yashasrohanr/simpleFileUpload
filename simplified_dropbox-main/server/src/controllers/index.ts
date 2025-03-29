import UserRoutes from "./user/UserRoutes";
import HealthRoutes from "./health/HealthRoutes";

export const Routes = [
    new HealthRoutes(),
    new UserRoutes()
];