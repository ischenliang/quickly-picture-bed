<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'相册标签库'"
    :width="'700px'"
    :before-close="handleClose">
    <div class="album-default-tags">
      <div class="tags-list">
        <p>模板标签库</p>
        <el-tag
          v-for="(item, index) in tags"
          :key="index"
          :type="item.type === 'primary' ? '' : item.type"
          closable
          @close="handleRemove(item, index)">
          {{ item.value }}
        </el-tag>
      </div>
      <div class="tags-manage">
        <p>新增标签</p>
        <div>
          <el-input v-model="form.value" placeholder="请输入标签内容">
            <template #prepend>
              <el-select v-model="form.type" placeholder="标签类型" style="width: 110px;">
                <el-option label="primary" value="primary"></el-option>
                <el-option label="danger" value="danger"></el-option>
                <el-option label="success" value="success"></el-option>
                <el-option label="info" value="info"></el-option>
                <el-option label="warning" value="warning"></el-option>
              </el-select>
            </template>
          </el-input>
          <el-button type="primary" @click="handleAdd">确定新增</el-button>
        </div>
      </div>
    </div>
    <template #action>
      <el-button type="primary" @click="handleSubmit">关 闭</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import { AlbumTag, TagInter } from '@/typings/interface';
import { Ref, computed, reactive, ref, watch } from 'vue';
import Album from '@/types/Album'

interface Props {
  modelValue: boolean
  detail: AlbumTag
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as AlbumTag)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const ctx = useCtxInstance()
const album = new Album()

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
const form: TagInter = reactive({
  type: '',
  value: ''
})
const tags: Ref<TagInter[]> = ref()
tags.value = props.detail.tags.slice(1)

/**
 * 回调函数
 */
// 关闭窗口
function handleClose () {
  dialogVisible.value = false
}
// 删除标签
function handleRemove (item: { type: string; value: string; }, index: number) {
  tags.value.splice(index, 1)
  submit()
}
// 新增标签
function handleAdd () {
  if (!form.type) {
    return ctx.$message({ message: '请选择标签类型', duration: 1000, type: 'warning' })
  }
  if (!form.value.trim()) {
    return ctx.$message({ message: '请填写标签内容', duration: 1000, type: 'warning' })
  }
  // 先判断当前标签是否已存在
  const flag = tags.value.some(el => el.value === form.value && el.type === form.type)
  if (flag) {
    ctx.$message({ message: '该标签已存在', duration: 1000, type: 'warning' })
  }
  tags.value.push({ type: form.type, value: form.value })
  form.type = ''
  form.value = ''
  submit()
}
// 提交
function submit () {
  album.updateTags(props.detail.album_id, tags.value).then(res => {
    // ctx.$message({ message: '', duration: 1000, type: 'warning' })
  })
}
function handleSubmit () {
  handleClose()
  emit('submit')
}
</script>

<style lang="scss">
.album-default-tags {
  .tags-list {
    .el-tag {
      margin-top: 5px;
      & + .el-tag {
        margin-left: 5px;
      }
     }
  }
  p {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--el-color-primary);
  }
  .tags-manage {
    margin-top: 25px;
    > div > .el-button {
      margin-top: 10px;
    }
  }
}
</style>