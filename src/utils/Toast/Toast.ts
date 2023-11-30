import { toast } from 'react-toastify'
import { Type } from './types'
import { ToastInterface } from './ToastInterface'

class Toast implements ToastInterface {
  showToast(type: Type, message: string): void {
    toast[type](message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
}

export default Toast
