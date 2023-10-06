<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑知识库' : '新建知识库'"
    :width="'800px'"
    class="wiki-dialog"
    :before-close="handleClose">
    <el-form class="wiki-inline wiki-form" :label-position="'top'" :model="form" :rules="rules" ref="formRef">
      <!-- 左侧区域 -->
      <div class="wiki-inline-item">
        <div class="wiki-inline-content">
          <div class="wiki-inline-name">知识库</div>
          <div class="wiki-inline-desc">整合、组织和存储海量信息，实现高效的知识管理和检索，帮助用户轻松获取所需知识并提升工作效率。</div>
          <el-form-item label="知识库名称" prop="title">
            <el-input v-model="form.title" placeholder="输入知识库名称" size="large"></el-input>
          </el-form-item>
          <el-form-item label="可见范围" prop="status">
            <el-select v-model="form.status" style="width: 100%;" size="large" placeholder="请选择可见范围" popper-class="wiki-status-popper">
              <el-option :value="true" label="公开">
                <p class="title"><el-icon><Unlock /></el-icon>公开</p>
                <p class="desc">组织全部成员可见，仅空间成员可编辑</p>
              </el-option>
              <el-option :value="false" label="私有">
                <p class="title"><el-icon><Lock /></el-icon>私有</p>
                <p class="desc">仅空间成员可见及编辑</p>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="知识库介绍" prop="description">
            <el-input type="textarea" rows="3" placeholder="输入知识库描述" v-model="form.description" size="large"></el-input>
          </el-form-item>
        </div>
        <div class="wiki-inline-img">
          <wiki-svg></wiki-svg>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="wiki-inline-divider"></div>
      <!-- 右侧区域 -->
      <div class="wiki-inline-item">
        <div class="wiki-inline-content">
          <div class="wiki-inline-name">关联仓库</div>
          <div class="wiki-inline-desc">考虑到方便知识库的文章作版本控制，故将文章内容保存在git远程仓库，通过RestApi访问。</div>
          <el-form-item label="仓库类型" prop="config.type">
            <el-select style="width: 100%;" size="large" v-model="form.config.type" :disabled="detail && detail.id ? true : false">
              <el-option label="Gitee" value="gitee"></el-option>
              <el-option label="Github" value="github"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Git用户名" prop="config.owner">
            <el-input v-model="form.config.owner" placeholder="输入Git用户名" size="large" :disabled="detail && detail.id ? true : false"></el-input>
          </el-form-item>
          <el-form-item label="Git仓库名" prop="config.repo">
            <el-input v-model="form.config.repo" placeholder="输入Git仓库名" size="large" :disabled="detail && detail.id ? true : false"></el-input>
          </el-form-item>
          <el-form-item label="Git仓库分支" prop="config.branch">
            <el-input v-model="form.config.branch" placeholder="输入Git仓库分支" size="large" :disabled="detail && detail.id ? true : false"></el-input>
          </el-form-item>
          <el-form-item label="Git仓库基地址" prop="config.baseurl">
            <el-input v-model="form.config.baseurl" placeholder="输入Git仓库基地址" size="large" :disabled="detail && detail.id ? true : false"></el-input>
          </el-form-item>
          <el-form-item label="Git访问token" prop="config.access_token">
            <el-input v-model="form.config.access_token" show-password placeholder="输入Git的access_token" size="large"></el-input>
          </el-form-item>
          <el-form-item class="last-form-item">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :loading="loading.submit" @click="submit">确 定</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </com-dialog>
</template>

<script lang="ts" setup>
import { WikiInter } from '@/typings/interface';
import { computed, reactive, ref, watch } from 'vue';
import WikiSvg from './wiki-svg.vue'
import Wiki from '@/types/Wiki';
import { useCtxInstance } from '@/hooks/global';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: WikiInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as WikiInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const wiki = new Wiki()
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
const form: WikiInter = reactive({
  title: '',
  status: false,
  description: '',
  config: {
    type: 'gitee',
    owner: '',
    repo: '',
    branch: 'master',
    baseurl: '/',
    access_token: ''
  }
})
const rules = reactive({
  title: [
    { required: true, message: '请输入知识库名称', trigger: ['blur', 'change'] }
  ],
  status: [
    { required: true, message: '请选择知识库可见范围', trigger: ['blur', 'change'] }
  ],
  'config.owner': [
    { required: true, message: '请输入关联仓库用户名', trigger: ['blur', 'change'] }
  ],
  'config.repo': [
    { required: true, message: '请输入关联仓库名', trigger: ['blur', 'change'] }
  ],
  'config.branch': [
    { required: true, message: '请输入关联仓库分支', trigger: ['blur', 'change'] }
  ],
  'config.baseurl': [
    { required: true, message: '请输入关联仓库存储地址', trigger: ['blur', 'change'] }
  ],
  'config.access_token': [
    { required: true, message: '请输入关联仓库私人令牌token', trigger: ['blur', 'change'] }
  ]
})
const formRef = ref(null)
const loading = reactive({
  submit: false
})
/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
function submit () {
  formRef.value.validate(valid => {
    if (valid) {
      props.detail && props.detail.id ? updateWiki() : createWiki()
    }
  })
}
function updateWiki () {
  wiki.update({
    id: props.detail.id,
    ...form
  }).then(res => {
    showSuccessTip('更新成功')
  })
}
function createWiki () {
  wiki.create(form).then(res => {
    showSuccessTip('创建成功')
  })
}
function showSuccessTip (message: string) {
  ctx.$message({ message: message, duration: 1000, type: 'success' })
  handleClose()
  emit('submit')
}

watch(() => props.detail, (val) => {
  if (val) {
    Object.keys(form).forEach(key => {
      form[key] = props.detail[key]
    })
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.wiki-dialog {
  .wiki-form {
    overflow: hidden;
    .el-form-item {
      .el-form-item__label {
        margin-bottom: 3px !important;
      }
      &.last-form-item {
        margin-bottom: 0px !important;
        .el-form-item__content {
          justify-content: right;
        }
      }
    }
  }
  .wiki-inline {
    display: flex;
    &-item {
      flex: 1;
    }
    &-img {
      padding: 20px;
      background: #fafafa;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      svg {
        width: 100%;
      }
    }
    &-divider {
      width: 1px;
      background: #eee;
      margin: 0 20px;
    }
    &-name {
      margin-bottom: 5px;
      color: #333;
      font-size: 18px;
    }
    &-desc {
      margin-bottom: 15px;
      color: #999;
      line-height: 24px;
    }
    &-tip {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      color: #999;
      font-size: 16px;
      .el-icon {
        margin-right: 6px;
        color: #73d897;
      }
    }
  }
}
.wiki-status-popper {
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