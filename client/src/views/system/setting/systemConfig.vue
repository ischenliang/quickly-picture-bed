<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'上传配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="system.accept" label="可选文件类型">
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
          <el-form-item prop="system.maxsize" label="单文件最大容量(MB)">
            <el-input-number v-model="myForm.system.maxsize" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="system.maxcount" label="单次最多上传文件数量">
            <el-input-number v-model="myForm.system.maxcount" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="system.storage_size" label="存储桶容量限制(MB)">
            <el-input-number v-model="myForm.system.storage_size" :min="1" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="system.storage_count" label="存储桶数量限制">
            <el-input-number v-model="myForm.system.storage_count" :min="1" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'图标配置(存储桶类型等图标)'">
      <el-row>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="name" label="图标url">
            <el-input v-model="myForm.system.icon_url" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="name" label="图标前缀(FontClass)">
            <el-input v-model="myForm.system.icon_prefix" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="name" label="图标字体Font Family">
            <el-input v-model="myForm.system.icon_font" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'ip定位服务和邮件服务配置'">
      <el-row>
        <el-col :xl="12" :lg="8" :md="12">
          <el-form-item prop="map_type" label="启用服务类型">
            <el-select v-model="myForm.system.map_type" placeholder="请选择服务类型" size="large">
              <el-option :label="'高德地图'" :value="'gaode'"></el-option>
              <el-option :label="'百度地图'" :value="'baidu'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="8" :md="12">
          <el-form-item prop="map_key" label="开发者密钥">
            <el-input v-model="myForm.system.map_key" placeholder="请输入开放者秘钥" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="8" :md="12">
          <el-form-item prop="mail_user" label="收件人邮箱">
            <el-input v-model="myForm.system.mail_user" placeholder="请输入收件人邮箱" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="8" :md="12">
          <el-form-item prop="mail_pass" label="邮箱授权码">
            <el-input v-model="myForm.system.mail_pass" placeholder="请输入邮箱授权码" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'菜单配置'">
      <p style="line-height: 22px;color: #666;margin-bottom: 5px;">对右上角的菜单和链接配置</p>
      <monaco-editor v-model="myForm.bucket_service_str"></monaco-editor>
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