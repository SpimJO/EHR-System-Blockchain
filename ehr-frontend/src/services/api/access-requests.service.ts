import api from "@/http/xior";
import type {
    AccessRequest,
    RequestAccessRequest,
    ApiResponse,
} from "@/types/api.types";

export const accessRequestsService = {
    /**
     * Get pending access requests for patient
     * (Shows who wants to access patient's records)
     */
    getMyAccessRequests: async (): Promise<ApiResponse<AccessRequest[]>> => {
        const response = await api.get("/access-requests/my");
        return response.data;
    },

    /**
     * Get outgoing access requests (for doctor/staff)
     * (Shows requests I've made to access patient records)
     */
    getMyOutgoingRequests: async (): Promise<ApiResponse<AccessRequest[]>> => {
        const response = await api.get("/access-requests/my-outgoing");
        return response.data;
    },

    /**
     * Request access to patient's medical records (Doctor/Staff only)
     */
    requestAccess: async (
        data: RequestAccessRequest
    ): Promise<
        ApiResponse<{
            transactionHash: string;
            patientAddress: string;
            status: string;
        }>
    > => {
        const response = await api.post("/access-requests/request", data);
        return response.data;
    },

    /**
     * Approve an access request (Patient only)
     */
    approveRequest: async (
        requesterAddress: string
    ): Promise<
        ApiResponse<{
            transactionHash: string;
            authorizedAddress: string;
            status: string;
        }>
    > => {
        const response = await api.post(
            `/access-requests/${requesterAddress}/approve`
        );
        return response.data;
    },

    /**
     * Deny an access request (Patient only)
     */
    denyRequest: async (
        requesterAddress: string
    ): Promise<
        ApiResponse<{
            transactionHash: string;
            deniedAddress: string;
            status: string;
        }>
    > => {
        const response = await api.post(
            `/access-requests/${requesterAddress}/deny`
        );
        return response.data;
    },
};
