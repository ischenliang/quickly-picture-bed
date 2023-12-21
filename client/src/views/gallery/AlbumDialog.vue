<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'移入相册'"
    :width="'600px'"
    :before-close="handleClose">
    <div>
      <p style="margin-bottom: 10px;">相册列表</p>
      <el-select v-model="album_id" filterable style="width: 100%;">
          <el-option
            v-for="(item, index) in albums"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </div>
    <template #action>
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="!album_id">确定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { AlbumInter } from '@/typings/interface';
import { computed, Ref, ref } from 'vue';
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import Album from '@/types/Album';
import { PageResponse } from '@/typings/req-res';
import Image from '@/types/Image';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  ids: number[]
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  ids: () => ([])
})
const emit = defineEmits(['update:modelValue', 'submit'])
const album = new Album()
const image = new Image()
const ctx = useCtxInstance()

/**
 * 变量
 */
const dialogVisible = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})
// 相册列表
const albums: Ref<Array<{ label: string, value: number, desc: string }>> = ref([])
const album_id: Ref<number> = ref(null)

/**
 * 回调函数
 */
function handleClose () {
  dialogVisible.value = false
}
// 获取相册列表
function getAlbums () {
  album.find({}).then((res: PageResponse<AlbumInter, { id: string, count: number }>) => {
    albums.value = [
      // { label: '图库', value: null, desc: '不放进任何相册中' },
      ...res.items.map(item => {
        return {
          label: item.name,
          value: item.id,
          desc: item.desc
        }
      })
    ]
  })
}
getAlbums()
// 提交
function handleSubmit () {
  props.ids.forEach((id, index) => {
    image.update({
      id: id,
      album_id: album_id.value
    }).then(async (res) => {
      if (index === props.ids.length - 1) {
        ctx.$message({ message: '移入成功', duration: 1000, type: 'success' })
        emit('submit')
      }
    })
  })
}
</script>

<style lang="scss">
</style>