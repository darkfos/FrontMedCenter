import { api } from "../config";

export class ClinicAPI {

    static PREFIX = 'clinic';
    static PREFIX_SERVICE = 'services';

    static async allClinicTypes() {
        const req = await api.get(`/${ClinicAPI.PREFIX_SERVICE}`);
        return await req.data;
    }

    static async filteredServices(clinicType, serviceName) {
        const req = await api.get(`/${ClinicAPI.PREFIX_SERVICE}/filter`, {
            params: {
                clinicType,
                serviceName
            }
        });

        return await req.data;
    }
}