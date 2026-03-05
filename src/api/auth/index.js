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

    /** PATCH /profile — обновление персональных данных (fullName, email, phone, policyNumber, certificates, position). */
    static async updateProfile(data) {
        const { data: result } = await api.patch(`${AuthAPI.PREFIX_USER}/profile`, {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            policyNumber: data.policyNumber,
            certificates: data.certificates,
            position: data.position,
        });
        return result;
    }

    /** GET /me/patients — список пациентов врача с пагинацией и поиском по имени (только для врача). */
    static async getMyPatients(page = 1, pageSize = 10, search = '') {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/patients`, {
            params: { page, pageSize, ...(search && { search }) },
        });
        return data;
    }

    /** GET /me/visits-today — визиты на текущую дату с пагинацией (только для врача). */
    static async getMyVisitsToday(page = 1, pageSize = 10) {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/visits-today`, {
            params: { page, pageSize },
        });
        return data;
    }

    /** PATCH /me/visits/:id/cancel — отменить визит (только для врача). */
    static async cancelVisit(visitId) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/visits/${visitId}/cancel`);
        return data;
    }

    /** POST /me/prescriptions — добавить назначение выбранному пациенту (id карты). */
    static async createPrescription(body) {
        const { data } = await api.post(`${AuthAPI.PREFIX_USER}/me/prescriptions`, body);
        return data;
    }

    /** POST /me/analyses — добавить анализ выбранному пациенту (id карты). */
    static async createAnalysis(body) {
        const { data } = await api.post(`${AuthAPI.PREFIX_USER}/me/analyses`, body);
        return data;
    }

    /** GET /me/patients/:cardId/prescriptions — назначения по карточке пациента (для врача). */
    static async getCardPrescriptions(cardId) {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/patients/${cardId}/prescriptions`);
        return data;
    }

    /** GET /me/patients/:cardId/analyses — анализы по карточке пациента (для врача). */
    static async getCardAnalyses(cardId) {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/patients/${cardId}/analyses`);
        return data;
    }

    static async changeUnsignedPassword(email, password) {
        const { data } = await api.post(`${AuthAPI.PREFIX}/change-unsigned-password`, {
            email: email,
            password: password,
        });
        return data;
    }

    /** GET /me/appointments — записи (визиты) пациента с пагинацией. */
    static async getMyAppointments(page = 1, pageSize = 10) {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/appointments`, {
            params: { page, pageSize },
        });
        return data;
    }

    /** GET /me/prescriptions — история назначений (препаратов) пациента с пагинацией. */
    static async getMyPrescriptions(page = 1, pageSize = 10) {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/prescriptions`, {
            params: { page, pageSize },
        });
        return data;
    }

    /** GET /me/balance — баланс счёта пациента. */
    static async getMyBalance() {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/balance`);
        return data;
    }

    /** POST /me/prescriptions/:id/renew-request — запрос на продление рецепта. */
    static async createPrescriptionRenewalRequest(prescriptionId) {
        const { data } = await api.post(`${AuthAPI.PREFIX_USER}/me/prescriptions/${prescriptionId}/renew-request`);
        return data;
    }

    /** GET /me/prescription-renewal-requests — список запросов на продление (для пациента). */
    static async getMyPrescriptionRenewalRequests() {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/prescription-renewal-requests`);
        return data;
    }

    /** GET /me/renewal-requests — запросы на продление рецептов для врача. */
    static async getMyRenewalRequests() {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/renewal-requests`);
        return data;
    }

    /** PATCH /me/renewal-requests/:id — одобрить/отклонить запрос (status: 'approved' | 'rejected'). */
    static async updateRenewalRequestStatus(requestId, status) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/renewal-requests/${requestId}`, { status });
        return data;
    }

    /** GET /me/tasks — задачи на дату для медсестры (page, pageSize, filter: all|high_priority|completed, date). */
    static async getMyTasks(page = 1, pageSize = 10, filter = 'all', date) {
        const params = { page, pageSize, filter };
        if (date) params.date = date;
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/tasks`, { params });
        return data;
    }

    /** POST /me/tasks — создать задачу (медсестра). */
    static async createMyTask(body) {
        const { data } = await api.post(`${AuthAPI.PREFIX_USER}/me/tasks`, body);
        return data;
    }

    /** PATCH /me/tasks/:id/complete — отметить задачу выполненной. */
    static async completeMyTask(taskId) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/tasks/${taskId}/complete`);
        return data;
    }

    /** PATCH /me/tasks/:id/note — сохранить заметку к задаче (body: { note }). */
    static async setMyTaskNote(taskId, note) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/tasks/${taskId}/note`, { note });
        return data;
    }

    /** GET /me/shift-stats — статистика за смену (медсестра). Параметр date (YYYY-MM-DD). */
    static async getMyShiftStats(date) {
        const params = date ? { date } : {};
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/shift-stats`, { params });
        return data;
    }

    /** GET /me/shift-journal — все задачи за дату для отчёта (медсестра). Параметр date (YYYY-MM-DD). */
    static async getMyShiftJournal(date) {
        const params = date ? { date } : {};
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/shift-journal`, { params });
        return data;
    }

    /** GET /me/inventory — список расходников (медсестра). */
    static async getMyInventory() {
        const { data } = await api.get(`${AuthAPI.PREFIX_USER}/me/inventory`);
        return data;
    }

    /** POST /me/inventory — добавить позицию (name, quantity?, threshold?). */
    static async createInventoryItem(body) {
        const { data } = await api.post(`${AuthAPI.PREFIX_USER}/me/inventory`, body);
        return data;
    }

    /** PATCH /me/inventory/:id/add — добавить к количеству (body: { amount }). */
    static async addInventoryQuantity(id, amount = 10) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/inventory/${id}/add`, { amount });
        return data;
    }

    /** PATCH /me/inventory/:id — обновить позицию (name?, quantity?, threshold?). */
    static async updateInventoryItem(id, body) {
        const { data } = await api.patch(`${AuthAPI.PREFIX_USER}/me/inventory/${id}`, body);
        return data;
    }
}
