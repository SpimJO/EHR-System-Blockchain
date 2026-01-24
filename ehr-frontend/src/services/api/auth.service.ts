import api from "@/http/xior";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/api.types";

export const authService = {
    /**
     * Login user with email and password
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },

    /**
     * Register new user (Patient, Doctor, or Staff)
     * Automatically generates blockchain wallet on backend
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
    },

    /**
     * Get current session / verify token
     */
    getSession: async (): Promise<{ data: { user: User } }> => {
        const response = await api.get("/auth/session");
        return response.data;
    },

    /**
     * Logout user (client-side token removal)
     */
    logout: () => {
        localStorage.removeItem("ehr_token");
        localStorage.removeItem("ehr_user");
    },
};
