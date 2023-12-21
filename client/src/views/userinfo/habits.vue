<template>
  <!-- 可以参考: https://gitlab.com/-/profile/preferences -->
  <div class="user-habits">
    <div class="user-habits-title">偏好设置</div>
    <el-form :model="detail.data" :rules="rules" :label-position="'top'" class="my-habits">
      <el-form-item prop="name">
        <!-- 
          :direction="'column'" -->
        <habit-collapse-item
          :title="'自定义链接格式'">
          <template #desc>
            <p>
              <span>用占位符<b> ${url} </b>来表示url的位置</span>
              <span>用占位符<b> ${filename} </b>来表示文件名。</span>
              <span>如：[${filename}](${url})</span>
            </p>
          </template>
          <el-input v-model="detail.data.link_format" placeholder="请输入用户名" style="width: 180px;" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'自定义链接格式'"
          :desc="'设定复制链接的格式'">
          <el-select v-model="detail.data.pasteStyle" style="width: 180px;">
            <el-option v-for="(item, index) in linkTypes" :key="index" :label="item.label" :value="item.id"/>
          </el-select>
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启上传提示'"
          :desc="'开启上传提示后，在图片上传成功后会提示“上传成功”'">
          <el-switch v-model="detail.data.showTip.upload" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启删除提示'"
          :desc="'开启删除提示后，在图片删除成功后会提示“删除成功”'">
          <el-switch v-model="detail.data.showTip.delete" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'开启复制提示'"
          :desc="'开启复制提示后，在图片链接复制成功后会提示“复制成功”'">
          <el-switch v-model="detail.data.showTip.copy" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'上传后自动复制url'"
          :desc="'开启上传自动复制后，在图片上传成功后会自动复制最后一张图片的链接，默认采用当前配置的“自定义链接格式”'">
          <el-switch v-model="detail.data.showTip.update" size="large" />
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'图片显示名称'"
          :desc="'目前系统中的图片有两个名称，其一是上传时的图片原名称，另一个则是上传时系统生成的时间名称'"
          :direction="'column'">
          <div class="tags">
            <div :class="{ 'tag-item': true, active: detail.data.gallery_img_name === 'origin_name' }" @click="handleGalleryName('origin_name')">
              <span class="tag-item-title">原名称</span>
              <span class="tag-item-desc">(微信图片_asd24asd8asda.png)</span>
            </div>
            <div :class="{ 'tag-item': true, active: detail.data.gallery_img_name === 'name' }" @click="handleGalleryName('name')">
              <span class="tag-item-title">时间名称</span>
              <span class="tag-item-desc">(202312181701049266.png)</span>
            </div>
          </div>
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'图片显示方式'"
          :desc="'配置图库中的图片和相册中的图片显示方式，即对应object-fit样式'"
          :direction="'column'">
          <div class="fit-list">
            <div
              v-for="(item, index) in fits"
              :key="'fit-' + index"
              :class="{
                'fit-item': true,
                active: detail.data.gallery_img_fit === item
              }"
              @click="handleFitClick(item, 'gallery_img_fit')">
              <img src="/images/gallery-fit.jpg" alt="" :class="{ 'fit-item-name': true, ['img-' + item]: true }">
              <p class="fit-item-name">{{ item }}</p>
            </div>
          </div>
        </habit-collapse-item>
      </el-form-item>
      <el-form-item prop="name">
        <habit-collapse-item
          :title="'相册封面显示方式'"
          :desc="'配置相册封面的显示方式，即对应object-fit样式'"
          :direction="'column'">
          <div class="fit-list">
            <div
              v-for="(item, index) in fits"
              :key="'fit-' + index"
              :class="{
                'fit-item': true,
                active: detail.data.album_cover_fit === item
              }"
              @click="handleFitClick(item, 'album_cover_fit')">
              <img src="/images/album-fit.jpg" alt="" :class="{ 'fit-item-name': true, ['img-' + item]: true }">
              <p class="fit-item-name">{{ item }}</p>
            </div>
          </div>
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
import { linkTypes, fits } from '@/global.config';

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
// 点击切换fit
function handleFitClick (payload: "fill" | "contain" | "cover" | "none" | "scale-down", key: 'gallery_img_fit' | 'album_cover_fit') {
  detail.data[key] = payload
}
// 点击切换模式
function handleGalleryName (payload: string) {
  detail.data.gallery_img_name = payload
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
      line-height: 28px;
    }
  }
  .fit-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 10px 0;
    .fit-item {
      box-shadow: 0 0 14px 3px #cbcbcb;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      width: 220px;
      cursor: pointer;
      img {
        width: 100%;
        height: 120px;
        border-radius: 6px 6px 0 0;
      }
      &.active {
        box-shadow: 0 0 14px 3px #409eff;
        .fit-item-name {
          color: #409eff;
          border-top-color: #409eff;
        }
      }
      &-name {
        width: 100%;
        border-top: 1px solid #ddd;
        text-align: center;
        color: #36465e;
      }
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
.tags {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  .tag-item {
    padding: 5px 20px;
    background: #f5f7f9;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    + .tag-item {
      margin-left: 15px;
    }
    &-title {
      font-size: 16px;
      color: #222;
    }
    &-desc {
      font-size: 14px;
      color: #777;
    }
    &.active {
      background: rgb(24, 144, 255);
      .tag-item-title {
        color: #fff;
      }
      .tag-item-desc {
        color: #e7e7e7;
      }
    }
  }
}
</style>