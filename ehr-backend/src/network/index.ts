import auth from "./routes/auth.route";
import sample from "./routes/sample.route";
import dashboard from "./routes/dashboard.route";
import profile from "./routes/profile.route";
import records from "./routes/records.route";
import upload from "./routes/upload.route";
import accessRequests from "./routes/accessRequests.route";
import permissions from "./routes/permissions.route";
import auditLog from "./routes/auditLog.route";
import profileDoctor from "./routes/profileDoctor.route";
import profileStaff from "./routes/profileStaff.route";
import patients from "./routes/patients.route";
import { baseRouter } from "@/lib/baseRouter";


class AppRouter extends baseRouter {
    protected initRoutes(): void {
        this.router.use("/sample", sample);
        this.router.use("/auth", auth);
        this.router.use("/dashboard", dashboard);
        this.router.use("/users", profile);
        this.router.use("/records", records);
        this.router.use("/upload", upload);
        this.router.use("/access-requests", accessRequests);
        this.router.use("/permissions", permissions);
        this.router.use("/audit-log", auditLog);
        this.router.use("/profile/doctor", profileDoctor);
        this.router.use("/profile/staff", profileStaff);
        this.router.use("/patients", patients);
    }
}

export default AppRouter