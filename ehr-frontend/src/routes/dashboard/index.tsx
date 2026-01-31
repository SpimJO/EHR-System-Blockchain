import Dashboard from "@/app/(dashboard)/Dashboard"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
    component: Dashboard
})
