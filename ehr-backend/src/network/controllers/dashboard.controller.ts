import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import ehrBlockchainService from "@/blockchain/ehrService";
import prisma from "@/db/prisma";

/**
 * Dashboard Controller
 * Handles patient dashboard data aggregation
 * Data flow: Blockchain (authoritative) + Prisma (support)
 */
class DashboardController extends Api {

    /**
     * GET /dashboard/patient
     * 
     * Returns dashboard summary for authenticated patient
     * 
     * Cards:
     * - Total Records (from blockchain)
     * - Authorized Users (from blockchain)
     * - Pending Requests (from blockchain)
     * - Recent Activities (from blockchain events)
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getPatientDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract authenticated user from middleware
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Fetch user from database to get blockchain address
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    blockchainAddress: true
                }
            });

            if (!user) {
                this.error(res, 404, "User not found");
                return;
            }

            if (!user.blockchainAddress) {
                this.error(res, 400, "Blockchain address not found. Please contact support.");
                return;
            }

            const patientBlockchainAddress = user.blockchainAddress;

            // 🔥 BLOCKCHAIN QUERY (Source of Truth)
            const blockchainData = await ehrBlockchainService.getPatientDashboard(patientBlockchainAddress);

            // Optional: Enrich activities with user names from Prisma
            const enrichedActivities = await this.enrichActivitiesWithNames(blockchainData.recentActivities);

            // Aggregate response
            const dashboardData = {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
                },
                cards: {
                    totalRecords: blockchainData.totalRecords,
                    authorizedUsers: blockchainData.authorizedUsers,
                    pendingRequests: blockchainData.pendingRequests
                },
                recentActivities: enrichedActivities
            };

            this.success(res, dashboardData, "Patient dashboard retrieved successfully");

        } catch (error) {
            console.error("Error in getPatientDashboard:", error);
            next(error);
        }
    }

    /**
     * Enrich blockchain activities with human-readable names from Prisma
     * @param activities - Raw blockchain events
     * @returns Activities with user names attached
     */
    private async enrichActivitiesWithNames(activities: any[]): Promise<any[]> {
        try {
            // Extract unique addresses from activities
            const addresses = new Set<string>();
            activities.forEach(activity => {
                if (activity.details.authorizedUser) addresses.add(activity.details.authorizedUser);
                if (activity.details.revokedUser) addresses.add(activity.details.revokedUser);
                if (activity.details.requester) addresses.add(activity.details.requester);
            });

            // TODO: When blockchainAddress is added to User model, query users
            // const users = await prisma.user.findMany({
            //     where: {
            //         blockchainAddress: { in: Array.from(addresses) }
            //     },
            //     select: {
            //         blockchainAddress: true,
            //         fullName: true,
            //         role: true
            //     }
            // });

            // For now, return activities as-is
            return activities.map(activity => ({
                type: activity.type,
                timestamp: activity.timestamp,
                description: this.generateActivityDescription(activity)
            }));

        } catch (error) {
            console.error("Error enriching activities:", error);
            // Return original activities if enrichment fails
            return activities;
        }
    }

    /**
     * Generate human-readable description for activity
     */
    private generateActivityDescription(activity: any): string {
        switch (activity.type) {
            case "RecordUploaded":
                return `New medical record uploaded`;
            case "AccessGranted":
                return `Access granted to ${activity.details.authorizedUser}`;
            case "AccessRevoked":
                return `Access revoked from ${activity.details.revokedUser}`;
            case "AccessRequested":
                return `Access requested by ${activity.details.requester}`;
            default:
                return "Unknown activity";
        }
    }
}

export default DashboardController;
