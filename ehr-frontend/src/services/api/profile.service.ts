import api from "@/http/xior";
import type {
    PatientProfile,
    DoctorProfile,
    StaffProfile,
    ApiResponse,
} from "@/types/api.types";

export const profileService = {
    // ==================== PATIENT PROFILE ====================
    /**
     * Get patient profile (current logged in patient)
     */
    getMyPatientProfile: async (): Promise<ApiResponse<PatientProfile>> => {
        const response = await api.get("/profile/patient");
        return response.data;
    },

    /**
     * Update patient profile
     */
    updateMyPatientProfile: async (
        data: Partial<PatientProfile>
    ): Promise<ApiResponse<PatientProfile>> => {
        const response = await api.put("/profile/patient", data);
        return response.data;
    },

    // ==================== DOCTOR PROFILE ====================
    /**
     * Get doctor profile (current logged in doctor)
     */
    getMyDoctorProfile: async (): Promise<ApiResponse<DoctorProfile>> => {
        const response = await api.get("/profile/doctor/my");
        return response.data;
    },

    /**
     * Update doctor profile
     */
    updateMyDoctorProfile: async (
        data: Partial<DoctorProfile>
    ): Promise<ApiResponse<DoctorProfile>> => {
        const response = await api.put("/profile/doctor/my", data);
        return response.data;
    },

    // ==================== STAFF PROFILE ====================
    /**
     * Get staff profile (current logged in staff)
     */
    getMyStaffProfile: async (): Promise<ApiResponse<StaffProfile>> => {
        const response = await api.get("/profile/staff/my");
        return response.data;
    },

    /**
     * Update staff profile
     */
    updateMyStaffProfile: async (
        data: Partial<StaffProfile>
    ): Promise<ApiResponse<StaffProfile>> => {
        const response = await api.put("/profile/staff/my", data);
        return response.data;
    },
};
