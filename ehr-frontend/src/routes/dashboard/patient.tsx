import PatientDashboard from "@/app/(dashboard)/patient/PatientDashboard"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/patient")({
    component: PatientDashboard
})
