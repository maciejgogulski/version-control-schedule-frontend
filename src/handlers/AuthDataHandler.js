class AuthDataHandler {
  authData

  constructor() {
    this.authData = null
  }

  setAuthData(data) {
    this.authData = data
  }

  clearAuthData() {
    this.authData = null
  }

  getAuthData() {
    return this.authData
  }

  getUser() {
    return this.authData?.user || null
  }

  getToken() {
    return this.authData?.token || undefined
  }
}

export default AuthDataHandler
