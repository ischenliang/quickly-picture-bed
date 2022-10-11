<template>
  <div class="home-container">
    <div class="home-title">让存储变得简单有效</div>
    <div class="home-tips">
      <span>图片最大支持 10.00 MB</span>
      <span>最多支持同时上传 10 张</span>  
    </div>
    <!-- 选择存储桶 -->
    <el-card>
      <div class="bucket-title">选择存储桶</div>
      <div class="bucket-list">
        <el-tag size="large" type="info" effect="dark">七牛云</el-tag>
        <el-tag size="large" type="info">码云</el-tag>
        <el-tag size="large" type="info">Github</el-tag>
        <el-tag size="large" type="info">本地存储桶</el-tag>
        <el-tag size="large" type="info">leancloud</el-tag>
      </div>
    </el-card>

    <!-- 上传区域 -->
    <el-card class="custom-card">
      <el-upload
        class="upload"
        drag
        :show-file-list="false"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          点击上传图片，支持拖拽上传
        </div>
        <template #tip>
          <div class="el-upload__tip">
            大小不超过10MB的png, jpg, gif文件
          </div>
        </template>
      </el-upload>
      <div class="quick-entry">
        <div class="entry-title">快捷上传</div>
        <div class="entry-list">
          <el-button type="primary">剪切板图片</el-button>
          <el-button type="primary" @click="handleClick">网络图URL</el-button>
          <!-- 将此元素隐藏起来，方便后续上传成功后自动复制 -->
          <el-button type="primary" id="btn" style="visibility: hidden;">自动复制</el-button>
        </div>
      </div>
    </el-card>

    <!-- 复制和历史记录 -->
    <div class="copy-history">
      <el-card>
        <div class="bucket-title">链接格式</div>
        <el-tabs v-model="activeLinkType" type="border-card">
          <el-tab-pane
            v-for="(item, index) in linkTypes"
            :key="'linkType-' + index"
            :label="item.label"
            :name="item.label">
            <div
              class="links-copy"
              id="link-copy"
              :data-clipboard-text="getLinkValue(item)"
              data-clipboard-action="copy"
              @click="copyLink('#link-copy')">
              {{ getLinkValue(item) }}
              <span class="link-copy-btn"><el-icon><CopyDocument /></el-icon></span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card>
        <div class="bucket-title">上传记录</div>
        <div class="history-list">
          <log-item v-for="(item, index) in logs" :key="index" :log="item"></log-item>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Clipboard from 'clipboard'
import { computed, onMounted, Ref, ref } from "vue";
import LogItem from '@/components/web/log/item.vue'
import { ImageInter, LogInter } from "@/typings/interface";
import { useCtxInstance } from '@/hooks/global';
interface Link {
  label: string
  value: string
}
/**
 * 实例
 */
const ctx = useCtxInstance()

/**
 * 变量
 */
// 当前高亮的链接类型
const activeLinkType = ref('URL')
const computedLinkType = computed(() => {
  return linkTypes.value.find(item => item.label === activeLinkType.value)
})
// 链接类型列表
// 占位符$url：表示图片的url地址
// 占位符$filename：表示文件名
const linkTypes: Ref<Link[]> = ref([
  { label: 'URL', value: '${url}' },
  { label: 'HTML', value: '<img src="${url}" alt="${filename}">' },
  { label: 'CSS', value: 'background: url("${url}") no-repeat;background-size: 100% 100%;' },
  { label: 'Markdown', value: '![${filename}](${url})' },
  { label: 'BBCode', value: '[img]${url}[/img]' },
  { label: 'UBB', value: '[IMG]${url}[/IMG]' },
  { label: 'custom', value: '[${filename}](${url})' }
])
// 日志列表
const logs: Ref<LogInter[]> = ref([
  {
    id: 'asdas2d42asd',
    type: 1,
    operate_id: 'ID:2366',
    operate_cont: '509036ffc9a69659.png',
    content: '上传了图片',
    createdAt: '2022-10-11 10:47:25'
  },
  {
    id: 'asdas2d42asd',
    type: 2,
    operate_id: '四川省成都市',
    operate_cont: '172.168.110.234',
    content: '登录了系统',
    createdAt: '2022-10-10 22:48:24'
  },
  {
    id: 'asdas2d42asd',
    type: 1,
    operate_id: 'ID:2366',
    operate_cont: '509036ffc9a69659.png',
    content: '上传了图片',
    createdAt: '2022-10-11 10:47:25'
  }
])
// 当前上传图片
const current: Ref<ImageInter> = ref({
  id: 'abcd',
  img_url: 'http://img.itchenliang.club/img/509036ffc9a69659.png',
  img_size: 200,
  img_height: 600,
  img_width: 400,
  img_name: '509036ffc9a69659.png'
})

/**
 * 逻辑处理
 */
