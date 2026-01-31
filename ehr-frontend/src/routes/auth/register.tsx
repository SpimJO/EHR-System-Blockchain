import Register from "@/app/(auth)/Register"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/register")({
    component: Register
})
