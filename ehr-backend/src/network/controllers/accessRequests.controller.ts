import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import ehrBlockchainService from "@/blockchain/ehrService";
import prisma from "@/db/prisma";
import { HttpError } from "@/lib/error";

/**
 * Access Requests Controller
 * Handles viewing and managing access requests from doctors/staff
 * 
 * ⚠️ HYBRID OPERATIONS - Blockchain + Prisma
 * 
 * Flow:
 * 1. Read pending requests from blockchain
 * 2. Approve/Deny triggers blockchain transaction
 * 3. Request access creates Prisma record + blockchain transaction
 * 4. Blockchain emits audit event
 */
class AccessRequestsController extends Api {
    private httpError = new HttpError();

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
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Get patient blockchain address
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { blockchainAddress: true }
            });

            if (!user || !user.blockchainAddress) {
                this.error(res, 400, "Blockchain address not found. Please contact support.");
                return;
            }

            const patientBlockchainAddress = user.blockchainAddress;

            // 🔥 BLOCKCHAIN QUERY - Get pending access requests
            const pendingRequests = await ehrBlockchainService.getPendingRequests(patientBlockchainAddress);

            // Enrich with user details from Prisma (optional, read-only)
            const enrichedRequests = await Promise.all(
                pendingRequests.map(async (request) => {
                    const requester = await prisma.user.findUnique({
                        where: { blockchainAddress: request.requester },
                        select: { fullName: true, role: true, email: true }
                    });

                    return {
                        requesterAddress: request.requester,
                        requestedAt: Number(request.requestedAt),
                        status: request.status, // 0 = pending, 1 = approved, 2 = denied
                        requesterName: requester?.fullName || "Unknown",
                        requesterRole: requester?.role || "Unknown"
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
            const userRole = req.user?.role;
            const requesterAddress: string = Array.isArray(req.params.requesterAddress) ? req.params.requesterAddress[0] : req.params.requesterAddress;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Validate requester address
            if (!requesterAddress || !requesterAddress.startsWith("0x")) {
                this.error(res, 400, "Invalid requester address");
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
            const userRole = req.user?.role;
            const requesterAddress: string = Array.isArray(req.params.requesterAddress) ? req.params.requesterAddress[0] : req.params.requesterAddress;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Validate requester address
            if (!requesterAddress || !requesterAddress.startsWith("0x")) {
                this.error(res, 400, "Invalid requester address");
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

    /**
     * POST /access-requests/request
     * 
     * Request access to patient records (Figures 44, 49)
     * 
     * HYBRID OPERATION:
     * 1. Create AccessRequest record in Prisma (stores reason off-chain for privacy)
     * 2. Call smart contract requestAccess() (emits blockchain event)
     * 3. Return both database ID and transaction hash
     * 
     * @access Protected - Requires JWT + Role: DOCTOR or STAFF
     */
    public async requestAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const { patientId, reason } = req.body;

            // Validate user is doctor or staff
            if (userRole !== "DOCTOR" && userRole !== "STAFF") {
                this.error(res, 403, "Access denied. Doctor or Staff role required.");
                return;
            }

            // Validate input
            if (!patientId) {
                this.error(res, 400, "Patient ID is required");
                return;
            }

            if (!reason || reason.trim().length === 0) {
                this.error(res, 400, "Access request reason is required");
                return;
            }

            if (reason.length > 500) {
                this.error(res, 400, "Reason cannot exceed 500 characters");
                return;
            }

            // Get requester and patient details
            const [requester, patient] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: userId },
                    select: { blockchainAddress: true, role: true }
                }),
                prisma.user.findUnique({
                    where: { id: patientId },
                    select: { blockchainAddress: true, role: true }
                })
            ]);

            if (!requester || !requester.blockchainAddress) {
                next(this.httpError.notFound("Requester blockchain address not found"));
                return;
            }

            if (!patient || !patient.blockchainAddress) {
                next(this.httpError.notFound("Patient not found or has no blockchain address"));
                return;
            }

            if (patient.role !== "PATIENT") {
                this.error(res, 400, "Target user is not a patient");
                return;
            }

            // Check if request already exists and is pending
            const existingRequest = await prisma.accessRequest.findFirst({
                where: {
                    requesterId: userId,
                    patientId: patientId,
                    status: "PENDING"
                }
            });

            if (existingRequest) {
                this.error(res, 409, "You already have a pending request for this patient");
                return;
            }

            console.log(`📝 Creating access request from ${requester.blockchainAddress} to ${patient.blockchainAddress}`);

            // STEP 1: Create Prisma record (off-chain reason storage for privacy)
            const accessRequest = await prisma.accessRequest.create({
                data: {
                    requesterId: userId!,
                    patientId: patientId,
                    reason: reason.trim(),
                    status: "PENDING"
                },
                include: {
                    requester: {
                        select: {
                            fullName: true,
                            email: true,
                            role: true
                        }
                    },
                    patient: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    }
                }
            });

            // STEP 2: Call blockchain requestAccess()
            const txHash = await ehrBlockchainService.requestAccess(patient.blockchainAddress);

            console.log(`⛓️  Blockchain transaction: ${txHash}`);

            this.created(res, {
                requestId: accessRequest.id,
                transactionHash: txHash,
                status: accessRequest.status,
                requester: {
                    name: accessRequest.requester.fullName,
                    email: accessRequest.requester.email,
                    role: accessRequest.requester.role
                },
                patient: {
                    name: accessRequest.patient.fullName,
                    email: accessRequest.patient.email
                },
                reason: accessRequest.reason,
                requestedAt: accessRequest.createdAt
            }, "Access request submitted successfully");

        } catch (error) {
            console.error("Error in requestAccess:", error);
            next(error);
        }
    }

    /**
     * GET /access-requests/my-outgoing
     * 
     * Get list of access requests I (doctor/staff) have sent
     * 
     * @access Protected - Requires JWT + Role: DOCTOR or STAFF
     */
    public async getMyOutgoingRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is doctor or staff
            if (userRole !== "DOCTOR" && userRole !== "STAFF") {
                this.error(res, 403, "Access denied. Doctor or Staff role required.");
                return;
            }

            // Query Prisma for all requests sent by this user
            const requests = await prisma.accessRequest.findMany({
                where: {
                    requesterId: userId
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            this.success(res, {
                total: requests.length,
                requests: requests.map(req => ({
                    requestId: req.id,
                    patient: {
                        id: req.patient.id,
                        name: req.patient.fullName,
                        email: req.patient.email
                    },
                    reason: req.reason,
                    status: req.status,
                    requestedAt: req.createdAt,
                    respondedAt: req.respondedAt
                }))
            }, "Outgoing access requests retrieved successfully");

        } catch (error) {
            console.error("Error in getMyOutgoingRequests:", error);
            next(error);
        }
    }
}

export default AccessRequestsController;
