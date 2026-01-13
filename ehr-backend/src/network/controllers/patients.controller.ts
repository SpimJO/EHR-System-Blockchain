import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import prisma from "@/db/prisma";
import ehrBlockchainService from "@/blockchain/ehrService";
import { HttpError } from "@/lib/error";

/**
 * Patients Controller
 * Handles "My Patients" feature for doctors/staff (Figure 47)
 * 
 * Shows list of patients that doctor/staff has been granted access to
 * 
 * Routes:
 * - GET /api/patients/my - Get list of authorized patients
 * 
 * @access Protected - Requires JWT + Role: DOCTOR or STAFF
 */
class PatientsController extends Api {
    private httpError = new HttpError();

    /**
     * GET /api/patients/my
     * 
     * Get list of patients that the authenticated doctor/staff has access to
     * 
     * Data Flow:
     * 1. Query blockchain for AccessGranted events WHERE authorizedUser = doctorAddress
     * 2. Extract unique patient addresses
     * 3. For each patient:
     *    - Get patient details from Prisma (by blockchain address)
     *    - Get record count from blockchain
     *    - Get grant timestamp from event
     * 
     * Returns:
     * - List of patients with: name, address, recordCount, grantedAt
     * 
     * @access Protected - Requires DOCTOR or STAFF role
     */
    public async getMyPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is doctor or staff
            if (!["DOCTOR", "STAFF"].includes(userRole || "")) {
                return next(this.httpError.forbidden("Access denied. Doctor or Staff role required."));
            }

            // Get user's blockchain address
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    blockchainAddress: true,
                    fullName: true,
                },
            });

            if (!user?.blockchainAddress) {
                return next(this.httpError.badRequest("User does not have blockchain address"));
            }

            const doctorAddress = user.blockchainAddress;

            console.log(`📋 Fetching patients for: ${user.fullName} (${doctorAddress})`);

            // Query blockchain for patients this doctor has access to
            try {
                const authorizedPatients = await ehrBlockchainService.getMyAuthorizedPatients(doctorAddress);

                // Enrich with patient details from Prisma
                const enrichedPatients = await Promise.all(
                    authorizedPatients.map(async (patient) => {
                        // Find patient by blockchain address
                        const patientUser = await prisma.user.findUnique({
                            where: { blockchainAddress: patient.patientAddress },
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true,
                                createdAt: true,
                            },
                        });

                        return {
                            patientAddress: patient.patientAddress,
                            patientName: patientUser?.fullName || "Unknown Patient",
                            patientEmail: patientUser?.email || null,
                            patientId: patientUser?.id || null,
                            recordCount: patient.recordCount,
                            grantedAt: patient.grantedAt,
                            grantedAtDate: new Date(patient.grantedAt * 1000).toISOString(),
                            isActive: true,
                        };
                    })
                );

                this.success(res, {
                    total: enrichedPatients.length,
                    patients: enrichedPatients,
                    doctorInfo: {
                        name: user.fullName,
                        address: doctorAddress,
                    },
                }, "Authorized patients retrieved successfully");

            } catch (blockchainError) {
                console.error("Blockchain error:", blockchainError);
                return next(this.httpError.internalServerError("Failed to fetch patients from blockchain"));
            }

        } catch (error) {
            console.error("Error in getMyPatients:", error);
            next(error);
        }
    }
}

export default PatientsController;
