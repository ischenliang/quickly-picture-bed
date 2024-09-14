<template>
  <div class="bucket-source-plugin">
    <div class="plugin-header">
    <el-page-header @back="handleClose">
      <template #content>
        <span class="page-title">{{ form.id ? '编辑存储桶插件' : '创建存储桶插件' }}</span>
      </template>
      <div class="page-desc">
        你可以在这里更新存储桶插件内容.....
      </div>
      <template #extra>
        <div class="plugin-page-action">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </template>
    </el-page-header>
    </div>
    <el-form v-loading="loading" ref="formRef" :model="form" :rules="rules" label-width="auto" :label-position="'left'" class="dict-form">
      <el-form-item label="插件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入插件名称" size="large" />
      </el-form-item>
      <el-row>
        <el-col :xl="12" :lg="12" :md="12">
          <el-form-item label="存储源类别" prop="type">
            <el-select v-model="form.type" size="large" filterable style="width: 100%">
              <el-option
                v-for="(item, index) in bucketTypes"
                :key="'item-' + index"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12">
          <el-form-item label="插件版本" prop="name">
            <el-input v-model="form.version" placeholder="请输入版本号" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="更新备注" prop="remark" v-if="form.id !== ''">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入插件更新说明" size="large" />
      </el-form-item>
      <el-form-item prop="config" label="存储源配置" class="inline-item">
        <p><b>注意：</b>请务必严格按照给定的格式返回，否则会导致插件无法使用</p>
        <monaco-editor v-if="!loading" v-model="form.config" language="javascript"></monaco-editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { BucketSourceInter, DictInter } from '@/typings/interface';
import { reactive, ref } from 'vue';
import monacoEditor from '@/components/editor/index.vue'
import { useRoute, useRouter } from 'vue-router';
import Dict from '@/types/Dict';
import BucketSource from '@/types/BucketSource';
import { useCtxInstance } from '@/hooks/global';
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const route = useRoute()
const router = useRouter()
const bucketSource = new BucketSource()
const configStore = useConfigStore()
const ctx = useCtxInstance()


/**
 * 变量
 */
const form: BucketSourceInter = reactive({
  id: route.query.id as string || '',
  name: '',
  type: '',
  config: configStore.systemConfig.plugin.default,
  remark: '',
  version: '1.0.0'
})
const rules = reactive({
  name: [
    { required: true, message: '请输入存储源名称', trigger: ['blur'] }
  ],
  type: [
    { required: true, message: '请选择存储源类型', trigger: ['blur', 'change'] }
  ],
  config: [
    { required: true, message: '请输入存储源配置', trigger: ['blur'] }
  ],
  remark: [
    { required: true, message: '请输入更新说明', trigger: ['blur'] }
  ]
})
const formRef = ref(null)
// 存储源类别
const bucketTypes = ref([])
const loading = ref(false)


/**
 * 逻辑获取
 */
// 获取详情
const getDetail = () => {
  loading.value = true
  bucketSource.detail(form.id).then((res: BucketSourceInter) => {
    form.name = res.name
    form.type = res.type
    form.config = res.config
    form.version = res.version
    loading.value = false
  })
}
if (form.id) {
  getDetail()
}
// 获取存储源类别列表
const getDict = () => {
  const dict = new Dict()
  dict.detailByPro('code', 'bucket_source').then((res: DictInter) => {
    if (res) {
      bucketTypes.value = res.values
    }
  })
}
getDict()
// 提交
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const tmp = {
        name: form.name,
        type: form.type,
        config: form.config,
        remark: form.remark,
        version: form.version
      }
      if (form.id) {
        bucketSource.update({
          id: form.id,
          ...tmp
        }).then(res => {
          ctx.$message({ message: '更新成功', type: 'success', duration: 1000 })
          router.push({
            name: 'SystemBucketSource'
          })
        })
      } else {
        bucketSource.create(tmp).then(res => {
          ctx.$message({ message: '创建成功', type: 'success', duration: 1000 })
          router.push({
            name: 'SystemBucketSource'
          })
        })
      }
    }
  })
}
// 关闭窗口
const handleClose = () => {
  router.go(-1)
}
</script>

<style lang="scss">
.bucket-source-plugin {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  padding: 0 20px 0 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .el-page-header {
    width: 100%;
    margin-bottom: 20px;
    flex-shrink: 0;
    .el-page-header__main {
      border-top: 1px solid #e4e7ed;
      margin-top: 10px;
      .page-desc {
        padding-top: 10px;
        line-height: 20px;
        // font-weight: bold;
        font-size: 14px;
        color: rgb(95, 99, 104);
      }
    }
    .plugin-page-action {
      font-weight: 600;
    }
  }
  .el-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-form-item {
      flex-shrink: 0;
    }
    .inline-item {
      flex: 1;
      flex-direction: column;
      .el-form-item__content {
        margin-left: 0 !important;
        flex: 1;
        p {
          line-height: 22px !important;
          font-size: 12px;
          color: #555;
        }
        #monaco {
          height: calc(100% - 22px) !important;
        }
      }
    }
  }
  .el-row {
    @media only screen and (max-width: 992px) {
      .el-col-24 {
        padding: 0px !important;
      }
    }
    .el-col {
      &:last-child {
        padding-left: 15px;
      }
      &:first-child {
        padding-right: 15px;
      }
    }
  }
}
</style>