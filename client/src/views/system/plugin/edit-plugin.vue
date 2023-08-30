<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑插件' : '新建插件'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :label-position="'left'" class="plugin-form">
      <el-form-item label="插件名称" prop="name">
        <el-input v-model="form.name" size="large">
          <template #append>
            <el-button @click="getPackage" :loading="loading.pkg">插件信息</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="插件别名" prop="title">
        <el-input v-model="form.title" size="large" />
      </el-form-item>
      <template v-if="form.category">
        <el-form-item label="插件类别" prop="category">
          <el-select v-model="form.category" size="large" disabled style="width: 100%;">
            <el-option
              v-for="(item, index) in plugin_types.plugin_type"
              :key="'type-' + index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="插件版本" prop="version">
          <el-select v-model="form.version" size="large" style="width: 100%;">
            <el-option
              v-for="(item, index) in version"
              :key="'version-' + index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="插件描述" prop="description">
          <el-input type="textarea" rows="3" v-model="form.description" size="large" />
        </el-form-item>
        <el-form-item label="运行环境" prop="platform">
          <el-select v-model="form.platform" size="large" style="width: 100%;">
            <el-option
              v-for="(item, index) in plugin_types.plugin_env"
              :key="'env-' + index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="是否付费" prop="payment">
        <el-switch v-model="form.payment" />
      </el-form-item>
      <template v-if="form.payment">
        <el-form-item label="付费版本" prop="payment_type">
          <el-select v-model="form.payment_type" size="large" style="width: 100%;">
            <el-option
              v-for="(item, index) in plugin_types.plugin_payment_type"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number v-model="form.price" :precision="2" :min="0" />
        </el-form-item>
      </template>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading.submit" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { PluginInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import { useCtxInstance } from '@/hooks/global';
import { npmRegistry } from '@/global.config'
import axios from 'axios'
import useConfigStore from "@/store/config"
import Plugin from '@/types/Plugin';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: PluginInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as PluginInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const ctx = useCtxInstance()
const plugin = new Plugin()
const configStore = useConfigStore()

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
const form: PluginInter = reactive({
  name: '',
  title: '',
  version: '',
  logo: '',
  description: '',
  author: '',
  category: '',
  platform: '',
  status: false,
  payment: false,
  payment_type: 'free',
  price: 0
})
const rules = reactive({
  name: [
    { required: true, message: '请输入插件名称', trigger: ['blur', 'change'] }
  ],
  title: [
    { required: true, message: '请输入插件别名', trigger: ['blur', 'change'] }
  ],
  platform: [
    { required: true, message: '请选择运行环境', trigger: ['blur', 'change'] }
  ]
})
const formRef = ref(null)
const version: Ref<string[]> = ref([])
const pkgInfo: Ref<any> = ref()
const plugin_types = computed(() => {
  return {
    plugin_type: configStore.dicts.find(el => el.code === 'plugin_type').values || [],
    plugin_env: configStore.dicts.find(el => el.code === 'plugin_env').values || [],
    plugin_payment_type: configStore.dicts.find(el => el.code === 'plugin_payment_type').values || []
  }
})
const loading = reactive({
  pkg: false,
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
      loading.submit = true
      if (form.id) {
        plugin.update(form).then(res => {
          ctx.$message({ message: '更新成功', duration: 1000, type: 'success' })
          loading.submit = false
          handleClose()
          emit('submit')
        })
      } else {
        plugin.create(form).then(res => {
          ctx.$message({ message: '创建功', duration: 1000, type: 'success' })
          loading.submit = false
          handleClose()
          emit('submit')
        })
      }
    }
  })
}
// 获取插件信息
function getPackage () {
  if (!pkgInfo.value) {
    loading.pkg = true
    axios({
      method: 'get',
      url: `${npmRegistry}/${form.name}` + `?time=` + Math.random() 
    }).then(res => {
      pkgInfo.value = res.data
      const { 'dist-tags': distTags, versions } = res.data
      version.value = Object.keys(versions).reverse()
      const lastVersion = distTags.latest
      form.version = lastVersion
      loading.pkg = false
    })
  }
}
function getInfoByVersion (version: string) {
  const { author, description, logo, keywords, category } = pkgInfo.value.versions[version]
  form.author = author.name
  form.description = description
  form.version = version
  form.category = category || 'uploader'
  form.logo = logo || 'https://himg.bdimg.com/sys/portrait/item/public.1.1f2977ac.EaP-d0ojVIWjmGyxrZ326Q.jpg'
}

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
watch(() => form.version, (val) => {
  getInfoByVersion(val)
})
</script>

<style lang="scss">
.inline-item {
  flex-direction: column;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.plugin-form {
  overflow: hidden;
}
</style>