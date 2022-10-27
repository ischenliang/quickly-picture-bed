<template>
  <div>
    <c-card :title="'使用习惯设置'">
      <el-form :model="detail.data" :rules="rules" :label-position="'top'" class="my-habits">
        <el-row>
          <el-col :xl="24">
            <el-form-item label="自定义链接格式" prop="name">
              <p style="width: 100%;line-height: 20px;font-size: 12px;color: #999;">
                <span>用占位符<b> ${url} </b>来表示url的位置</span>
                <span>用占位符<b> ${filename} </b>来表示文件名</span>
              </p>
              <p style="width: 100%;line-height: 20px;font-size: 12px;color: #999;">如：[$filename]($url)</p>
              <el-input v-model="detail.data.link_format" placeholder="请输入用户名" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="默认复制图片链接类型" prop="name">
              <el-select v-model="detail.data.pasteStyle" size="large" style="width: 100%;">
                <el-option label="URL" value="url"/>
                <el-option label="HTML" value="html"/>
                <el-option label="Markdown" value="markdown"/>
                <el-option label="CSS" value="css"/>
                <el-option label="BBCode" value="bbcode"/>
                <el-option label="UBB" value="ubb"/>
                <el-option label="自定义" value="custom"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="3">
            <el-form-item label="开启上传提示" prop="name">
              <el-switch v-model="detail.data.showUpdateTip" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xl="21">
            <el-form-item label="开启删除提示" prop="name">
              <el-switch v-model="detail.data.showDeleteTip" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xl="3">
            <el-form-item label="开启复制提示" prop="name">
              <el-switch v-model="detail.data.showCopyTip" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xl="21">
            <el-form-item label="上传后自动复制url" prop="name">
              <el-switch v-model="detail.data.autoPaste" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="快捷键设置" prop="name">
              <!-- <el-input v-model="detail.data.link_format" placeholder="请输入用户名" size="large" /> -->
              <el-table
                border
                :data="detail.data.shortKey"
                @row-click="handleRowClick">
                <el-table-column prop="key" label="快捷键名称" align="left" />
                <el-table-column prop="value" label="快捷键绑定" align="left" />
                <el-table-column prop="label" label="快捷键描述" align="left" />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="">
          <el-button type="primary" size="large" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </c-card>
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
    showUpdateTip: true,
    showDeleteTip: true,
    showCopyTip: true,
    autoPaste: true,
    current: {},
    link_format: '![]($url)',
    pasteStyle: 'url',
  }
})
const rules = []
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
  .el-form-item__label {
    font-weight: bold;
    font-size: 15px;
  }
  .el-table thead th.el-table__cell {
    background-color: rgb(244, 246, 249);
    color: black;
  }
}
</style>