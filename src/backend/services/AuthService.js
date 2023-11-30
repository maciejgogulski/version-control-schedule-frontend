import AuthDataHandler from '../../handlers/AuthDataHandler'

class AuthService {
  authUrl = '/auth'

  apiService

  async login(data) {
    const response = await this.apiService.post(`${this.authUrl}/login`, data)
    const authDataHandler = new AuthDataHandler()
    authDataHandler.setAuthData({
      user: response.user,
      token: response.token,
    })
    return authDataHandler
  }

}

export default AuthService
