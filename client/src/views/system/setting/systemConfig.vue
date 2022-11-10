<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'上传配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="title" label="可选文件类型">
            <el-select
              v-model="myForm.system.accept"
              multiple
              filterable
              size="large"
              collapse-tags
              placeholder="请选择可选文件类型">
              <el-option v-for="item in options" :key="item.label + item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="subtitle" label="单文件最大容量(MB)">
            <el-input-number v-model="myForm.system.maxsize" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="desc" label="单次最多上传文件数量">
            <el-input-number v-model="myForm.system.maxcount" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶容量限制(MB)">
            <el-input-number v-model="myForm.system.storage_size" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶数量限制">
            <el-input v-model="myForm.system.storage_count" placeholder="请输入网站名称" size="large">
              <template #append>.com</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'图标配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="图标url">
            <el-input v-model="myForm.system.icon_url" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="图标前缀(FontClass)">
            <el-input v-model="myForm.system.icon_prefix" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="图标字体Font Family">
            <el-input v-model="myForm.system.icon_font" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'菜单配置'">
      <p style="line-height: 22px;color: #666;margin-bottom: 5px;">对右上角的菜单和链接配置</p>
      <monaco-editor v-model="myForm.bucket_service"></monaco-editor>
    </c-card>

    <c-card :title="'版权信息'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_company" label="版权归属公司">
            <el-input v-model="myForm.system.copyright_company" placeholder="请输入版权归属公司" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_time" label="运营时间段">
            <el-input v-model="myForm.system.copyright_time" placeholder="请输入运营时间段" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_miitbeian" label="工信备案号">
            <el-input v-model="myForm.system.copyright_miitbeian" placeholder="请输入工信部备案号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_miiturl" label="备案地址">
            <el-input v-model="myForm.system.copyright_miiturl" placeholder="请输入工信部备案地址" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
  </el-form>
</template>

<script lang="ts" setup>
import { SettingInter } from '@/typings/interface';
import { computed, reactive, ref } from 'vue';
import config from './config'
import { mimeTypes } from '@/global.config'
import monacoEditor from '@/components/editor/index.vue'

/**
 * 实例
 */
const props = withDefaults(defineProps<{
  data: SettingInter
}>(), {
  data: () => ({
    ...config
  })
})
const emit = defineEmits(['update:data'])

/**
 * 变量
 */
const formRef = ref()
const rules = reactive({
  logo: [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ]
})
const options = computed(() => {
  let tmp = []
  for (let key in mimeTypes) {
    tmp.push({ label: mimeTypes[key], value: key })
  }
  return tmp
})
const myForm = computed({
  get: () => props.data,
  set: (val) => {
    emit('update:data', val)
  }
})
</script>

<style lang="scss" scoped>
</style>