<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑相册' : '新建相册'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" class="album-dialog-form" label-position="top" ref="formRef">
      <!-- 背景图 -->
      <el-form-item label="顶部背景图" prop="background">
        <div class="album-background" v-loading="loading.background">
          <div class="album-background-img">
            <img v-if="form.background" :src="form.background" alt="">
          </div>
          <web-upload
            :accept="['png', 'jpg', 'jpeg']"
            :limit="1"
            :multiple="false"
            :class="form.background ? 'c-upload-active' : ''"
            @upload="beforeUpload($event, 'background')">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              建议尺寸1080*800，支持PNG、JPG、JPEG<br/>
              支持拖拽上传，最大2M
            </div>
          </web-upload>
        </div>
      </el-form-item>
      <div class="album-form-inline">
        <div class="inline-left">
          <el-form-item label="相册名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入相册名称" size="large" />
          </el-form-item>
          <el-form-item label="相册简介" prop="desc">
            <el-input v-model="form.desc" placeholder="介绍一下该相册..." type="textarea" :rows="4" size="large" />
          </el-form-item>
        </div>
        <div class="inline-right">
          <el-form-item label="相册封面" prop="cover">
            <div class="album-cover" v-loading="loading.cover">
              <div class="album-cover-img">
                <img v-if="form.cover" :src="form.cover" alt="">
              </div>
              <web-upload
                :accept="['png', 'jpg', 'jpeg']"
                :limit="1"
                :multiple="false"
                :class="form.cover ? 'c-upload-active' : ''"
                @upload="beforeUpload($event, 'cover')">
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  建议尺寸1080*800，支持PNG、JPG、JPEG<br/>
                  支持拖拽上传，最大2M
                </div>
              </web-upload>
            </div>
          </el-form-item>
        </div>
      </div>
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
import WebUpload from '@/components/web/upload/index.vue'
import { useCtxInstance, useGetSuffix } from '@/hooks/global';
import { useFileName } from '@/hooks/date-time';
import { FormRules } from 'element-plus';
import Album from '@/types/Album';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: AlbumInter
  baseUrl: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  baseUrl: '',
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
  cover_preview: '',
  background: '',
  background_preview: '',
  uid: '',
})
const rules: FormRules = reactive({
  name: [
    { required: true, message: '请输入相册名称', trigger: ['blur'] }
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
</style>