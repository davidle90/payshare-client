import axios from "axios";
import { useAuthStore } from '../stores/auth.js';

const API_URL = import.meta.env.VITE_PAYSHARE_API_URL;
const API_KEY = import.meta.env.VITE_PAYSHARE_API_KEY;
const BASE_URL = API_URL.endsWith('/') ? `${API_URL}api/v1` : `${API_URL}/api/v1`;

export const register = async (username, email, password) => {
    try {
        const form = {
            'username': username,
            'email': email,
            'password': password
        }

        const authStore = useAuthStore()

        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            form,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        const token = response.data.access_token;

        localStorage.setItem('authToken', token);
        authStore.setAuth(token, response.data.user)

        return { success: true, message: "Authenticated" };

    } catch (error) {
        if(error.response && (error.response.status == 422 || error.response.status == 401)){
            const errorMessage = 'Invalid email or password.'
            return { success: false, message: errorMessage };
        } else {
            const errorMessage = 'Login failed: ' + error.message;
            return { success: false, message: errorMessage };
        }
    }
}

export const login = async (email, password) => {
    try {
        const form = {
            'email': email,
            'password': password
        }

        const authStore = useAuthStore()

        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            form,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        const token = response.data.access_token;
        const user = response.data.user;
        localStorage.setItem('authToken', token);
        authStore.setAuth(token, user);
        
        return { success: true, message: "Authenticated" };

    } catch (error) {
        if(error.response && (error.response.status == 422 || error.response.status == 401)){
            const errorMessage = 'Invalid email or password.'
            return { success: false, message: errorMessage };
        } else {
            const errorMessage = 'Login failed: ' + error.message;
            return { success: false, message: errorMessage };
        }
    }
}

export const checkAuth = async () => {
    try {
        const authStore = useAuthStore();

        const response = await axios.get(
            `${BASE_URL}/auth/check`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                }
            }
        );

        return { success: true, message: response.data.message, user: response.data.user };

    } catch (error) {
        const errorMessage = 'Error while doing auth check: ' + error.message;
        return { success: false, message: errorMessage };
    }
}