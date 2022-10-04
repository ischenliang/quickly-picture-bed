import { ListInter } from './../typings/interface';
import { getCurrentInstance } from "vue";
import AV from 'leancloud-storage'
import { ElMessageBox } from 'element-plus';


interface Ctx {
  $message?: (options: {
    type: string
    message: string
    duration: number
  }) => {}
  [prop: string]: any
}

/**
 * 封装getCurrentInstance，方便能够快速拿到当前实例，并且提供智能提示
 */
export function useCtxInstance () {
  const instance = getCurrentInstance()
  const ctx: Ctx = instance.proxy
  return ctx
}

/**
 * 封装leancloud的current user
 * @returns user
 */
export function useCurrentUser () {
  return AV.User.current()
}

/**
 * 筛选数据：由于筛选条件变化，所以需要将页码重置为 1
 * @param list 传入list响应对象，否则会失去响应性
 * @param fn 重置后调用回调函数
 */
 export function useFilterData (list: ListInter<any>, fn: Function) {
  list.page = 1
  fn()
}


export function useConfirmBox (option = {
  title: '提示',
  text: '提示信息内容',
  // type: 'info',
  confirmButtonText: '确定',
  cancelButtonText: '确定'
}) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(option.text, option.title, {
      confirmButtonText: option.confirmButtonText,
      cancelButtonText: option.cancelButtonText,
      // type: option.type,
      dangerouslyUseHTMLString: true
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}