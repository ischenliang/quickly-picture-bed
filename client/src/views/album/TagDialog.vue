<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'编辑标签'"
    :width="'700px'"
    :before-close="handleClose">
    <div class="album-tags-dialog">
      <div class="album-dialog-tags template-tags">
        <p>模板标签</p>
        <el-tag
          v-for="(item, index) in tags.tags.slice(1)"
          :key="'template-' + index"
          :type="(item.type as any)"
          @click="addTag(item)">
          {{ item.value }}
        </el-tag>
      </div>
      <div class="album-dialog-tags">
        <p>已选标签</p>
        <el-tag
          v-for="(item, index) in selectedTags"
          :key="'selected-' + index"
          :type="(item.type as any)"
          closable
          @close="handleRemove(index)">
          {{ item.value }}
        </el-tag>
      </div>
      <div class="album-dialog-tags" style="display: flex;flex-direction: column;">
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
          <el-button style="margin-top: 10px;" type="primary" @click="handleAdd">确定新增</el-button>
        </div>
      </div>
    </div>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import Image from '@/types/Image';
import { AlbumTag, ImageInter, TagInter } from '@/typings/interface';
import { ElInput } from 'element-plus';
import { computed, reactive, Ref, ref, watch } from 'vue';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ImageInter
  tags: AlbumTag
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    id: 0
  } as ImageInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
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
const form: TagInter = reactive({
  type: 'primary',
  value: ''
})
const selectedTags: Ref<TagInter[]> = ref([])

/**
 * 回调函数
 */
// 新增标签
function handleAdd () {
  if (!form.type) {
    return ctx.$message({ message: '请选择标签类型', duration: 1000, type: 'warning' })
  }
  if (!form.value.trim()) {
    return ctx.$message({ message: '请填写标签内容', duration: 1000, type: 'warning' })
  }
  // 先判断当前标签是否已存在
  const flag = selectedTags.value.some(el => el.value === form.value && el.type === form.type)
  if (flag) {
    ctx.$message({ message: '该标签已存在', duration: 1000, type: 'warning' })
  }
  selectedTags.value.push({ type: form.type, value: form.value })
  form.type = ''
  form.value = ''
}
// 关闭窗口
const handleClose = () => {
  dialogVisible.value = false
}
// 提交
function submit () {
  image.update({
    id: props.detail.id,
    tags: selectedTags.value
  }).then(res => {
    dialogVisible.value = false
    emit('submit')
  })
}
// 删除
function handleRemove (index: number) {
  selectedTags.value.splice(index, 1)
}
// 添加标签
function addTag (tag) {
  selectedTags.value.push(tag)
}

/**
 * 监听器
 */
watch(() => props.detail, (val) => {
  if (val) {
    selectedTags.value = val.tags && val.tags.length ? [...val.tags] : []
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.album-tags-dialog {
  .album-dialog-tags {
    margin-top: 15px;
    + .album-dialog-tags {
      margin-top: 25px;
    }
    &.template-tags {
      .el-tag {
        cursor: pointer;
      }
    }
    .el-tag {
      margin-top: 5px;
    }
    p {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--el-color-primary);
    }
  }
  .el-tag {
    + .el-tag {
      margin-left: 10px;
    }
  }
}
</style>