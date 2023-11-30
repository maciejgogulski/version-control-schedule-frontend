/* eslint-disable no-unused-vars */

import { Type } from './types'

export interface ToastInterface {
  showToast: (type: Type, message: string) => void
}
