import DoctorDashboard from "@/app/(dashboard)/doctor/DoctorDashboard"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/doctor")({
    component: DoctorDashboard
})
