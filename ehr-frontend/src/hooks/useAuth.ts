import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import type { User } from '@/types/api.types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('ehr_token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authService.getSession();
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            // Token invalid, clear it
            localStorage.removeItem('ehr_token');
            localStorage.removeItem('ehr_user');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        if (response.data) {
            localStorage.setItem('ehr_token', response.data.accessToken);
            localStorage.setItem('ehr_user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data;
        }
        throw new Error('Login failed');
    };

    const register = async (data: any) => {
        const response = await authService.register(data);
        if (response.data) {
            localStorage.setItem('ehr_token', response.data.accessToken);
            localStorage.setItem('ehr_user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data;
        }
        throw new Error('Registration failed');
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
    };
}
