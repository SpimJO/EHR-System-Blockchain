import StaffDashboard from "@/app/(dashboard)/staff/StaffDashboard"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/staff")({
    component: StaffDashboard
})
