import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import prisma from "@/db/prisma";
import { Gender } from "@prisma/client";

/**
 * Profile Controller
 * Handles patient profile view and edit operations
 * 
 * ⚠️ NO BLOCKCHAIN INTERACTION HERE
 * This is pure user profile metadata management
 */
class ProfileController extends Api {

    /**
     * GET /users/me
     * 
     * Returns authenticated user's profile information
     * 
     * @access Protected - Requires JWT
     */
    public async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                this.error(res, 401, "User not authenticated");
                return;
            }

            // Fetch user profile from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    patientProfile: {
                        select: {
                            dateOfBirth: true,
                            gender: true,
                            bloodGroup: true,
                            phoneNumber: true,
                            address: true
                        }
                    }
                    // ❌ Password excluded for security
                }
            });

            if (!user) {
                this.error(res, 404, "User not found");
                return;
            }

            this.success(res, user, "Profile retrieved successfully");

        } catch (error) {
            console.error("Error in getMyProfile:", error);
            next(error);
        }
    }

    /**
     * PUT /users/me
     * 
     * Updates authenticated user's profile information
     * 
     * Editable fields:
     * - fullName
     * - dateOfBirth
     * - gender
     * - bloodGroup
     * - phoneNumber
     * - address
     * 
     * ❌ Cannot update: email, password, role (requires separate endpoints)
     * 
     * @access Protected - Requires JWT
     */
    public async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                this.error(res, 401, "User not authenticated");
                return;
            }

            // Extract editable fields from request body
            const {
                fullName,
                dateOfBirth,
                gender,
                bloodGroup,
                phoneNumber,
                address
            } = req.body;

            // Validate gender enum if provided
            if (gender && !Object.values(Gender).includes(gender)) {
                this.error(res, 400, "Invalid gender value. Must be MALE, FEMALE, or OTHER");
                return;
            }

            // Validate date of birth if provided
            let parsedDateOfBirth: Date | undefined;
            if (dateOfBirth) {
                parsedDateOfBirth = new Date(dateOfBirth);
                if (isNaN(parsedDateOfBirth.getTime())) {
                    this.error(res, 400, "Invalid date of birth format");
                    return;
                }

                // Ensure date is not in the future
                if (parsedDateOfBirth > new Date()) {
                    this.error(res, 400, "Date of birth cannot be in the future");
                    return;
                }
            }

            // Build update object (only include provided fields)
            const updateData: any = {};
            if (fullName !== undefined) updateData.fullName = fullName;

            // Check if there's anything to update on User
            let updatedUser;
            if (Object.keys(updateData).length > 0) {
                // Update user profile
                updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        updatedAt: true,
                        patientProfile: {
                            select: {
                                dateOfBirth: true,
                                gender: true,
                                bloodGroup: true,
                                phoneNumber: true,
                                address: true
                            }
                        }
                    }
                });
            } else {
                updatedUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        updatedAt: true,
                        patientProfile: {
                            select: {
                                dateOfBirth: true,
                                gender: true,
                                bloodGroup: true,
                                phoneNumber: true,
                                address: true
                            }
                        }
                    }
                });
            }

            // Update patient profile if any patient-specific fields are provided
            const patientUpdateData: any = {};
            if (parsedDateOfBirth !== undefined) patientUpdateData.dateOfBirth = parsedDateOfBirth;
            if (gender !== undefined) patientUpdateData.gender = gender;
            if (bloodGroup !== undefined) patientUpdateData.bloodGroup = bloodGroup;
            if (phoneNumber !== undefined) patientUpdateData.phoneNumber = phoneNumber;
            if (address !== undefined) patientUpdateData.address = address;

            if (Object.keys(patientUpdateData).length > 0) {
                // Update or create patient profile
                await prisma.patientProfile.upsert({
                    where: { userId },
                    update: patientUpdateData,
                    create: {
                        userId,
                        dateOfBirth: parsedDateOfBirth || new Date(),
                        gender: gender || 'OTHER',
                        bloodGroup: bloodGroup || 'Unknown',
                        ...patientUpdateData
                    }
                });

                // Refetch user with updated patient profile
                updatedUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        updatedAt: true,
                        patientProfile: {
                            select: {
                                dateOfBirth: true,
                                gender: true,
                                bloodGroup: true,
                                phoneNumber: true,
                                address: true
                            }
                        }
                    }
                });
            }

            if (!updatedUser) {
                this.error(res, 404, "User not found");
                return;
            }

            this.success(res, updatedUser, "Profile updated successfully");

        } catch (error) {
            console.error("Error in updateMyProfile:", error);
            next(error);
        }
    }
}

export default ProfileController;
