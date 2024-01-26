<template>
  <div>
    <div style="display: flex;justify-content: center;min-height: 42px;padding-bottom: 20px;">
      <p class="uplog-title">更新日志</p>
    </div>
    <bytemd-viewer :value="value"></bytemd-viewer>
  </div>
</template>

<script lang="ts" setup>
import bytemdViewer from '@/components/editor/bytemdPreview.vue'
import { ref } from 'vue';
import useConfigStore from '@/store/config'

/**
 * 实例
 */
const configStore = useConfigStore()

const value = ref(configStore.systemConfig.uplog)
</script>

<style lang="scss">
.uplog-title {
  height: 100%;
  font-size: 30px;
  text-align: center;
  color: #1665B4;
  font-weight: bold;
  background-image: url('/images/left.png'), url('/images/right.png');
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  padding: 0 150px;
  margin-top: 20px;
}

.img-small {
  display: block;
  height: 200px;
  border: 1px dashed #ddd !important; 
}
.img-medium {
  display: block;
  height: 300px;
  border: 1px dashed #ddd !important; 
}
.img-large {
  display: block;
  width: 100%;
  height: auto;
  border: 1px dashed #ddd !important; 
}

</style>