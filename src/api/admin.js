import { api } from './config';

const PREFIX = 'users/admin';

export const AdminAPI = {
  /** Статистика системы для панели администратора */
  async getStats() {
    const { data } = await api.get(`/${PREFIX}/stats`);
    return data;
  },

  /** Список пользователей, ожидающих подтверждения (пагинация) */
  async getPendingApproval(page = 1, pageSize = 3) {
    const { data } = await api.get(`/${PREFIX}/pending-approval`, {
      params: { page, pageSize },
    });
    return data;
  },

  /** Утвердить регистрацию пользователя */
  async approveUser(id) {
    const { data } = await api.patch(`/${PREFIX}/pending-approval/${id}/approve`);
    return data;
  },

  /** Отклонить регистрацию пользователя */
  async rejectUser(id) {
    const { data } = await api.patch(`/${PREFIX}/pending-approval/${id}/reject`);
    return data;
  },

  /** Активность системы (последние события). limit по умолчанию 10. */
  async getActivities(limit = 10) {
    const { data } = await api.get(`/${PREFIX}/activities`, { params: { limit } });
    return data;
  },

  /** Вся активность с пагинацией (для «Показать всю активность»). */
  async getActivitiesPage(page = 1, pageSize = 20) {
    const { data } = await api.get(`/${PREFIX}/activities`, {
      params: { page, pageSize },
    });
    return data;
  },
};
