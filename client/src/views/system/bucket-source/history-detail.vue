<template>
  <div class="history-detail">
    <el-page-header @back="handleClose">
      <template #content>
        <span class="page-title">{{ detail.remark }}</span>
      </template>
      <div class="page-desc">更新于 {{ detail.updatedAt }}</div>
      <template #extra>
        <div class="page-action">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">回 滚</el-button>
        </div>
      </template>
    </el-page-header>
    <el-form v-loading="loading" ref="formRef" :model="bucket_source" label-width="auto" :label-position="'left'" class="dict-form">
      <el-form-item prop="config" label="差异对比" class="inline-item">
        <p><b>注意：</b>左侧是旧数据，右侧时新数据</p>
        <monaco-editor
          v-if="!loading"
          :value="detail.config"
          :old-value="detail.config_old"
          language="javascript"></monaco-editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { BucketSourceHistoryInter, BucketSourceInter, DictInter } from '@/typings/interface';
import { reactive, ref } from 'vue';
import monacoEditor from '@/components/editor/diff-editor.vue'
import { useRoute, useRouter } from 'vue-router';
import Dict from '@/types/Dict';
import BucketSource from '@/types/BucketSource';
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import BucketSourceHistory from '@/types/BucketSourceHistory';
import { useFormat } from '@/hooks/date-time';

/**
 * 实例
 */
const route = useRoute()
const router = useRouter()
const bucketSource = new BucketSource()
const bucketSourceHistory = new BucketSourceHistory()
const ctx = useCtxInstance()


/**
 * 变量
 */
// 存储桶详情
const bucket_source: BucketSourceInter = reactive({
  id: route.query.id as string || '',
  name: '',
  type: '',
  config: '',
  remark: '',
  version: '1.0.0'
})
// 历史详情
const detail: BucketSourceHistoryInter = reactive({
  id: route.query.id as string,
  version: '',
  version_old: '',
  config: '',
  config_old: '',
  updatedAt: '',
  remark: ''
})
const formRef = ref(null)
const loading = ref(false)


/**
 * 逻辑获取
 */
// 获取详情
const getDetail = () => {
  loading.value = true
  bucketSourceHistory.detail(detail.id).then((res: BucketSourceHistoryInter) => {
    detail.version = res.version
    detail.version_old = res.version_old
    detail.config = res.config
    detail.config_old = res.config_old
    detail.updatedAt = useFormat(res.updatedAt)
    detail.remark = res.remark
    loading.value = false
  })
}
if (detail.id) {
  getDetail()
}
// 提交
const submit = () => {
  useDeleteConfirm('确定要回滚到当前节点吗？').then(() => {
    bucketSource.rollback(detail.id, route.query.bs_id as string).then(res => {
      ctx.$message({ message: '版本回退成功', duration: 1000, type: 'success' })
      handleClose()
    })
  })
}
// 关闭窗口
const handleClose = () => {
  router.go(-1)
}
</script>

<style lang="scss">
.history-detail {
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
    // margin-bottom: 20px;
    flex-shrink: 0;
    .el-page-header__main {
      border-top: 1px solid #e4e7ed;
      margin-top: 10px;
    }
    .page-title {
      font-weight: 600;
    }
    .page-desc {
      padding-top: 10px;
      line-height: 20px;
      // font-weight: bold;
      font-size: 14px;
      color: rgb(95, 99, 104);
    }
  }
  .el-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-form-item {
      flex-shrink: 0;
      .el-form-item__label {
        font-weight: bold;
      }
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
}
</style>