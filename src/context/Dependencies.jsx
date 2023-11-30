import React, {
  createContext, useContext, useMemo,
} from 'react'
import { Toast, Types } from '../utils/Toast'
import Backend from "../backend/Backend";

export class Dependencies {
  getApiService() {
    return new Backend()
  }

  getToastUtils() {
    const toast = new Toast()
    return {
      Toast: toast,
      types: Types.Type,
    }
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
