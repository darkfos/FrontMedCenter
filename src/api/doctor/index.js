import {api} from "../config";

export class DoctorAPI {

    static PREFIX = 'doctor'

    static async getFilteredDoctors(username, specialization, formatWork, pageSize = 100 ) {

        const req = await api.get(`/${DoctorAPI.PREFIX}/list`, {
            params: {
                username,
                specialization,
                formatWork,
                pageSize
            }
        });

        return await req.data?.list ?? [];
    }

    static async getOldestDoctors() {
        const req = await api.get(`/${DoctorAPI.PREFIX}/oldest`, {});
        return req.data;
    }

    static async getById(id) {
        const req = await api.get(`/${DoctorAPI.PREFIX}/${id}`);
        return req.data;
    }

    static async setReviewLike(reviewId) {
        const req = await api.post(`/${DoctorAPI.PREFIX}/set_like`, {}, {
            params: {
                reviewId
            }
        });
        return req.data;
    }
}