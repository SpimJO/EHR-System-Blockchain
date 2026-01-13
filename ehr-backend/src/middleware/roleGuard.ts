import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/error";

const httpError = new HttpError();

export const roleGuard = (requiredRole: string | string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRole = req.user?.role;

		if (!userRole) {
			next(httpError.unauthorized("User not authenticated"));
			return;
		}

		// Support both single role and array of roles
		const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

		if (!allowedRoles.includes(userRole)) {
			next(httpError.forbidden("Access denied. Insufficient role"));
			return;
		}

		next();
	};
};
