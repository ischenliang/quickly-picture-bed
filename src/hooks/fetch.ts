import { useFormat } from "@/hooks/date-time"

export function useFetch (fn, enablePage = true) {
  return new Promise((resolve, reject) => {
    fn.then(res => {
      if (res.length) {
        resolve(enablePage ? {
          total: res[1],
          data: res[0].map(item => {
            return {
              id: item.id,
              ...item.attributes,
              createdAt: useFormat(item.createdAt),
              updatedAt: useFormat(item.updatedAt)
            }
          })
        } : {
          data: res.map(item => {
            return {
              id: item.id,
              ...item.attributes,
              createdAt: useFormat(item.createdAt),
              updatedAt: useFormat(item.updatedAt)
            }
          })
        })
      } else {
        resolve({
          data: {
            id: res.id,
            ...res.attributes,
            createdAt: useFormat(res.createdAt),
            updatedAt: useFormat(res.updatedAt)
          }
        })
      }
    }).catch(error => {
      // 错误全局处理
      console.log(error)
    })
  })
}


export function usePromise(res, error = null) {
  return new Promise((resolve) => {
    if (error) {
      console.log(error)
    } else {
      if (res) {
        resolve({
          ...res
        })
      }
      resolve(res)
    }
  })
}

// 解决异步导致数组顺序错乱问题
export async function usePromiseToOrder (fn, item) {
  const res = await fn
  item.listOptions_arr = res.data.values
  return item
}


export function useFormatRes (res) {
  return {
    data: {
      id: res.id,
      ...res.attributes,
      createdAt: useFormat(res.createdAt),
      updatedAt: useFormat(res.updatedAt)
    }
  }
}