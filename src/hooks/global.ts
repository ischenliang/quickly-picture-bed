import { ListInter } from './../typings/interface';
import { getCurrentInstance } from "vue";
import AV from 'leancloud-storage'
import { ElMessageBox } from 'element-plus';
import Clipboard from 'clipboard'
import { useClipboard } from '@vueuse/core';


interface Ctx {
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
      reject(err)
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
    source: text
  })
  isSupported && copy(text)
  copied && ctx.$message({ type: 'success', message: '复制成功', duration: 1000 })
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