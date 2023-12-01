import React, {
  createContext , useContext, useMemo, useState,
} from 'react'
import { useCookies } from 'react-cookie'

class AuthClass {
  token

  setToken

  loggedIn

  setLoggedIn

  constructor(
    token = undefined,
    setToken = () => {},
    loggedIn = false,
    setLoggedIn = () => null
  ) {
    this.token = token
    this.setToken = setToken
    this.loggedIn = loggedIn
    this.setLoggedIn = setLoggedIn
  }
}

const AuthContext = createContext(new AuthClass())

export const AuthProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [token, setToken] = useState(cookies.token)
  const [loggedIn, setLoggedIn] = useState(Boolean(cookies.token))

  const setTokenFunction = (tokenFn = undefined) => {
    if (tokenFn) {
      setCookie('token', tokenFn)
      setToken(tokenFn)
      return
    }
    removeCookie('token')
  }

  const value = useMemo(
    () => new AuthClass(token, setTokenFunction, loggedIn, setLoggedIn),
    [token, loggedIn],
  )

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
