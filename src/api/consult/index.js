import { api } from "../config";

export class ConsultAPI {

    static PREFIX = 'consult';

    static async createConsult(username, phone, complaints) {

        const req = await api.post(`/${ConsultAPI.PREFIX}/create`, {
            username: username,
            phone,
            complaints,
        });

        if (req) {
            return req;
        }
    }
}