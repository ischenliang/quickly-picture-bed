<template>
  <div class="img-upload" @click="handleClick">
    <img v-if="url" :src="baseUrl + url" alt="">
    <el-icon v-else><Plus /></el-icon>
    <input type="file" ref="imgRef" accept=".png,.jpg,.ico,.webp,.gif" @change="handleChange">
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { uploadImg } from '@/types/av'
import { useGetSuffix } from '@/hooks/global';

interface Props {
  name: string // 属性字段名称
  url: string // 访问url，完整
  baseUrl?: string // 静态文件前缀
}
const props = withDefaults(defineProps<Props>(), {
  name: '',
  baseUrl: '',
  url: ''
})
const emit = defineEmits(['submit'])

/**
 * 变量
 */
const imgRef: Ref<HTMLInputElement | null> = ref(null)

/**
 * 逻辑处理
 */
const handleChange = (e) => {
  const file: File = e.target.files[0]
  const suffix = useGetSuffix(file.name, '.')
  uploadImg(props.name + '.' + suffix, file).then((res: any) => {
    const img_url = res.attributes.url.replace(new RegExp(props.baseUrl, 'g'), '')
    emit('submit', {
      name: props.name,
      url: img_url
    })
    imgRef.value.value = ''
  })
}
const handleClick = () => {
  imgRef.value.click()
}
</script>

<style lang="scss">
.img-upload {
  width: 200px;
  height: 200px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #8c939d;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
  img {
    object-fit: scale-down;
    width: 100%;
    height: 100%;
  }
  input {
    display: none;
  }
}
</style>