import { ListInter } from './../typings/interface';
import { getCurrentInstance, nextTick, Ref } from "vue";
import AV from 'leancloud-storage'
import { ElMessageBox } from 'element-plus';
import { useClipboard } from '@vueuse/core';
import { useFileName } from './date-time';
import { mimeTypes } from '@/global.config';
import useUserStore from '@/store/user';
import md5 from 'md5'


interface Ctx {
  $route?: any
  $notify?: (options: {
    title?: string
    type?: string
    message?: string
    duration?: number
  }) => {}
  $message?: (options: {
    type: string
    message: string
    duration: number
  }) => {}
  $viewerApi: (config: {
    options: {
      url?: string,
      initialViewIndex?: number
    }
    images: string[]
  }) => void
  [prop: string]: any
}

/**
 * 封装getCurrentInstance，方便能够快速拿到当前实例，并且提供智能提示
 */
export function useCtxInstance () {
  const instance = getCurrentInstance()
  // @ts-ignore
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
      dangerouslyUseHTMLString: true
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 删除弹窗：删除数据时的弹窗确认
 * @param text 描述文字
 * @param title 删除标题
 * @returns 
 */
export function useDeleteConfirm (text = '确定删除吗?', title = '提示') {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(text, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      // console.log('取消了')
      // reject(err)
    })
  })
}

/**
 * File类型文件转Base64类型
 * @param file file文件
 * @returns base64格式的内容(不带base64前缀)
 */
export function useFileToBase64 (file: File, prefix: boolean = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result: any = reader.result
      if (prefix) {
        resolve(result)
      } else {
        resolve(result.split(",").pop())
      }
    };
    reader.onerror = (error) => {
      reject(error)
    };
  });
}


/**
 * 获取后缀
 * @param filePath 文件路径|文件名称
 * @param identify 截取标识符
 * @returns 后缀
 */
export function useGetSuffix (filePath, identify = '.') {
  // 获取以identify为标识符的位置
  var index = filePath.lastIndexOf(identify);
  // 获取后缀
  var value = filePath.substr(index + 1);
  return value;
}

/**
 * 获取文件尺寸
 * @param file 文件或者图片在线地址
 * @returns 文件宽高 { width: number, height: number } 
 */
export function useGetImageSize (file: File | string) {
  return new Promise(async (resolve, reject) => {
    const image = new Image()
    if (typeof file === 'string') {
      image.src = file
    } else {
      image.src = (await useFileToBase64(file, true)) as string
    }
    if (image.complete) {
      resolve({
        width: image.width,
        height: image.height
      })
    }
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height
      })
      image.onload = null // 避免重复加载
    }
    image.onerror = function () {
      reject('图片加载失败')
    }
  })
}


/**
 * 使用复制文本
 * @param text 文本
 */
export function useCopyText (ctx: Ctx, text: string) {
  const { copy, isSupported, copied } = useClipboard({
    source: text,
    legacy: true
  })
  if (isSupported.value) {
    copy(text)
    copied && ctx.$message({ type: 'success', message: '复制成功', duration: 1000 })
  } else {
    console.log('不支持')
  }
}


/**
 * 格式化文件大小
 *  参考：http://t.zoukankan.com/cherylgi-p-15464726.html
 * @param fileSize 文件大小
 * @returns 
 */
export function useFormatImageSize (fileSize: number) {
  let temp = 0;
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024*1024)) {
    temp = fileSize / 1024
    return temp.toFixed(2) + 'KB';
  } else if (fileSize < (1024*1024*1024)) {
    temp = fileSize / (1024*1024);
    return temp.toFixed(2) + 'MB';
  } else {
    temp = fileSize / (1024*1024*1024);
    return temp.toFixed(2) + 'GB';
  }
}

/**
 * 使用原生的ctrl + v的方式读取剪切板中的文件
 * @param event ClipboardEvent事件
 * @returns () => Promise<File[]>
 */
