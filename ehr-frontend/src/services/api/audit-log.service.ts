import api from "@/http/xior";
import type { AuditLogResponse, ApiResponse } from "@/types/api.types";

export const auditLogService = {
    /**
     * Get audit log entries for current user
     * Fetched directly from blockchain events
     */
    getMyAuditLog: async (params?: {
        limit?: number;
        offset?: number;
        actionType?: string;
    }): Promise<ApiResponse<AuditLogResponse>> => {
        const response = await api.get("/audit-log/my", { params });
        return response.data;
    },

    /**
     * Get audit log for specific patient (doctor/staff with access)
     */
    getPatientAuditLog: async (
        patientId: string,
        params?: {
            limit?: number;
            offset?: number;
            actionType?: string;
        }
    ): Promise<ApiResponse<AuditLogResponse>> => {
        const response = await api.get(`/audit-log/patient/${patientId}`, {
            params,
        });
        return response.data;
    },

    /**
     * Verify an audit log entry on blockchain
     */
    verifyAuditEntry: async (
        transactionHash: string
    ): Promise<
        ApiResponse<{
            isValid: boolean;
            blockNumber: number;
            timestamp: number;
            details: any;
        }>
    > => {
        const response = await api.get(`/audit-log/verify/${transactionHash}`);
        return response.data;
    },
};
