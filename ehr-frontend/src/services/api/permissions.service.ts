import api from "@/http/xior";
import type { Permission, ApiResponse } from "@/types/api.types";

export const permissionsService = {
    /**
     * Get all active permissions (who has access to my records)
     * For patient: shows who I've granted access to
     */
    getMyPermissions: async (): Promise<ApiResponse<Permission[]>> => {
        const response = await api.get("/permissions/my");
        return response.data;
    },

    /**
     * Revoke permission from a user
     * Removes their access to patient records on blockchain
     */
    revokePermission: async (
        userAddress: string
    ): Promise<
        ApiResponse<{
            transactionHash: string;
            revokedAddress: string;
            status: string;
        }>
    > => {
        const response = await api.post(`/permissions/${userAddress}/revoke`);
        return response.data;
    },

    /**
     * Check if specific user has access to patient records
     */
    checkAccess: async (
        patientId: string,
        userAddress: string
    ): Promise<ApiResponse<{ hasAccess: boolean }>> => {
        const response = await api.get(
            `/permissions/check/${patientId}/${userAddress}`
        );
        return response.data;
    },
};
