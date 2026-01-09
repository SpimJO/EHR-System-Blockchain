import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/error";

const httpError = new HttpError();

export const roleGuard = (requiredRole: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRole = req.user?.role;

		if (!userRole) {
			next(httpError.unauthorized("User not authenticated"));
			return;
		}

		if (userRole !== requiredRole) {
			next(httpError.forbidden("Access denied. Insufficient role"));
			return;
		}

		next();
	};
};
