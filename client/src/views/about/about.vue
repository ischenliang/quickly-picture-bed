<template>
  <div class="about-wrapper">
    <div style="display: flex;justify-content: center;min-height: 42px;padding-bottom: 20px;">
      <p class="uplog-title">关于系统</p>
    </div>
    <div class="about-line">
      <p class="about-title">网站基本信息</p>
      <p class="about-inline">网站名称: {{ website.name }}</p>
      <p class="about-inline">网站作者: {{ website.author }}</p>
      <p class="about-inline">当前版本: {{ website.version }}</p>
      <p class="about-inline">网站标签: {{ website.keys.join('、') }}</p>
      <p class="about-inline">网站描述: {{ website.desc }}</p>
    </div>
    <div class="about-line">
      <p class="about-title">联系作者</p>
      <p class="about-inline">Github主页: <a :href="contact.github" target="_blank">{{ contact.github }}</a></p>
      <p class="about-inline">Gitee主页: <a :href="contact.gitee" target="_blank">{{ contact.gitee }}</a></p>
      <p class="about-inline">微信号: {{ contact.weixin }}</p>
      <p class="about-inline">QQ号: {{ contact.qq }}</p>
      <p class="about-inline">QQ群: {{ contact.qq_group }}</p>
    </div>
    <div class="about-line">
      <p class="about-title">支持作者</p>
      <p class="about-inline">二维码是自愿捐赠！请确保网站您能使用，并且用了很久觉得好再捐赠！</p>
      <p class="about-inline">网站完全免费，就算不捐，站长也会自费运营网站！</p>
      <p class="about-inline">网站成本平均一人一月大概3元，只要每月捐三元，网站就能活下去！</p>
      <c-reward></c-reward>
    </div>
    <div class="about-line">
      <p class="about-title">版权信息</p>
      <p class="about-inline">未经许可，禁止商用！！！</p>
      <p class="about-inline">版权归属: {{ system.copyright_company }}</p>
      <p class="about-inline">运营时间段: {{ system.copyright_time }}</p>
      <p class="about-inline">工信备案号: {{ system.copyright_miitbeian }}</p>
    </div>
    <div class="about-line">
      <p class="about-title">系统说明</p>
      <bytemd-viewer :value="value"></bytemd-viewer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import bytemdViewer from '@/components/editor/bytemdPreview.vue'
import { computed, ref } from 'vue';
import useConfigStore from '@/store/config'
import cReward from '@/components/cReward.vue';

/**
 * 实例
 */
const configStore = useConfigStore()

const value = ref(configStore.systemConfig.contact.about)


/**
 * 变量
 */
const website = computed(() => {
  return configStore.systemConfig.website
})
const system = computed(() => {
  return configStore.systemConfig.system
})
const contact = computed(() => {
  return configStore.systemConfig.contact
})
</script>

<style lang="scss">
.uplog-title {
  height: 100%;
  font-size: 30px;
  text-align: center;
  color: var(--el-color-primary);
  font-weight: bold;
  background-image: url('/images/left.png'), url('/images/right.png');
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  padding: 0 150px;
}
.about {
  color: var(--el-text-color-primary);
  &-inline {
    line-height: 26px;
    color: var(--el-text-color-regular);
  }
  &-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    border-left: 5px solid var(--el-color-primary);
    padding-left: 10px;
    line-height: 24px;
    color: var(--el-text-color-primary);
  }
  &-line {
    margin-top: 20px;
  }
}
</style>