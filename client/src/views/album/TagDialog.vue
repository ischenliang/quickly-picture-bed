<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'编辑标签'"
    :width="'700px'"
    :before-close="handleClose">
    <div class="album-tags-dialog">
      <div class="album-dialog-tags template-tags">
        <p>模板标签</p>
        <el-tag v-for="(item, index) in tags" :key="'template-' + index" @click="addTag(item.value)">
          {{ item.label }}
        </el-tag>
      </div>
      <div class="album-dialog-tags">
        <p>已选标签</p>
        <el-tag
        v-for="(item, index) in selected"
        :key="'selected-' + index"
        type="success"
        closable
        @close="handleRemove(item)">{{ item }}</el-tag>
        <el-input
          v-if="edit"
          ref="InputRef"
          v-model="value"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"/>
        <el-tag v-else type="success" class="add-tag" effect="dark" @click="showInput">+ 新增</el-tag>
      </div>
    </div>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import Dict from '@/types/Dict';
import Image from '@/types/Image';
import { DictInter, ImageInter } from '@/typings/interface';
import { ElInput } from 'element-plus';
import { computed, nextTick, Ref, ref, watch } from 'vue';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ImageInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    id: ''
  } as ImageInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const dict = new Dict()
const image = new Image()


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
const tags: Ref<Array<{ label: string; value: string }>> = ref([])
const selected: Ref<string[]> = ref([])
const edit = ref(false)
const value = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()

/**
 * 回调函数
 */
// 关闭窗口
const handleClose = () => {
  dialogVisible.value = false
}
// 提交
const submit = () => {
  image.update({
    id: props.detail.id,
    slient: true,
    tags: selected.value
  }).then(res => {
    dialogVisible.value = false
    emit('submit')
  })
}
const listGet = () => {
  dict.detailByPro('code', 'album_tag').then((res: DictInter) => {
    tags.value = res.values.map(item => {
      return {
        label: item.label as string,
        value: item.value as string
      }
    })
  })
}
listGet()
// 显示输入框
const showInput = () => {
  edit.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
// 输入框输入
const handleInputConfirm = () => {
  if (value.value) {
    selected.value.push(value.value)
  }
  edit.value = false
  value.value = ''
}
// 删除
const handleRemove = (tag: string) => {
  selected.value.splice(selected.value.indexOf(tag), 1)
}
// 添加标签
const addTag = (tag) => {
  selected.value.push(tag)
}

/**
 * 监听器
 */
watch(() => props.detail, (val) => {
  if (val) {
    selected.value = val.tags && val.tags.length ? [...val.tags] : []
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.album-tags-dialog {
  .album-dialog-tags {
    margin-top: 15px;
    + & {
      margin-top: 25px;
    }
    &.template-tags {
      .el-tag {
        cursor: pointer;
      }
    }
    p {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2d8cf0;
    }
    .el-input {
      width: 80px;
    }
    .add-tag, .el-input {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .el-tag {
    + .el-tag {
      margin-left: 10px;
    }
  }
}
</style>