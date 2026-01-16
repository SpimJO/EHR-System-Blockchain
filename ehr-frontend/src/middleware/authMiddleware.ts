import { getSession } from "@/lib/ehr/session";
import { redirect } from "@tanstack/react-router";

/**
 * EHR Frontend auth middleware.
 * Uses the local session created by Login/Register (sessionStorage),
 * keeping the app fully client-side and compatible with the old HTML prototype.
 */
export async function authMiddleware(pathname: string): Promise<void> {
  const session = getSession();
  if (session) return;

  throw redirect({
    to: "/auth/login",
    search: { redirect: pathname },
  });
}

/**
 * Guest-only middleware for login/register routes.
 * If a session exists, redirect to dashboard.
 */
export async function guestOnlyMiddleware(): Promise<void> {
  const session = getSession();
  if (!session) return;
  throw redirect({ to: "/dashboard" });
}