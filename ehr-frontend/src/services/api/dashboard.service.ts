import api from "@/http/xior";
import type {
    PatientDashboard,
    DoctorDashboard,
    AuthorizedPatient,
    ApiResponse,
} from "@/types/api.types";

export const dashboardService = {
    /**
     * Get patient dashboard data
     * Includes: total records, authorized users, pending requests, recent activity
     */
    getPatientDashboard: async (): Promise<ApiResponse<PatientDashboard>> => {
        const response = await api.get("/dashboard/patient");
        return response.data;
    },

    /**
     * Get doctor dashboard data
     * Includes: total patients, pending requests, records accessed
     */
    getDoctorDashboard: async (): Promise<ApiResponse<DoctorDashboard>> => {
        const response = await api.get("/dashboard/doctor");
        return response.data;
    },

    /**
     * Get staff dashboard data (similar to doctor)
     */
    getStaffDashboard: async (): Promise<ApiResponse<DoctorDashboard>> => {
        const response = await api.get("/dashboard/staff");
        return response.data;
    },
};

export const patientsService = {
    /**
     * Get list of patients I have access to (Doctor/Staff only)
     * Queries blockchain for AccessGranted events
     */
    getMyPatients: async (): Promise<
        ApiResponse<{
            total: number;
            patients: AuthorizedPatient[];
        }>
    > => {
        const response = await api.get("/patients/my");
        return response.data;
    },

    /**
     * Get specific patient details (if have access)
     */
    getPatientDetails: async (
        patientId: string
    ): Promise<
        ApiResponse<{
            patient: AuthorizedPatient;
            recordCount: number;
        }>
    > => {
        const response = await api.get(`/patients/${patientId}`);
        return response.data;
    },
};