// 获取指定类型的链接地址
const getLinkValue = (item: Link) => {
  let tmp = item.value.replace(/\$\{url\}/g, current.value.img_url)
  tmp = tmp.replace(/\$\{filename\}/, current.value.img_name)
  // return item.value.replace(/\$\{url\}/g, current.value.img_url).replace(/\$\{filename\}/, current.value.img_name)
  return tmp
}
// 复制链接
const copyLink = (selector) => {
  const clipboard = new Clipboard(selector)
  clipboard.on('success', (e) => {
    ctx.$message({ type: 'success', message: '复制成功', duration: 1000 })
    clipboard.destroy()
  })
  clipboard.on('error', (e) => {
    ctx.$message({ type: 'error', message: '出错了', duration: 1000 })
    // 释放内存
    clipboard.destroy()
  })
}

const initClipboard = () => {
  const clipboard = new Clipboard('#btn', {
    target: () => {
      return document.querySelector('#btn')
    },
    text: () => {
      return getLinkValue(computedLinkType.value)
    },
    action: () => {
      return 'copy'
    }
  })
  clipboard.on('success', (e) => {
    ctx.$message({ type: 'success', message: '复制成功', duration: 1000 })
  })
  clipboard.on('error', (e) => {
    ctx.$message({ type: 'error', message: '出错了', duration: 1000 })
    // 释放内存
    clipboard.destroy()
  })
}
onMounted(() => {
  initClipboard()
})
const handleClick = () => {
  const btn: HTMLElement = document.querySelector('#btn')
  btn.click()
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
$color: #6c757d;
$color-active: #ffffff;
.home-container {
  width: 100%;
  min-height: 100%;
  @include flex-layout(column);
  // background: #fff;
  padding: 10px 10px 0;
  .home-title {
    font-size: 32px;
    margin-bottom: 15px;
  }
  .home-tips {
    font-size: 16px;
    color: #212529;
    margin-bottom: 15px;
  }
  .el-card {
    // border: 1px solid rgba(0,0,0,.125);
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 12%);
    border: 0;
    // background: transparent;
    .bucket-title {
      font-size: 18px;
      margin-bottom: 15px;
    }
    .bucket-list {
      margin-left: -5px;
      .el-tag {
        height: 38px !important;
        padding: 0 15px;
        font-size: 16px;
        background: transparent;
        border: 1px solid $color;
        color: $color;
        margin-bottom: 8px;
        margin-left: 8px;
        cursor: pointer;
        &.el-tag--dark {
          background: $color;
          color: $color-active;
        }
      }
    }
  }

  .custom-card {
    .el-card__body {
      @include flex-layout(row);
    }
    .upload {
      height: 300px;
      flex: 1;
      @include flex-layout(column);
      .el-upload {
        flex: 1;
        .el-upload-dragger {
          height: 100%;
          @include flex-layout-align(column, center, center);
        }
      }
      .el-upload__tip {
        flex-shrink: 0;
      }
    }
    .quick-entry {
      // margin-top: 15px;
      flex-shrink: 0;
      margin-left: 15px;
      @include flex-layout-align(column, flex-start, center);
      .entry-title {
        font-size: 16px;
        margin-bottom: 15px;
      }
      .entry-list {
        @include flex-layout(column);
        .el-button {
          + .el-button {
            margin-left: 0;
            margin-top: 12px;
          }
        }
      }
    }
  }

  .copy-history {
    width: 100%;
    @include flex-layout-align(row, space-between, flex-start);
    .el-card {
      flex: 1;
      height: 230px;
      margin-bottom: 0;
      + .el-card {
        margin-left: 15px;
      }
      .el-card__body {
        @include flex-layout(column);
        height: 100%;
        .bucket-title {
          flex-shrink: 0;
        }
        .history-list,.el-tabs {
          flex: 1;
        }
        .history-list {
          overflow: auto;
        }
      }
    }
  }

  .el-tabs {
    @include flex-layout(column);
    overflow: hidden;
    .el-tabs__header {
      background: #fff;
      flex-shrink: 0;
    }
    .el-tabs__content {
      flex: 1;
      overflow: hidden;
      .el-tab-pane {
        width: 100%;
        height: 100%;
        overflow: auto;
        .links-copy {
          width: 100%;
          min-height: 100%;
          background: rgba(204,232,255,.5);
          border: 1px solid rgba(153,209,255,.57);
          border-radius: 4px;
          padding: 10px 15px;
          font-size: 14px;
          color: #747a80;
          cursor: pointer;
          word-break: break-all;
          position: relative;
          line-height: 20px;
          padding-right: 30px;
          .link-copy-btn {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            display: none;
          }
          &:hover {
            .link-copy-btn {
              display: block;
            }
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .el-tabs__item {
      margin-left: -1px;
      border-right: 1px solid #dcdfe6;
      &.is-active {
        font-weight: bold;
      }
    }
  }
}
</style>