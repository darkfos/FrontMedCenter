import { api } from '../config';

export const ReviewAPI = {
    /** Список отзывов по id врача с пагинацией */
    getByDoctorId(doctorId, page = 1, pageSize = 5) {
        return api.get(`/doctor/${doctorId}/reviews`, {
            params: { page, pageSize }
        }).then((res) => res.data);
    },

    /** Создать отзыв (только для авторизованного пользователя). body: { message, rating }, doctorId в пути или теле */
    create(doctorId, body) {
        return api.post('/review/create', { ...body, doctorId });
    },
};
