/**
 * 用于获取全局配置操作
 */

import useConfigStore from "@/store/config"
import useUserStore from "@/store/user"
import Habits from "@/types/Habits"
import Setting from "@/types/Setting"
import { SettingInter, HabitsInter } from "@/typings/interface"
import { BasicResponse, PageResponse } from "@/typings/req-res"

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
export function useGetSystemConfig () {
  return new Promise((resolve) => {
    const configStore = useConfigStore()
    if (!configStore.systemConfig.id) {
      setting.default().then((res: SettingInter) => {
        const { ico, baseUrl, logo } = res.website
        res.website.ico_preview = baseUrl + ico
        res.website.logo_preview = baseUrl + logo
        configStore.updateSystemConfig(res)

        const { ico_preview, title, name, logo_preview } = configStore.systemConfig.website
        const { icon_url } = configStore.systemConfig.system
        const linkEl = document.createElement('link')
        const headEl =  document.querySelector('head')
        // ico
        linkEl.href = ico_preview
        linkEl.type = 'image/x-icon'
        linkEl.rel = 'shortcut icon'
        headEl.appendChild(linkEl)
        // 标题
        document.title = title
        // iconfont
        const style = document.createElement('link')
        style.rel = 'stylesheet'
        style.href = icon_url
        headEl.appendChild(style)
        resolve(true)
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