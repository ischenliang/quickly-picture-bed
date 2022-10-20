<template>
  <el-popover placement="bottom-end" trigger="hover" :width="300" popper-class="user-info-popover">
    <template #reference>
      <div class="user-info">
        <img class="user-info-avatar"
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">
        <span class="user-info-name">陈亮</span>
        <span class="user-info-role">管理员</span>
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
          <img class="user-avatar"
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">
          <div>
            <span class="user-name">陈亮</span>
            <span class="user-role">管理员</span>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" size="medium" @click="logout">退出登录</el-button>
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
          <div class="entry-item" v-for="(item, index) in entries" :key="index">
            <el-icon><component :is="item.icon"></component></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const entries = ref([
  { label: '使用分析', icon: 'DataAnalysis', route: '' },
  { label: '使用习惯', icon: 'Setting', route: '' },
  { label: '更新日志', icon: 'ScaleToOriginal', route: '' },
  { label: '关于系统', icon: 'InfoFilled', route: '' }
])

const goProfile = (type) => {
  router.push({
    path: '/profile',
    query: {
      type
    }
  })
}

const logout = () => {
  localStorage.clear()
  window.location.reload()
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
  }
  .user-info-name {
    margin-left: 8px;
    color: #606266;
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
    border: 1px solid rgb(16, 111, 255);
    color: rgb(16, 111, 255);
  }
  .user-info-caret {
    margin-left: 5px;
    padding-top: 5px;
    .el-icon {
      color: #707070;
    }
  }
}
.user-info-popover {
  transform: translate(-20px, 59px) !important;
  padding: 0 !important;
  background: #FFFFFF;
  box-shadow: 0px 0px 48px 2px rgba(0,0,0,0.2);
  padding: 0px !important;
  .el-popper__arrow {
    display: none;
  }
  .user-info__content {
    .popover__header {
      width: 100%;
      height: 80px;
      background-image: url('./images/user-info-popover-bg.png');
      border-bottom: 1px dashed #ddd;
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
            color: #333841;
          }
          .user-role {
            font-size: 12px;
            color: #808392;
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
          color: #666666;
          .el-icon {
            font-size: 30px;
          }
          > span {
            font-size: 14px;
            font-weight: 400;
          }
          &:hover {
            color: #409eff;
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
          background: #F8FAFC;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2px;
          color: #1c1f21;
          cursor: pointer;
          &:nth-child(odd) {
            border-right: 2px solid #fff;
          }
          .el-icon {
            font-size: 16px;
            margin-right: 8px;
          }
          &:hover {
            background: #efefef;
          }
        }
      }
    }
  }
}
</style>