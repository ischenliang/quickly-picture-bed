<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑相册' : '新建相册'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" class="album-dialog-form" label-position="top" ref="formRef">
      <el-form-item label="相册名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入相册名称" size="large" />
      </el-form-item>
      <el-form-item label="访问权限" prop="access_type">
        <el-select v-model="form.access_type" placeholder="请选择访问权限" size="large" style="width: 100%" popper-class="album-status-popper">
          <el-option :value="0" label="私密相册">
            <p class="title"><el-icon><Lock /></el-icon>私密相册</p>
            <p class="desc">私密相册，仅自己可见</p>
          </el-option>
          <el-option :value="1" label="公开相册">
            <p class="title"><el-icon><Unlock /></el-icon>公开相册</p>
            <p class="desc">公开相册，所有用户均可见</p>
          </el-option>
          <el-option :value="2" label="密码访问">
            <p class="title"><el-icon><SwitchButton /></el-icon>密码访问</p>
            <p class="desc">密码访问，其他用户校验密码后方可见</p>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.access_type === 2" label="访问密码" prop="access_pass">
        <el-input v-model="form.access_pass" placeholder="请输入相册访问密码" size="large" />
      </el-form-item>
      <el-form-item label="顶部背景色" prop="background">
        <el-color-picker v-model="form.background" color-format="hex" show-alpha :predefine="[
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          'hsv(51, 100, 98)',
          'hsva(120, 40, 94, 0.5)',
          'hsl(181, 100%, 37%)',
          'hsla(209, 100%, 56%, 0.73)',
          '#c7158577',
        ]" />
      </el-form-item>
      <el-form-item label="相册简介" prop="desc">
        <el-input v-model="form.desc" placeholder="介绍一下该相册..." type="textarea" :rows="4" size="large" />
      </el-form-item>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { AlbumInter } from '@/typings/interface';
import { computed, reactive, ref, watch } from 'vue';
import { useCtxInstance, useGetSuffix } from '@/hooks/global';
import { FormRules } from 'element-plus';
import Album from '@/types/Album';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: AlbumInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as AlbumInter)
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
const form: AlbumInter = reactive({
  id: 0,
  name: '',
  desc: '',
  cover: '',
  background: '#009688',
  access_type: 0,
  access_pass: ''
})
const rules: FormRules = reactive({
  name: [
    { required: true, message: '请输入相册名称', trigger: ['blur'] }
  ],
  access_type: [
    { required: true, message: '请选择相册访问权限', trigger: ['blur'] }
  ],
  access_pass: [
    {
      required: true,
      trigger: ['blur', 'change'],
      validator: (rule: any, value: any, callback: any) => {
        if (form.access_type === 2 && value === '') {
          callback('请输入相册访问密码')
        } else {
          callback()
        }
      }
    }
  ],
  background: [
    { required: true, message: '请选择顶部背景色', trigger: ['blur', 'change'] }
  ]
})
// 表单ref
const formRef = ref(null)
const loading = reactive({
  background: false,
  cover: false
})

/**
 * 回调函数
 */
// 关闭窗口
const handleClose = () => {
  dialogVisible.value = false
}
// 上传
const beforeUpload = (e: { files: FileList, error: string }, property) => {
  const file = e.files[0]
  const size = file.size / 1024 / 1024 // 单位换算成MB
  if (size > 2) {
    return ctx.$message({ message: '图片大小不能大于2MB', duration: 1000, type: 'error' })
  }
  const suffix = useGetSuffix(file.name, '.')
  loading[property] = true
}
// 提交
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (form.id) {
        itemUpdate()
      } else {
        itemCreate()
      }
    }
  })
}
// 创建
const itemCreate = () => {
  delete form.id
  album.create(form).then(res => {
    handleClose()
    emit('submit')
    ctx.$message({ message: '新建成功', duration: 1000, type: 'success' })
  })
}
// 更新
const itemUpdate = () => {
  album.update(form).then(res => {
    handleClose()
    emit('submit')
    ctx.$message({ message: '更新成功', duration: 1000, type: 'success' })
  })
}

/**
 * 监听器
 */
watch(() => props.detail, (val) => {
  if (val) {
    form.id = props.detail.id
    for (let key in form) {
      form[key] = props.detail[key]
    }
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.album-dialog-form {
  width: 100%;
  margin-bottom: 10px;
  .album-background {
    width: 100%;
    height: 180px;
    border-radius: 8px;
    margin-top: 1px;
    position: relative;
    overflow: hidden;
    .album-background-img {
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      z-index: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .c-upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      &.c-upload-active {
        .el-icon--upload, .el-upload__text {
          color: #fff;
        }
        .c-upload-dragger {
          background: transparent;
          &:hover {
            background: rgba($color: #ffffff, $alpha: 0.2);
          }
        }
      }
      .el-icon--upload {
        margin-bottom: 10px;
      }
    }
  }
  .album-form-inline {
    display: flex;
    justify-content: space-between;
    .inline-left {
      flex: 1;
      // background: #ccc;
    }
    .inline-right {
      flex: 1;
      margin-left: 30px;
    }
  }
  .album-cover {
    width: 100%;
    height: 180px;
    border-radius: 8px;
    margin-top: 1px;
    position: relative;
    overflow: hidden;
    .album-cover-img {
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      z-index: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .c-upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      &.c-upload-active {
        .el-icon--upload, .el-upload__text {
          color: #fff;
        }
        .c-upload-dragger {
          background: transparent;
          &:hover {
            background: rgba($color: #ffffff, $alpha: 0.2);
          }
        }
      }
      .el-icon--upload {
        margin-bottom: 10px;
      }
    }
  }
}
.album-status-popper {
  .el-select-dropdown__item {
    height: auto !important;
    margin-bottom: 5px;
    .desc {
      font-size: 14px;
      color: #999;
      line-height: 24px;
    }
    .title {
      line-height: 30px;
      font-weight: bold;
      display: flex;
      font-size: 15px;
      align-items: center;
      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>