import { createFileRoute, Outlet } from "@tanstack/react-router"
import { authMiddleware } from "@/middleware/authMiddleware"

export const Route = createFileRoute("/dashboard")({
    beforeLoad: async ({ location }) => {
        // Enable authentication - redirects to login if no session
        await authMiddleware(location.pathname);
        return null;
    },
    component: () => <Outlet />
})
