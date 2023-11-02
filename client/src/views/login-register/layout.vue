<template>
  <!-- 组件wrapper -->
  <div class="login-layout">
    <div class="login-layout__left">
      <div class="login-function">
        <img class="login-function-cover" src="./images/banner.png" />
        <div class="login-system-title">LightFastPicture</div>
        <div class="login-system-title">轻量快捷图片管理系统</div>
        <div class="login-system-desc">一套轻量级图片资源管理系统、图床系统</div>
        <div class="function-list">
          <div class="function-item" v-for="(item, index) in funcions" :key="index">
            <img src="./images/login-check.png" alt="">
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="login-swiper" v-if="slots.default">
        <swiper
          :modules="[Pagination, Autoplay]"
          :pagination="{
            clickable: true,
          }"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
          }">
          <swiper-slide v-for="(item, index) in swipers" :key="'swiper-slide-' + index">
            <p class="swiper-slide-title">{{ item.label }}</p>
            <div class="swiper-slide-desc">{{ item.desc }}</div>
            <img :src="item.url" alt="">
          </swiper-slide>
          <!-- <swiper-slide>Slide 2</swiper-slide>
          <swiper-slide>Slide 3</swiper-slide> -->
        </swiper>
      </div>
    </div>
    <div class="login-layout__right">
      <div class="login-section" v-if="slots.default">
        <slot></slot>
      </div>
      <div class="login-footer" v-if="slots.default">
        <div class="footer-inline">
          <router-link :to="'/contact'" tag="a" target="_blank">联系我们</router-link>|
          <router-link :to="'/contact'" tag="a" target="_blank">关于系统</router-link>|
          <template
            v-for="(item, index) in configStore.systemConfig.bucket_service"
            :key="index">
            <a :href="item.link" :target="item.target">{{ item.label }}</a>
            <span v-if="index !== configStore.systemConfig.bucket_service.length - 1">|</span>
          </template>
        </div>
        <div class="footer-inline">
          <span>商务联系： {{ authorConfig.email }}</span>|
          <span>技术支持： {{ authorConfig.email }}</span>
        </div>
        <div class="footer-inline">
          <span>Copyright © 2019 - {{ year }} {{ website.author }} All Rights Reserved.</span>
          <a :href="copyright.miiturl">
            <span>{{ copyright.miitbeian }}</span>
          </a>
        </div>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useSlots, computed } from 'vue';
import { Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import useConfigStore from '@/store/config';
import { authorConfig } from '@/global.config'

/**
 * 实例
 */
const slots = useSlots()
const configStore = useConfigStore()

/**
 * 变量
 */
const funcions = ref([
  '简洁的操作界面',
  '多样化云储存',
  '完整的可视化数据统计',
  '强大的图片预览功能',
  '完整的权限管理'
])
const swipers = ref([
  { label: '图片上传区', desc: '可以选择指定存储桶将其图片上传到该存储桶对应的云服务中，支持图片多图上传、拖拽上传、上传预览、全屏预览。', url: new URL('./images/home.png', import.meta.url).href },
  { label: '图片管理', desc: '扁平化图片管理功能，支持全选、单选多选、一键复制等，并且提供强大的图片预览功能，支持图片上下左右翻转、平面翻转、放大缩小等。', url: new URL('./images/gallery.png', import.meta.url).href },
  { label: '存储桶管理', desc: '储存驱动易拓展，多样化储存，支持本地，阿里云、腾讯云、七牛云等对象存储，支持多桶储存，可同时添加多个对象存储桶管理，上不封顶。', url: new URL('./images/bucket.png', import.meta.url).href },
  { label: '相册管理', desc: '提供了直观的界面和便捷的操作方式，帮助用户快速管理和回顾珍贵的照片回忆。将照片按不同主题或分类进行整理和归档。', url: new URL('./images/album.png', import.meta.url).href },
  { label: '操作日志', desc: '完整的可视化日志功能，记录用户所有操作，方便事件溯源，同时日志记录也是作为贡献数据统计的重要来源。', url: new URL('./images/log.png', import.meta.url).href },
  { label: '插件市场', desc: '提供了数十种内置插件，用户可以安装插件来支持不同的对象存储服务，例如阿里云oss，腾讯云cos，七牛云todo等对象存储服务。', url: new URL('./images/plugin.png', import.meta.url).href },
  { label: '知识库管理', desc: '整合、组织和存储海量信息，实现高效的知识管理和检索，帮助用户轻松获取所需知识并提升工作效率。', url: new URL('./images/wiki.png', import.meta.url).href },
  { label: '个人中心', desc: '扁平化个人中心管理功能，对个人资料以及登录密码进行管理，同时系统提供了一系列好看的内置头像供选。', url: new URL('./images/profile.png', import.meta.url).href },
  { label: '偏好设置配置', desc: '考虑到每个用户的偏好设置不同，系统提供了偏好设置配置中心，可以配置自定义链接格式、复制链接的类型以及常用快捷键。', url: new URL('./images/habits.png', import.meta.url).href },
  { label: '数据统计', desc: '系统提供了美观的数据统计功能，使得用户很清晰的看到图片数量、存储桶数量、占用总存储量、近一年的贡献度以及存储桶的使用情况。', url: new URL('./images/analysis.png', import.meta.url).href }
])
const year = new Date().getFullYear()
const copyright = computed(() => {
  const system = configStore.systemConfig.system
  return {
    miitbeian: system.copyright_miitbeian,
    miiturl: system.copyright_miiturl
  }
})
const website = computed(() => {
  return configStore.systemConfig.website
})


/**
 * 回调函数
 */
</script>

<style lang="scss">
.login-layout {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .login-layout__left {
    width: 500px;
    flex-shrink: 0;
    height: 100%;
    background-image: url('./images/login-left.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    > div {
      flex: 1;
      flex-shrink: 0;
    }
    .login-function {
      display: flex;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .login-system-title {
      margin-top: 10px;
      color: #fff;
      font-size: 30px;
    }
    .login-system-desc {
      color: #fff;
      font-size: 20px;
      margin-top: 10px;
    }
    .function-list {
      margin-top: 5px;
      .function-item {
        margin-top: 5px;
        display: flex;
        align-items: center;
        color: #fff;
        img {
          margin-right: 10px;
          width: 12px;
        }
      }
    }
  }
  .login-layout__right {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 200px;
      bottom: -50px;
      left: 0;
      background-image: url('./images/mountain.png');
      background-repeat: repeat-x;
      background-size: 100% 100%;
      background-position: 0 bottom;
      z-index: 3;
      pointer-events: none;
    }
    .login-footer {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 10px;
      .footer-inline {
        // color: #b9bcc3;
        color: rgb(136, 136, 136);
        font-size: 12px;
        span {
          margin: 0 5px;
        }
        a {
          margin: 0 5px;
          &:link, &:visited, &:active {
            color: inherit;
            text-decoration: none;
          }
          &:hover {
            color: #409eff;
          }
        }
        + .footer-inline {
          margin-top: 5px;
        }
      }
    }
  }
  .login-section {
    background-color: #FFFFFF;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 10px;
    width: 500px;
    min-height: 300px;
    padding: 0 50px 0px 50px;
    box-sizing: border-box;
    box-sizing: 0 0 20px 8px #6336ee0d;
    z-index: 555;
  }
  .login-swiper {
    display: flex;
    align-items: flex-end;
    padding: 20px;
    .swiper {
      // width: 100%;
      // height: 100%;
      .swiper-slide {
        img {
          width: 100%;
        }
        .swiper-slide-title {
          font-size: 22px;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
        }
        .swiper-slide-desc {
          color: rgba($color: #fff, $alpha: 0.95);
          line-height: 18px;
          font-size: 14px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.swiper-pagination {
  bottom: 20px !important;
}
</style>