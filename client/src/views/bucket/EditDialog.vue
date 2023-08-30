<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑存储桶' : '新建存储桶'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" label-width="auto" :label-position="'left'" class="dict-form">
      <el-form-item
        label="存储桶插件"
        prop="user_plugin_id"
        :rules="[
          { required: true, message: '请选择存储桶插件', trigger: ['blur', 'change'] }
        ]">
        <p class="bucket-tips" style="color: red;">* 添加成功后不可修改</p>
        <el-select v-model="form.user_plugin_id" style="width: 100%" filterable size="large" :disabled="form.id ? true : false">
          <el-option
            v-for="(item, index) in bucketPlugins"
            :key="index"
            :label="item.plugin.title"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="存储桶名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入存储桶名称', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="form.name" size="large" placeholder="请输入存储桶名称" />
      </el-form-item>
      <el-tabs v-if="form.user_plugin_id" v-model="activeName" class="bucket-tabs">
        <el-tab-pane label="存储桶配置" name="config">
          <template v-for="(item, index) in bucketConfigs" :key="'form-item' + form.user_plugin_id + index">
            <el-form-item
              v-if="!item.hidden"
              :label="item.label"
              :prop="item.field"
              :rules="[generateRules(item)]">
              <el-select v-if="item.type === 'option'" filterable v-model="item.default" size="large" style="width: 100%" :placeholder="item.placeholder" :disabled="item.disabled">
                <el-option
                  v-for="(option, index) in item.options"
                  :key="'item-' + index"
                  :label="option.label"
                  :value="option.value"/>
              </el-select>
              <el-input
                v-else-if="item.type === 'password'"
                v-model="item.default"
                size="large"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                show-password />
              <!-- 开关类型 -->
              <el-switch
                v-else-if="item.type === 'choice'"
                v-model="item.default"
                size="large"
                :active-text="item.choices.active.label"
                :active-value="item.choices.active.value"
                :inactive-text="item.choices.inactive.label"
                :inactive-value="item.choices.inactive.value" />
              <el-input v-else v-model="item.default" size="large" :placeholder="item.placeholder" :disabled="item.disabled" />
              <p class="bucket-tips" v-if="item.tips" v-html="item.tips"></p>
            </el-form-item>
          </template>
        </el-tab-pane>
        <el-tab-pane label="插件介绍" name="intro">
          <plugin-readme
            v-if="activeName === 'intro'"
            :plugin_name="current_plugin.plugin.name"
            :plugin_version="current_plugin.version">
          </plugin-readme>
        </el-tab-pane>
        <el-tab-pane label="更新日志" name="uplog">
          <plugin-uplog
            v-if="activeName === 'uplog'"
            :plugin_name="current_plugin.plugin.name"
            :plugin_version="current_plugin.version">
          </plugin-uplog>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { BucketInter, BucketSourceConfig, UserPluginInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import { PageResponse } from '@/typings/req-res';
import Bucket from '@/types/Bucket';
import { useCtxInstance} from '@/hooks/global';
import Plugin from '@/types/Plugin';
import { PluginLoadUrl } from '@/global.config'
import pluginReadme from './plugin-readme.vue';
import pluginUplog from './plugin-uplog.vue'

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: BucketInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as BucketInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const bucket = new Bucket()
const ctx = useCtxInstance()
const plugin = new Plugin()


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
const form: BucketInter = reactive({
  name: '',
  config: {},
  visible: true,
  user_plugin_id: ''
})
// 表单ref
const formRef = ref(null)
// 存储源
const bucketPlugins: Ref<UserPluginInter[]> = ref([])
// 存储源配置
const bucketConfigs: Ref<BucketSourceConfig[]> = ref([])
const activeName = ref('config')
// 当前插件
const current_plugin: Ref<UserPluginInter> = ref()

/**
 * 数据获取
 */
const getInstallPlugins = () => {
  plugin.installed({ status: true }).then((res: PageResponse<UserPluginInter>) => {
    bucketPlugins.value = res.items
    if (form.user_plugin_id) {
      handleData(form.user_plugin_id)
    }
  })
}
getInstallPlugins()


// 校验表单项
const validateForItem = (data, rule, value, callback) => {
  if (!data.default) {
   return callback(`请输入${data.field}`)
  }
  return callback()
}
// 生成校验规则
const generateRules = (item) => {
  if (item.required) {
    return {
      required: item.required,
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        validateForItem(item, rule, value, callback)
      }
    }
  }
  return '' // 不能直接返回null，会导致该项无法渲染 
}


/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let obj = {}
      bucketConfigs.value.forEach(item => {
        obj[item.field] = item.default
      })
      const tmp = {
        name: form.name,
        user_plugin_id: form.user_plugin_id,
        config: obj
      }
      if (form.id) {
        itemUpdate({ id: form.id, ...tmp })
      } else {
        itemCreate(tmp)
      }
    }
  })
}
// 创建
const itemCreate = (data) => {
  bucket.create(data).then(res => {
    handleClose()
    emit('submit')
    ctx.$message({ message: '新建成功', duration: 1000, type: 'success' })
  })
}
// 更新
const itemUpdate = (data: BucketInter) => {
  bucket.update(data).then(async res => {
    handleClose()
    emit('submit')
    ctx.$message({ message: '更新成功', duration: 1000, type: 'success' })
    // 更新完存储桶同时更新当前高亮存储桶
  })
}
// 处理数据
const handleData = (user_plugin_id: number | string) => {
  current_plugin.value = bucketPlugins.value.find(el => el.id === user_plugin_id)
  if (current_plugin.value) {
    // 这里需要使用用户安装的插件
    const { plugin: {name}, version } = current_plugin.value
    // 动态加载模块：添加随机数，避免模块不重复加载
    const url = `${PluginLoadUrl}${name}@${version}`
    import(/* @vite-ignore */url + `?time=` + Math.random())
      .then((res: { default }) => {
        bucketConfigs.value = res.default.config.map((el: BucketSourceConfig) => {
          if (form.config) {
            if (form.config[el.field] && !el.hidden) {
              el.default = form.config[el.field]
            }
          }
          return el
        })
      })
  }
}

/**
 * 监听器
 */
watch(() => form.user_plugin_id, (val) => {
  if (bucketPlugins.value.length) {
    handleData(val)
  }
})
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
.inline-item {
  flex-direction: column;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.dict-form {
  overflow: hidden;
  .bucket-tips {
    font-size: 12px;
    color: #898989;
    line-height: 18px;
    .doc_link {
      line-height: 22px;
    }
  }
}
.bucket-tabs {
  .el-tabs__nav-wrap {
    display: flex;
    justify-content: center;
  }
  .markdown-body {
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    color: #24292f;
    overflow: hidden !important;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    h1:first-of-type {
      margin-top: 0;
    }
    p {
      margin-bottom: 16px;
      margin-top: 0 !important;
    }
    pre>code {
      padding: 20px 12px 15px !important;
    }
    > *:last-child {
      margin-bottom: 0!important;
    }
    ol {
      list-style-type: decimal;
      padding-left: 2em;
    }
    .code-block-wrapper {
      position: relative;
      .code-block-header {
        position: absolute;
        top: 0px;
        right: 0px;
        color: #b3b3b3;
        font-size: 12px;
        user-select: none;
        span {
          margin-right: 8px;
          cursor: pointer;
          &.code-block-header__copy:hover {
            color: #18a058;
          }
        }
      }
    }
  }
  .el-tabs__content {
    padding: 0 30px;
  }
}
</style>