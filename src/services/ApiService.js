export default class ApiService {

    backendUrl = 'http://localhost:8080';

    async sendRequest(endpoint,
                      method,
                      params = [],
                      body = null,
                      headers = []
    ) {
        try {
            let paramString = "";

            if (params.length !== 0) {
                paramString += "?";

                params.forEach((param, index) => {
                    paramString += param.key + "=" + param.value + "&";

                    // Check if it's the last iteration
                    if (index === params.length - 1) {
                        paramString = paramString.slice(0, -1); // Remove the last character '&'
                    }
                })
            }

            return await fetch(
                this.backendUrl + endpoint + paramString,
                {
                    method: method,
                },
                headers,
                body
            );
        } catch (error) {
            console.error('Error:', error);
        }
    }
}