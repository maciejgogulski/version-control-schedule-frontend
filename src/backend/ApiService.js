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

    async get(endpoint) {
        try {
            const url = `${this.backendUrl}${endpoint}`;
            const response = await axios.get(url);
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

    async sendRequest(endpoint,
                      method,
                      params = [],
                      body = "",
                      headers = {}
    ) {
        try {
            let paramString = ""

            if (params.length !== 0) {
                paramString += "?"

                params.forEach((param, index) => {
                    paramString += param.key + "=" + param.value + "&"

                    // Check if it's the last iteration
                    if (index === params.length - 1) {
                        paramString = paramString.slice(0, -1)
                    }
                })
            }

            if (this.token) {
                headers = {
                    ...headers,
                    'Authorization' : 'Bearer ' + this.token,
                }
            }

            if (body === "") {
                return await fetch(
                    this.backendUrl + endpoint + paramString,
                    {
                        method: method,
                        headers: headers,
                    },
                )
            }

            return await fetch(
                this.backendUrl + endpoint + paramString,
                {
                    method: method,
                    headers: headers,
                    body: body,
                },
            )
        } catch (error) {
            console.error('Error:', error)
            throw new Error();
        }
    }
}
