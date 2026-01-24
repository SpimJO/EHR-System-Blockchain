import api from "@/http/xior";
import type {
    MedicalRecord,
    UploadRecordRequest,
    ApiResponse,
    PaginatedResponse,
} from "@/types/api.types";

export const recordsService = {
    /**
     * Get all medical records for current patient
     */
    getMyRecords: async (): Promise<ApiResponse<MedicalRecord[]>> => {
        const response = await api.get("/records/my");
        return response.data;
    },

    /**
     * Get records for a specific patient (doctor/staff access)
     */
    getPatientRecords: async (
        patientId: string
    ): Promise<ApiResponse<MedicalRecord[]>> => {
        const response = await api.get(`/records/patient/${patientId}`);
        return response.data;
    },

    /**
     * Get a specific record by ID
     */
    getRecord: async (recordId: string): Promise<ApiResponse<MedicalRecord>> => {
        const response = await api.get(`/records/${recordId}`);
        return response.data;
    },

    /**
     * Upload a new medical record
     */
    uploadRecord: async (
        data: UploadRecordRequest
    ): Promise<ApiResponse<MedicalRecord>> => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("recordType", data.recordType);
        formData.append("recordDate", data.recordDate);
        if (data.description) {
            formData.append("description", data.description);
        }
        formData.append("file", data.file);

        const response = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    /**
     * Download and decrypt a medical record
     */
    downloadRecord: async (recordId: string): Promise<Blob> => {
        const response = await api.get(`/records/${recordId}/download`, {
            responseType: "blob",
        });
        return response.data;
    },

    /**
     * Delete a medical record
     */
    deleteRecord: async (recordId: string): Promise<ApiResponse> => {
        const response = await api.delete(`/records/${recordId}`);
        return response.data;
    },

    /**
     * Get record metadata from blockchain
     */
    getRecordBlockchainInfo: async (
        recordId: string
    ): Promise<
        ApiResponse<{
            transactionHash: string;
            blockNumber: number;
            timestamp: number;
        }>
    > => {
        const response = await api.get(`/records/${recordId}/blockchain`);
        return response.data;
    },
};
