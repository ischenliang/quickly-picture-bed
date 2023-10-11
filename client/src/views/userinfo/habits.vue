<template>
  <!-- 可以参考: https://gitlab.com/-/profile/preferences -->
  <div class="user-habits">
    <div class="user-habits-title">偏好设置</div>
    <el-form :model="detail.data" :rules="rules" :label-position="'top'" class="my-habits">
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'自定义链接格式'"
          :direction="'column'">
          <template #desc>
            <p>
              <span>用占位符<b> ${url} </b>来表示url的位置</span>
              <span>用占位符<b> ${filename} </b>来表示文件名。</span>
              <span>如：[${filename}](${url})</span>
            </p>
          </template>
          <el-input v-model="detail.data.link_format" placeholder="请输入用户名" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'自定义链接格式'"
          :direction="'column'"
          :desc="'设定复制链接的格式'">
          <el-select v-model="detail.data.pasteStyle" size="large" style="width: 100%;">
            <el-option v-for="(item, index) in linkTypes" :key="index" :label="item.label" :value="item.id"/>
          </el-select>
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启上传提示'"
          :desc="'选中回答或文章中的语句后可方便地「摘录到百科」'">
          <el-switch v-model="detail.data.showTip.upload" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启删除提示'"
          :desc="'选中回答或文章中的语句后可方便地「摘录到百科」'">
          <el-switch v-model="detail.data.showTip.delete" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启复制提示'"
          :desc="'选中回答或文章中的语句后可方便地「摘录到百科」'">
          <el-switch v-model="detail.data.showTip.copy" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'上传后自动复制url'"
          :desc="'选中回答或文章中的语句后可方便地「摘录到百科」'">
          <el-switch v-model="detail.data.showTip.update" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'快捷键设置'"
          :direction="'column'"
          :border="false"
          :desc="'选中回答或文章中的语句后可方便地「摘录到百科」'">
          <el-table
            border
            :data="detail.data.shortKey"
            @row-click="handleRowClick">
            <el-table-column prop="key" label="快捷键名称" align="left" />
            <el-table-column prop="value" label="快捷键绑定" align="left" />
            <el-table-column prop="label" label="快捷键描述" align="left" />
          </el-table>
        </habit-collapse-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
    <habits-dialog
        v-if="visible"
        v-model="visible"
        :detail="item.data"
      @submit="handleSubmit"></habits-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import useUserStore from '@/store/user';
import Habits from '@/types/Habits';
import { HabitsInter } from '@/typings/interface';
import { reactive, ref } from 'vue';
import HabitsDialog from './habits-dialog.vue'
import habitCollapseItem from './habit-collapse-item.vue';
import { linkTypes } from '@/global.config';

/**
 * 实例
 */
const habits = new Habits()
const ctx = useCtxInstance()
const userStore = useUserStore()

/**
 * 变量
 */
const detail: { data: HabitsInter } = reactive({
  data: {
    shortKey: [
        {
          "label": "点击快捷键自动上传粘贴板中的图片",
          "value": "Command + K",
          "key": "快捷上传",
          "id": 1
        },
        {
          "label": "点击快捷键自动打开帮助中心窗口",
          "value": "Command + H",
          "key": "帮助中心",
          "id": 2
        },
        {
          "label": "点击快捷键自动进入个人中心",
          "value": "Command + P + C",
          "key": "个人中心",
          "id": 3
        },
        {
          "label": "点击快捷键自动上传粘贴板中的网络图片",
          "value": "Command + P + C",
          "key": "上传网络图片",
          "id": 4
        },
        {
          "label": "点击快捷键自动退出登录",
          "value": "Command + P + C",
          "key": "快捷退出",
          "id": 5
        }
    ],
    showTip: {
      copy: true,
      delete: true,
      update: true,
      upload: true
    },
    autoPaste: true,
    current: {},
    link_format: '![]($url)',
    pasteStyle: 'url',
  }
})
const rules: any = []
const visible = ref(false)
const item = reactive({
  data: {}
})

/**
 * 数据获取
 */
const getDetail = () => {
  habits.detail().then((res: HabitsInter) => {
    if (res.id) {
      detail.data = res
    }
  })
}
getDetail()


/**
 * 逻辑处理
 */
const handleRowClick = (row, column, event) => {
  item.data = row
  visible.value = true
}
const handleSubmit = (e) => {
  detail.data.shortKey.forEach(item => {
    if (item.id === e.id) {
      item.value = e.value
    }
  })
}
const submit = () => {
  habits.save(detail.data).then(res => {
    userStore.updateUserHabits(detail.data)
    ctx.$message({
      message: '保存成功',
      type: 'success',
      duration: 1000
    })
  })
}
</script>

<style lang="scss">
.my-habits {
  .el-table thead th.el-table__cell {
    background-color: rgb(244, 246, 249);
    color: black;
  }
  .el-form-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 5px !important;
    &__label {
      display: none;
    }
    &__content {
    }
  }
}
.user-habits-title {
  margin-bottom: 30px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
</style>