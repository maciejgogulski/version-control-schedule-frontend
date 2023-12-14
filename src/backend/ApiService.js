import axios from 'axios'

export default class ApiService {

    backendUrl = 'http://localhost:8080'

    token

    constructor(token) {
        this.token = token;

        axios.interceptors.request.use(
            config => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }

    async get(endpoint, params = {}) {
        try {
            const url = `${this.backendUrl}${endpoint}`;
            const response = await axios.get(url, {params: params});
            return response.data;
        } catch (err) {
            console.log(err);
            throw new Error();
        }
    }

    async post(endpoint, data) {
        try {
            const url = `${this.backendUrl}${endpoint}`;
            const response = await axios.post(url, data);
            return response.data;
        } catch (err) {
            console.log(err);
            throw new Error();
        }
    }

    async put(endpoint, data) {
        const url = `${this.backendUrl}${endpoint}`;
        try {
            const response = await axios.put(url, data);
            return response.data;
        } catch (err) {
            console.log(err);
            throw new Error();
        }
    }

    async delete(endpoint) {
        const url = `${this.backendUrl}${endpoint}`;
        try {
            const response = await axios.delete(url);
            console.log(response.data)
            return response.data;
        } catch (err) {
            console.log(err);
            throw new Error();
        }
    }
}