export function useDocumentClipboard (event: ClipboardEvent) {
  return new Promise((resolve, reject) => {
    const files: File[] = []
    // @ts-ignore
    const clipboardData: DataTransfer = event.clipboardData || window.clipboardData
    const items: DataTransferItemList = clipboardData.items

    // 搜索剪切板items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      // 文件格式
      if (item.kind === 'file') {
        // 匹配图片类型
        if (item.type.indexOf('image') !== -1) {
          const file: File = item.getAsFile()
          if (file.size === 0) {
            return
          }
          files.push(file)
        }
      }
    }
    resolve(files)
  })
}

/**
 * 使用window.navigator.clipboard的方式读取剪切板中的文件
 * 
 *  缺点：兼容性不足，火狐浏览器上window.navigator.clipboard.read不存在
 * @returns () => Promise<File[]>
 */
export function useWindowClipboard () {
  const files: File[] = []
  return new Promise((resolve, reject) => {
    window.navigator.clipboard.read().then(async res => {
      for (let clipboardItem of res) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type)
          if (type.indexOf('image') !== -1) {
            const file = new File([blob], useFileName() + '.' + type.split('/').pop())
            files.push(file)
          }
        }
      }
      resolve(files)
    })
  })
}


// 深克隆
export function useDeepClone (obj, hash = new WeakMap()) {
  // 正则：直接返回新对象
  if (obj instanceof RegExp) return new RegExp(obj)
  // 日期：直接返回新对象
  if (obj instanceof Date) return new Date(obj)
  // 空或者非对象类型：直接返回原值
  if (obj === null || typeof obj !== 'object') return obj
  // 循环引用的情况
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  // new一个相应的对象
  // obj为Array，相当于new Array()
  // obj为Object，相当于new Object()
  const constr = new obj.constructor()
  hash.set(obj, constr)
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      constr[key] = useDeepClone(obj[key], hash)
    }
  }
  // 考虑symbol的情况
  const symbolObj = Object.getOwnPropertySymbols(obj)
  for (let i = 0; i < symbolObj.length; i++) {
    if (obj.hasOwnProperty(symbolObj[i])) {
      constr[symbolObj[i]] = useDeepClone(obj[symbolObj[i]], hash)
    }
  }
  return constr
}


/**
 * 将网络图片转成file对象
 * @param url 网络图片url
 * @param imageName 图片名称
 * @returns () => Promise()
 */
export function useUrlToImageFile (url: string, imageName: string, accept: string[]) {
  return new Promise((resolve, reject) => {
    let blob = null
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    // xhr.setRequestHeader('Accept', 'image/png');
    xhr.responseType = "blob";
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      const contentType = xhr.getResponseHeader('Content-type')
      const types = accept.map(item => {
        return mimeTypes[item]
      })
      blob = xhr.response
      if (types.includes(contentType)) {
        const file = new File([blob], imageName, { type: contentType })
        resolve(file)
      } else {
        reject(new Error(`${contentType}: 格式不符合要求`))
      }
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    // 发送
    xhr.send()
  })
}


/**
 * 存储列表页面的查询条件
 * @param ctx Ctx实例
 * @param list list列表对象
 * @param type 类型，set: 设置查询条件 | get: 获取查询条件
 * @param callBack 回调函数，设置成功后执行的函数，通常是获取列表数据函数
 */
 export function useListFilter (list: any, name: any = '', type: 'set' | 'get' = 'set', callBack: Function = () => {}) {
  const userStore = useUserStore()
  if (type === 'set') {
    userStore.updateListFilter( {
      name: name,
      page: list.page,
      size: list.size,
      total: list.total,
      filters: list.filters
    })
  } else {
    const list_filter: any = userStore.list_filter
    if (list_filter && name === list_filter?.name) {
      list.total = list_filter.total
      list.page = list_filter.page
      list.size = list_filter.size
      list.filters = list_filter.filters
      // 设置完成后就应该将数据删除
      userStore.updateListFilter(null)
      nextTick(() => {
        callBack()
      })
    } else {
      callBack()
    }
  }
}


/**
 * 密码md5加密
 * @param pwd 密码
 * @param suffix 秘钥
 * @returns 
 */
export function useMd5 (pwd: string, suffix: string = 'a1b2c3') {
  return md5(pwd + suffix)
}