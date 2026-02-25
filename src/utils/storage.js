export class Storage {
    static getItem(key) {
        return localStorage.getItem(key);
    }

    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return {[key]: value };
    }
}