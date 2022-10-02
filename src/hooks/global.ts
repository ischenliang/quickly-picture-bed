import { getCurrentInstance } from "vue";
import AV from 'leancloud-storage'

interface Ctx {
  $message?: string
  [prop: string]: any
}

export function useCtxInstance () {
  const instance = getCurrentInstance()
  const ctx: Ctx = instance.proxy
  return ctx
}


export function useCurrentUser () {
  return AV.User.current()
}
