import { RootRoute } from "./routers/root.route";
import { DashboardRoute, PatientDashboardRoute, DoctorDashboardRoute, StaffDashboardRoute } from "./routers/dash.routes";
import { guestOnlyMiddleware } from "@/middleware/authMiddleware";
import { LoginRoute, RegisterRoute } from "./routers/auth.routes";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <Toaster />
        </>
    ),
});

export const DashboardLayout = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    beforeLoad: async () => {
        // UI Preview Mode - Authentication disabled for now
        // await authMiddleware(location.pathname);
        return null;
    },
    component: () => <Outlet />
})

export const AuthLayout = createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth",
    beforeLoad: async () => {
        // Redirect authenticated users away from auth pages.
        // (Still allows direct access to /auth/login and /auth/register if not logged in.)
        await guestOnlyMiddleware();
    },
    component: () => <Outlet />
})

export const routerTree = rootRoute.addChildren([
    DashboardLayout.addChildren([
        DashboardRoute,
        PatientDashboardRoute,
        DoctorDashboardRoute,
        StaffDashboardRoute
    ]),
    AuthLayout.addChildren([
        LoginRoute,
        RegisterRoute
    ]),
    RootRoute
]);