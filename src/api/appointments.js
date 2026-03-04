import { api } from './config';

/**
 * Доступные слоты врача. from/to в формате YYYY-MM-DD.
 */
export function getAvailableSlots(doctorId, from, to) {
    return api.get(`users/doctor/${doctorId}/available-slots`, {
        params: { from, to }
    }).then((res) => res.data);
}

/**
 * Создать запись на приём (требуется авторизация).
 * body: { doctorId, dateVisit: 'YYYY-MM-DD', time: 'HH:MM', roomNumber? }
 */
export function createAppointment(body) {
    return api.post('users/me/appointments', body);
}
