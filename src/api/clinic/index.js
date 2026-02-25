import { api } from "../config";

export class ClinicAPI {

    static PREFIX = 'clinic';
    static PREFIX_SERVICE = 'services';

    static async all() {
        const req = await api.get(`/${ClinicAPI.PREFIX_SERVICE}`);
        return await req.data;
    }
}