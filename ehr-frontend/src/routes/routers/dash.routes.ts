import { DashboardLayout } from "../_root"
import Dashboard from "@/app/(dashboard)/Dashboard"
import PatientDashboard from "@/app/(dashboard)/patient/PatientDashboard.tsx"
import DoctorDashboard from "@/app/(dashboard)/doctor/DoctorDashboard"
import StaffDashboard from "@/app/(dashboard)/staff/StaffDashboard"
import { createRoute } from "@tanstack/react-router"

export const DashboardRoute = createRoute({
    getParentRoute: () => DashboardLayout,
    path: "/",
    component: Dashboard
})

export const PatientDashboardRoute = createRoute({
    getParentRoute: () => DashboardLayout,
    path: "/patient",
    component: PatientDashboard
})

export const DoctorDashboardRoute = createRoute({
    getParentRoute: () => DashboardLayout,
    path: "/doctor",
    component: DoctorDashboard
})

export const StaffDashboardRoute = createRoute({
    getParentRoute: () => DashboardLayout,
    path: "/staff",
    component: StaffDashboard
})