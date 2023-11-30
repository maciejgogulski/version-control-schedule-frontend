export default class ApiService {

    backendUrl = 'http://localhost:8080'

    token

    constructor(token) {
        this.token = token
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

            if (body === "") {
                return await fetch(
                    this.backendUrl + endpoint + paramString,
                    {
                        method: method,
                        headers: headers,
                    },
                )
            }

            if (this.token) {
                headers = {
                    ...headers,
                    'Authorization' : 'Bearer ' + this.token
                }
            }

            return await fetch(
                this.backendUrl + endpoint + paramString,
                {
                    method: method,
                    headers: headers,
                    body: body
                },
            )
        } catch (error) {
            console.error('Error:', error)
        }
    }
}
