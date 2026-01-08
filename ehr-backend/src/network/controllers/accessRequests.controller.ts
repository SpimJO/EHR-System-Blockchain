import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import { prisma } from "@/db/prisma";
import ehrBlockchainService from "@/blockchain/ehrService";

/**
 * Access Requests Controller
 * Handles viewing and managing access requests from doctors/staff
 * 
 * ⚠️ PURE BLOCKCHAIN OPERATIONS - NO PRISMA WRITES
 * 
 * Flow:
 * 1. Read pending requests from blockchain
 * 2. Approve/Deny triggers blockchain transaction
 * 3. Blockchain emits audit event
 */
class AccessRequestsController extends Api {

    /**
     * GET /access-requests/my
     * 
     * Returns list of pending access requests for authenticated patient
     * 
     * Data source: BLOCKCHAIN ONLY
     * - Reads pending requests from smart contract
     * - Optionally enriches with user names from Prisma (read-only)
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getMyAccessRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, "Access denied. Patient role required.", 403);
                return;
            }

            // Get patient blockchain address
            // TODO: Replace with actual user.blockchainAddress
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // 🔥 BLOCKCHAIN QUERY - Get pending access requests
            const pendingRequests = await ehrBlockchainService.getPendingRequests(patientBlockchainAddress);

            // Enrich with user details from Prisma (optional, read-only)
            const enrichedRequests = await Promise.all(
                pendingRequests.map(async (request) => {
                    // TODO: When blockchainAddress is added to User model:
                    // const requester = await prisma.user.findUnique({
                    //     where: { blockchainAddress: request.requester },
                    //     select: { fullName: true, role: true, email: true }
                    // });

                    return {
                        requesterAddress: request.requester,
                        requestedAt: Number(request.requestedAt),
                        status: request.status, // 0 = pending, 1 = approved, 2 = denied
                        // requesterName: requester?.fullName || "Unknown",
                        // requesterRole: requester?.role || "Unknown"
                    };
                })
            );

            this.success(res, {
                total: enrichedRequests.length,
                requests: enrichedRequests
            }, "Access requests retrieved successfully");

        } catch (error) {
            console.error("Error in getMyAccessRequests:", error);
            next(error);
        }
    }

    /**
     * POST /access-requests/:requesterAddress/approve
     * 
     * Approve access request from a doctor/staff
     * 
     * ⚠️ BLOCKCHAIN TRANSACTION - NO PRISMA WRITE
     * 
     * Flow:
     * 1. Validate requester address
     * 2. Call smart contract approveAccess()
     * 3. Blockchain emits AccessGranted event
     * 4. Return transaction hash
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async approveAccessRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const requesterAddress = req.params.requesterAddress;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, "Access denied. Patient role required.", 403);
                return;
            }

            // Validate requester address
            if (!requesterAddress || !requesterAddress.startsWith("0x")) {
                this.error(res, "Invalid requester address", 400);
                return;
            }

            console.log(`✅ Approving access for: ${requesterAddress}`);

            // 🔥 BLOCKCHAIN TRANSACTION - Approve access
            const txHash = await ehrBlockchainService.approveAccess(requesterAddress);

            console.log(`⛓️  Transaction hash: ${txHash}`);

            this.success(res, {
                transactionHash: txHash,
                requesterAddress,
                status: "approved"
            }, "Access request approved successfully");

        } catch (error) {
            console.error("Error in approveAccessRequest:", error);
            next(error);
        }
    }

    /**
     * POST /access-requests/:requesterAddress/deny
     * 
     * Deny access request from a doctor/staff
     * 
     * ⚠️ BLOCKCHAIN TRANSACTION - NO PRISMA WRITE
     * 
     * Flow:
     * 1. Validate requester address
     * 2. Call smart contract denyAccess()
     * 3. Blockchain emits event
     * 4. Return transaction hash
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async denyAccessRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const requesterAddress = req.params.requesterAddress;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, "Access denied. Patient role required.", 403);
                return;
            }

            // Validate requester address
            if (!requesterAddress || !requesterAddress.startsWith("0x")) {
                this.error(res, "Invalid requester address", 400);
                return;
            }

            console.log(`❌ Denying access for: ${requesterAddress}`);

            // 🔥 BLOCKCHAIN TRANSACTION - Deny access
            const txHash = await ehrBlockchainService.denyAccess(requesterAddress);

            console.log(`⛓️  Transaction hash: ${txHash}`);

            this.success(res, {
                transactionHash: txHash,
                requesterAddress,
                status: "denied"
            }, "Access request denied successfully");

        } catch (error) {
            console.error("Error in denyAccessRequest:", error);
            next(error);
        }
    }
}

export default AccessRequestsController;
