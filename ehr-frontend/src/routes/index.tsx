import Home from "@/app/(root)/Home"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
    component: Home
})
