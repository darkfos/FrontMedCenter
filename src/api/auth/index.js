import { api } from '../config';

export class AuthAPI {

    static PREFIX = 'auth';
    static PREFIX_USER = 'users';

    static async register(data) {
        const { data: result } = await api.post(`${AuthAPI.PREFIX}/register`, {
            email: data.email,
            password: data.password,
            fullName: data.fullName || undefined,
            phone: data.phone || undefined,
        });
        return result;
    }

    static async login(credentials) {
        const { data } = await api.post(`${AuthAPI.PREFIX}/login`, {
            email: credentials.email,
            password: credentials.password,
        });

        return data;
    }

    static async me() {
        const { data } = await api.post(`${AuthAPI.PREFIX}/me`);
        return data;
    }

    static async getUserInfo() {
        const { data } = await api.get(`/${AuthAPI.PREFIX_USER}/info`);
        return data;
    }

    static async changePassword(newPassword) {
        const { data } = await api.patch(`${AuthAPI.PREFIX}/change-password`, {
            new_password: newPassword,
        });
        return data;
    }

    /** PATCH /profile — обновление персональных данных (fullName, email, phone, policyNumber). */
    static async updateProfile(data) {
        const { data: result } = await api.patch(`${AuthAPI.PREFIX_USER}/profile`, {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            policyNumber: data.policyNumber,
        });
        return result;
    }

    static async changeUnsignedPassword(email, password) {
        const { data } = await api.post(`${AuthAPI.PREFIX}/change-unsigned-password`, {
            email: email,
            password: password,
        });
        return data;
    }
}
