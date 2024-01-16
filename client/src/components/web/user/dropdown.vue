<template>
  <el-popover placement="bottom-end" trigger="click" :width="300" popper-class="user-info-popover">
    <template #reference>
      <div class="user-info">
        <img class="user-info-avatar" :src="userAvatar" alt="">
        <span class="user-info-name">{{ userInfo.username }}</span>
        <span class="user-info-role">{{ roles[userInfo.role] }}</span>
        <span class="user-info-caret">
          <el-icon>
            <CaretBottom />
          </el-icon>
        </span>
      </div>
    </template>
    <div class="user-info__content">
      <div class="popover__header">
        <div class="header-left">
          <img class="user-avatar" :src="userAvatar" alt="">
          <div>
            <span class="user-name">{{ userInfo.username }}</span>
            <span class="user-role">{{ roles[userInfo.role] }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="logout">退出登录</el-button>
        </div>
      </div>
      <div class="popover__content">
        <div class="personal-center">
          <div class="center-item" @click="goProfile('base')">
            <el-icon>
              <Postcard />
            </el-icon>
            <span>个人资料</span>
          </div>
          <div class="center-item" @click="goProfile('security')">
            <el-icon>
              <Lock />
            </el-icon>
            <span>修改密码</span>
          </div>
          <!-- 账号绑定：binding  新消息通知：notification -->
        </div>
        <div class="entry-list">
          <div
            class="entry-item"
            v-for="(item, index) in entries"
            :key="index"
            @click="item.go ? goProfile(item.route) : goView(item)">
            <el-icon><component :is="item.icon"></component></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/user';
import { UserInter } from '@/typings/interface';
import { computed, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
interface AvatarInter {
  name: string
  suffix: string
  url?: string
}

const props = withDefaults(defineProps<{ userInfo: UserInter, roles: any }>(), {
  userInfo: () => ({} as UserInter),
  roles: () => ({
    1: '',
    2: '',
    10: '管理员'
  })
})

// 所有头像列表
const avatars: Ref<AvatarInter[]> = ref([

  { name: '星座_白羊座', suffix: 'png' },
  { name: '星座_金牛座', suffix: 'png' },
  { name: '星座_双子座', suffix: 'png' },
  { name: '星座_巨蟹座', suffix: 'png' },
  { name: '星座_狮子座', suffix: 'png' },
  { name: '星座_处女座', suffix: 'png' },
  { name: '星座_天秤座', suffix: 'png' },
  { name: '星座_天蝎座', suffix: 'png' },
  { name: '星座_射手座', suffix: 'png' },
  { name: '星座_摩羯座', suffix: 'png' },
  { name: '星座_水瓶座', suffix: 'png' },
  { name: '星座_双鱼座', suffix: 'png' },

  
  { name: '生肖_鼠', suffix: 'png' },
  { name: '生肖_牛', suffix: 'png' },
  { name: '生肖_虎', suffix: 'png' },
  { name: '生肖_兔', suffix: 'png' },
  { name: '生肖_龙', suffix: 'png' },
  { name: '生肖_蛇', suffix: 'png' },
  { name: '生肖_马', suffix: 'png' },
  { name: '生肖_羊', suffix: 'png' },
  { name: '生肖_猴', suffix: 'png' },
  { name: '生肖_鸡', suffix: 'png' },
  { name: '生肖_狗', suffix: 'png' },
  { name: '生肖_猪', suffix: 'png' },

  
  { name: '比赛_1', suffix: 'png' },
  { name: '比赛_2', suffix: 'png' },
  { name: '比赛_3', suffix: 'png' },
  { name: '比赛_4', suffix: 'png' },
  { name: '比赛_5', suffix: 'png' },
  { name: '比赛_6', suffix: 'png' },
  { name: '比赛_7', suffix: 'png' },
  { name: '比赛_8', suffix: 'png' },
  { name: '比赛_9', suffix: 'png' },
  { name: '比赛_10', suffix: 'png' },
  { name: '比赛_11', suffix: 'png' },
  { name: '比赛_12', suffix: 'png' },
  
  
  { name: '学生卡通_1', suffix: 'png' },
  { name: '学生卡通_2', suffix: 'png' },
  { name: '学生卡通_3', suffix: 'png' },
  { name: '学生卡通_4', suffix: 'png' },
  { name: '学生卡通_5', suffix: 'png' },
  { name: '学生卡通_6', suffix: 'png' },
  { name: '学生卡通_7', suffix: 'png' },
  { name: '学生卡通_8', suffix: 'png' },
  { name: '学生卡通_9', suffix: 'png' },
  { name: '学生卡通_10', suffix: 'png' },
  { name: '学生卡通_11', suffix: 'png' },
  { name: '学生卡通_12', suffix: 'png' },
  
  
  { name: '学生扁平_1', suffix: 'png' },
  { name: '学生扁平_2', suffix: 'png' },
  { name: '学生扁平_3', suffix: 'png' },
  { name: '学生扁平_4', suffix: 'png' },
  { name: '学生扁平_5', suffix: 'png' },
  { name: '学生扁平_6', suffix: 'png' },
  { name: '学生扁平_7', suffix: 'png' },
  { name: '学生扁平_8', suffix: 'png' },
  { name: '学生扁平_9', suffix: 'png' },
  { name: '学生扁平_10', suffix: 'png' },
  { name: '学生扁平_11', suffix: 'png' },
  { name: '学生扁平_12', suffix: 'png' },
  
  { name: '通用_1', suffix: 'png' },
  { name: '通用_2', suffix: 'png' },
  { name: '通用_3', suffix: 'png' },
  { name: '通用_4', suffix: 'png' },
  { name: '通用_5', suffix: 'png' },
  { name: '通用_6', suffix: 'png' },
  { name: '通用_7', suffix: 'png' },
  { name: '通用_8', suffix: 'png' },
  { name: '通用_9', suffix: 'png' },
  { name: '通用_10', suffix: 'png' },
  { name: '通用_11', suffix: 'png' },
  { name: '通用_12', suffix: 'png' },
])
avatars.value.forEach(item => {
  item.url = new URL(`../../../views/userinfo/images/${item.name}.${item.suffix}`, import.meta.url).href
})
const userAvatar = computed(() => {
  // props.userInfo.avatar
  return avatars.value.find(item => item.name === props.userInfo.avatar).url
})

const router = useRouter()
const userStore = useUserStore()

const entries = ref([
  { label: '使用分析', icon: 'DataAnalysis', route: 'Analysis' },
  { label: '偏好设置', icon: 'Setting', route: 'habits', go: true },
  { label: '更新日志', icon: 'ScaleToOriginal', route: 'Uplog' },
  { label: '关于系统', icon: 'InfoFilled', route: 'About' }
])

const goProfile = (type) => {
  router.push({
    path: '/profile',
    query: {
      type
    }
  })
}

const goView = (item) => {
  router.push({
    name: item.route
  })
}

const logout = () => {
  localStorage.removeItem('token')
  userStore.resetData()
  router.push({ path: '/login' })
}
</script>

<style lang="scss">
.user-info {
  height: 100%;
  padding: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  cursor: pointer;
  .user-info-avatar {
    height: 100%;
    border-radius: 50%;
    background: var(--el-fill-color-light);
  }
  .user-info-name {
    margin-left: 8px;
    color: var(--el-text-color-regular);
    font-size: 15px;
  }
  .user-info-role {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 5px;
    height: 18px;
    font-size: 12px;
    margin-left: 10px;
    word-break: keep-all;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
  }
  .user-info-caret {
    margin-left: 5px;
    padding-top: 5px;
    .el-icon {
      color: var(--el-text-color-secondary);
    }
  }
}
.user-info-popover {
  transform: translate(-20px, 59px) !important;
  padding: 0 !important;
  background: var(--el-bg-color-white);
  box-shadow: var(--el-box-shadow-light);
  padding: 0px !important;
  .el-popper__arrow {
    display: none;
  }
  .user-info__content {
    .popover__header {
      width: 100%;
      height: 80px;
      background-image: url('./images/user-info-popover-bg.png');
      border-bottom: 1px dashed var(--el-border-color);
      padding: 23px 20px 21px 23px;
      flex-shrink: 0;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        > div {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          justify-content: center;
          .user-name {
            font-size: 14px;
            color: var(--el-text-color-primary);
          }
          .user-role {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
    .popover__content {
      padding: 15px 20px;
      .personal-center {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 40px;
        justify-content: space-between;
        .center-item {
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          cursor: pointer;
          color: var(--el-text-color-regular);
          .el-icon {
            font-size: 30px;
          }
          > span {
            font-size: 14px;
            font-weight: 400;
          }
          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
      .entry-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
        .entry-item {
          width: 50%;
          height: 36px;
          background: var(--el-fill-color-light);
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2px;
          color: var(--el-text-color-primary);
          cursor: pointer;
          &:nth-child(odd) {
            border-right: 2px solid var(--el-bg-color-white);
          }
          .el-icon {
            font-size: 16px;
            margin-right: 8px;
          }
          &:hover {
            background: var(--el-fill-color);
          }
        }
      }
    }
  }
}
</style>