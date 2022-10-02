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
    })
  })
}


export function usePromise(res) {
  return new Promise((resolve) => {
    resolve({
      ...res
    })
  })
}