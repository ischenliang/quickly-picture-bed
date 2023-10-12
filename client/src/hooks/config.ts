/**
 * 用于获取全局配置操作
 */
import useConfigStore from "@/store/config"
import useUserStore from "@/store/user"
import Dict from "@/types/Dict"
import Habits from "@/types/Habits"
import Setting from "@/types/Setting"
import { SettingInter, HabitsInter, DictInter } from "@/typings/interface"
import { PageResponse } from "@/typings/req-res"

/**
 * 获取全局的url配置
 * @returns 
 */
export function useUploadUrlConfig () {
  return {
    tool_url: 'http://demo.itchenliang.club',
    gitee_url: 'https://gitee.com/api/v5/repos/'
  }
}


const setting = new Setting()
const dict = new Dict()
export function useGetSystemConfig () {
  return new Promise((resolve) => {
    const configStore = useConfigStore()
    if (!configStore.systemConfig.id) {
      setting.default().then((res: SettingInter) => {
        configStore.updateSystemConfig(res)
        const { ico, name, logo, keys, desc } = configStore.systemConfig.website
        const { icon_url } = configStore.systemConfig.system
        const linkEl = document.createElement('link')
        const headEl =  document.querySelector('head')
        // ico
        linkEl.href = ico
        linkEl.type = 'image/x-icon'
        linkEl.rel = 'shortcut icon'
        headEl.appendChild(linkEl)
        // 标题
        document.title = name
        // 其它信息：描述、关键字等等
        const meta: HTMLMetaElement = document.querySelector('meta[name="keywords"]')
        meta.content = keys.join(',')
        const description: HTMLMetaElement = document.querySelector('meta[name="description"]')
        description.content = desc
        // iconfont
        const style = document.createElement('link')
        style.rel = 'stylesheet'
        style.href = icon_url
        headEl.appendChild(style)
        if (!configStore.dicts.length) {
          dict.find({}).then((res: PageResponse<DictInter>) => {
            configStore.updateDicts(res.items)
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    } else {
      resolve(true)
    }
  })
}


const habits = new Habits()
export function useGetHabits () {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    if (!userStore.user_habits.data.id) {
      habits.detail().then((res: HabitsInter) => {
        userStore.updateUserHabits(res)
        resolve(true)
      })
    } else {
      resolve(true)
    }
  })
}