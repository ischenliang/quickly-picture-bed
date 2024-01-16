<template>
  <div class="reward">
    <div class="reward-item" v-for="(item, index) in rewards">
      <div class="reward-item-img">
        <img :src="item.cover" :alt="item.label">
      </div>
      <div class="reward-item-label">{{ item.label }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { RewardInter } from '@/typings/interface'
import { Ref, computed } from 'vue';
/**
 * 实例
 */
const configStore = useConfigStore()

/**
 * 变量
 */
const rewards: Ref<RewardInter[]> = computed(() => {
  const website = configStore.systemConfig.website
  return [
    { label: '支付宝', cover: website.reward_alipay },
    { label: '微信', cover: website.reward_weixin }
  ]
})
</script>
<style lang="scss">
.reward {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  .reward-item {
    max-width: 200px;
    min-width: 100px;
    border: 1px dashed var(--el-border-color);
    margin-right: 20px;
    margin-bottom: 10px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    &-img {
      img {
        width: 100%;
      }
    }
    &-label {
      line-height: 24px;
      text-align: center;
      margin-top: -8px;
      padding-bottom: 5px;
      font-weight: bold;
    }
  }
}
</style>