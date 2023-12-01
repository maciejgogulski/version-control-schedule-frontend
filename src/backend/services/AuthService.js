import AuthDataHandler from '../../handlers/AuthDataHandler'
import ApiService from '../ApiService'

class AuthService {
  authUrl = '/auth'

  apiService

  constructor() {
    this.apiService = new ApiService('')
  }

  async login(data) {
    const response = await this.apiService.post(
        `${this.authUrl}/login`,
        data
    )

    const authDataHandler = new AuthDataHandler()
    authDataHandler.setAuthData({
      user: response.user,
      token: response.token,
    })
    return authDataHandler
  }

}

export default AuthService
