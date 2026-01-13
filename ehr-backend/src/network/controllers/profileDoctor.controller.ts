import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import prisma from "@/db/prisma";
import { HttpError } from "@/lib/error";

/**
 * Doctor Profile Controller
 * Handles doctor-specific profile management (Figure 43)
 * 
 * Routes:
 * - GET  /api/profile/doctor/my - Get current doctor's profile
 * - PUT  /api/profile/doctor/my - Update doctor profile
 * 
 * @access Protected - Requires JWT + Role: DOCTOR
 */
class ProfileDoctorController extends Api {
    private httpError = new HttpError();

    /**
     * GET /api/profile/doctor/my
     * 
     * Get authenticated doctor's profile information
     * 
     * Returns:
     * - designation (e.g., "Cardiologist")
     * - specialization
     * - licenseNumber
     * - medicalId
     * - phoneNumber
     * - department
     * - city
     * - hospitalName
     * - yearsOfExperience
     */
    public async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is doctor
            if (userRole !== "DOCTOR") {
                return next(this.httpError.forbidden("Access denied. Doctor role required."));
            }

            // Fetch doctor profile
            const doctorProfile = await prisma.doctorProfile.findUnique({
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

            if (!doctorProfile) {
                return next(this.httpError.notFound("Doctor profile not found"));
            }

            this.success(res, {
                profile: {
                    id: doctorProfile.id,
                    designation: doctorProfile.designation,
                    specialization: doctorProfile.specialization,
                    licenseNumber: doctorProfile.licenseNumber,
                    medicalId: doctorProfile.medicalId,
                    phoneNumber: doctorProfile.phoneNumber,
                    department: doctorProfile.department,
                    city: doctorProfile.city,
                    hospitalName: doctorProfile.hospitalName,
                    yearsOfExperience: doctorProfile.yearsOfExperience,
                    createdAt: doctorProfile.createdAt,
                    updatedAt: doctorProfile.updatedAt,
                },
                user: doctorProfile.user,
            }, "Doctor profile retrieved successfully");

        } catch (error) {
            console.error("Error in getMyProfile:", error);
            next(error);
        }
    }

    /**
     * PUT /api/profile/doctor/my
     * 
     * Update authenticated doctor's profile
     * 
     * Body:
     * - designation (required)
     * - specialization
     * - licenseNumber
     * - medicalId
     * - phoneNumber
     * - department
     * - city
     * - hospitalName
     * - yearsOfExperience
     */
    public async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is doctor
            if (userRole !== "DOCTOR") {
                return next(this.httpError.forbidden("Access denied. Doctor role required."));
            }

            const {
                designation,
                specialization,
                licenseNumber,
                medicalId,
                phoneNumber,
                department,
                city,
                hospitalName,
                yearsOfExperience,
            } = req.body;

            // Validate required fields
            if (!designation) {
                return next(this.httpError.badRequest("Designation is required"));
            }

            // Check if profile exists
            const existingProfile = await prisma.doctorProfile.findUnique({
                where: { userId },
            });

            if (!existingProfile) {
                return next(this.httpError.notFound("Doctor profile not found"));
            }

            // Check unique constraints if updating
            if (licenseNumber && licenseNumber !== existingProfile.licenseNumber) {
                const licenseExists = await prisma.doctorProfile.findUnique({
                    where: { licenseNumber },
                });
                if (licenseExists) {
                    return next(this.httpError.conflict("License number already in use"));
                }
            }

            if (medicalId && medicalId !== existingProfile.medicalId) {
                const medicalIdExists = await prisma.doctorProfile.findUnique({
                    where: { medicalId },
                });
                if (medicalIdExists) {
                    return next(this.httpError.conflict("Medical ID already in use"));
                }
            }

            // Update profile
            const updatedProfile = await prisma.doctorProfile.update({
                where: { userId },
                data: {
                    designation,
                    specialization: specialization || null,
                    licenseNumber: licenseNumber || null,
                    medicalId: medicalId || null,
                    phoneNumber: phoneNumber || null,
                    department: department || null,
                    city: city || null,
                    hospitalName: hospitalName || null,
                    yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
                },
            });

            this.success(res, {
                profile: updatedProfile,
            }, "Doctor profile updated successfully");

        } catch (error) {
            console.error("Error in updateMyProfile:", error);
            next(error);
        }
    }
}

export default ProfileDoctorController;
