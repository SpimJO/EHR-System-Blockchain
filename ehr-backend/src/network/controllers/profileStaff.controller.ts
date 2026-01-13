import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import prisma from "@/db/prisma";
import { HttpError } from "@/lib/error";

/**
 * Staff Profile Controller
 * Handles staff-specific profile management (Figure 48)
 * 
 * Routes:
 * - GET  /api/profile/staff/my - Get current staff's profile
 * - PUT  /api/profile/staff/my - Update staff profile
 * 
 * @access Protected - Requires JWT + Role: STAFF
 */
class ProfileStaffController extends Api {
    private httpError = new HttpError();

    /**
     * GET /api/profile/staff/my
     * 
     * Get authenticated staff's profile information
     * 
     * Returns:
     * - designation (e.g., "Nurse", "Receptionist")
     * - employeeId
     * - phoneNumber
     * - department
     * - city
     * - hospitalName
     */
    public async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is staff
            if (userRole !== "STAFF") {
                return next(this.httpError.forbidden("Access denied. Staff role required."));
            }

            // Fetch staff profile
            const staffProfile = await prisma.staffProfile.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            blockchainAddress: true,
                            createdAt: true,
                        },
                    },
                },
            });

            if (!staffProfile) {
                return next(this.httpError.notFound("Staff profile not found"));
            }

            this.success(res, {
                profile: {
                    id: staffProfile.id,
                    designation: staffProfile.designation,
                    employeeId: staffProfile.employeeId,
                    phoneNumber: staffProfile.phoneNumber,
                    department: staffProfile.department,
                    city: staffProfile.city,
                    hospitalName: staffProfile.hospitalName,
                    createdAt: staffProfile.createdAt,
                    updatedAt: staffProfile.updatedAt,
                },
                user: staffProfile.user,
            }, "Staff profile retrieved successfully");

        } catch (error) {
            console.error("Error in getMyProfile:", error);
            next(error);
        }
    }

    /**
     * PUT /api/profile/staff/my
     * 
     * Update authenticated staff's profile
     * 
     * Body:
     * - designation (required)
     * - employeeId
     * - phoneNumber
     * - department
     * - city
     * - hospitalName
     */
    public async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is staff
            if (userRole !== "STAFF") {
                return next(this.httpError.forbidden("Access denied. Staff role required."));
            }

            const {
                designation,
                employeeId,
                phoneNumber,
                department,
                city,
                hospitalName,
            } = req.body;

            // Validate required fields
            if (!designation) {
                return next(this.httpError.badRequest("Designation is required"));
            }

            // Check if profile exists
            const existingProfile = await prisma.staffProfile.findUnique({
                where: { userId },
            });

            if (!existingProfile) {
                return next(this.httpError.notFound("Staff profile not found"));
            }

            // Check unique constraint for employeeId if updating
            if (employeeId && employeeId !== existingProfile.employeeId) {
                const employeeIdExists = await prisma.staffProfile.findUnique({
                    where: { employeeId },
                });
                if (employeeIdExists) {
                    return next(this.httpError.conflict("Employee ID already in use"));
                }
            }

            // Update profile
            const updatedProfile = await prisma.staffProfile.update({
                where: { userId },
                data: {
                    designation,
                    employeeId: employeeId || null,
                    phoneNumber: phoneNumber || null,
                    department: department || null,
                    city: city || null,
                    hospitalName: hospitalName || null,
                },
            });

            this.success(res, {
                profile: updatedProfile,
            }, "Staff profile updated successfully");

        } catch (error) {
            console.error("Error in updateMyProfile:", error);
            next(error);
        }
    }
}

export default ProfileStaffController;
