import React, {
  createContext, useContext, useMemo,
} from 'react'
import Backend from "../backend/Backend"
import Toast from "../utils/Toast/Toast"

export class Dependencies {
  getApiService() {
    return new Backend()
  }

  getToastUtils() {
    return new Toast()
  }
}

export const DependenciesContext = createContext(new Dependencies())

export const DependenciesProvider = (props) => {
  const value = useMemo(() => new Dependencies(), [])

  return (
    <DependenciesContext.Provider
      value={value}
    >
      { props.children }
    </DependenciesContext.Provider>
  )
}

export const useDependencies = () => useContext(DependenciesContext)
