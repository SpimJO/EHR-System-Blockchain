import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import { prisma } from "@/db/prisma";
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
                this.error(res, "User not authenticated", 401);
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
                    dateOfBirth: true,
                    gender: true,
                    bloodGroup: true,
                    phoneNumber: true,
                    address: true,
                    createdAt: true,
                    updatedAt: true
                    // ❌ Password excluded for security
                }
            });

            if (!user) {
                this.error(res, "User not found", 404);
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
                this.error(res, "User not authenticated", 401);
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
                this.error(res, "Invalid gender value. Must be MALE, FEMALE, or OTHER", 400);
                return;
            }

            // Validate date of birth if provided
            let parsedDateOfBirth: Date | undefined;
            if (dateOfBirth) {
                parsedDateOfBirth = new Date(dateOfBirth);
                if (isNaN(parsedDateOfBirth.getTime())) {
                    this.error(res, "Invalid date of birth format", 400);
                    return;
                }

                // Ensure date is not in the future
                if (parsedDateOfBirth > new Date()) {
                    this.error(res, "Date of birth cannot be in the future", 400);
                    return;
                }
            }

            // Build update object (only include provided fields)
            const updateData: any = {};
            if (fullName !== undefined) updateData.fullName = fullName;
            if (parsedDateOfBirth !== undefined) updateData.dateOfBirth = parsedDateOfBirth;
            if (gender !== undefined) updateData.gender = gender;
            if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            if (address !== undefined) updateData.address = address;

            // Check if there's anything to update
            if (Object.keys(updateData).length === 0) {
                this.error(res, "No valid fields to update", 400);
                return;
            }

            // Update user profile
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    dateOfBirth: true,
                    gender: true,
                    bloodGroup: true,
                    phoneNumber: true,
                    address: true,
                    updatedAt: true
                }
            });

            this.success(res, updatedUser, "Profile updated successfully");

        } catch (error) {
            console.error("Error in updateMyProfile:", error);
            next(error);
        }
    }
}

export default ProfileController;
