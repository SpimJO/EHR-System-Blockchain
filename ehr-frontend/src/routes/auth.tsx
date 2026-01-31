import { createFileRoute, Outlet } from "@tanstack/react-router"
import { guestOnlyMiddleware } from "@/middleware/authMiddleware";

export const Route = createFileRoute("/auth")({
    beforeLoad: async () => {
        // Redirect logged-in users to dashboard
        await guestOnlyMiddleware();
    },
    component: () => <Outlet />
})
