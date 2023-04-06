<template>
  <div class="chatgpt-page">
    <div class="chatgpt-container">
      <!-- 左侧聊天列表区域 -->
      <!-- <aside class="chatgpt-store">
        <div class="chatgpt-store-list">
          <div class="store-add">New Chat</div>
          <div class="store-list">
            <div class="store-item"></div>
            <div class="store-item"></div>
            <div class="store-item"></div>
            <div class="store-item"></div>
          </div>
        </div>
        <div class="chatgpt-store-user"></div>
      </aside> -->
      <!-- 右侧消息区域 -->
      <main class="chatgpt-message">
        <div class="chatgpt-message-list" ref="scrollRef" v-if="chatRecords[0].data.length">
          <message-item
            v-for="(item, index) in chatRecords[0].data"
            :key="item.id"
            :reverse="item.reverse"
            :loading="item.loading"
            :time="item.time"
            :text="item.text"
            :avatar="avatar"
            @command="handleCommand($event, index)"></message-item>
        </div>
        <div class="chatgpt-message-empty" v-else>
          <p>永久免费用于学习和测试，支持上下文。</p>
          <p>由于chatgpt限制，故本系统最大支持6条上下文记录。</p>
          <p>赶快在下面输入框中输入你的内容测试测试吧！！</p>
          <p>服务器昂贵，接口昂贵，但网站免费！！</p>
          <p style="font-weight: bold;">如果你觉得做的好，可以给我买一瓶冰阔落</p>
          <el-image :src="alipay"></el-image>
        </div>
        <div class="chatgpt-message-operate">
          <div class="chatgpt-input">
            <div class="msg-input">
              <el-input type="textarea" resize="none" placeholder="说点什么吧..." v-model="message" @keydown.enter.prevent="sendData"></el-input>
            </div>
            <div class="msg-toolbar">
              <div class="msg-toolbar-left">
                <div class="msg-toolbar-item" title="清空历史记录" @click="toolbarOperate('delete')">
                  <el-icon :size="18"><Delete /></el-icon>
                </div>
                <div class="msg-toolbar-item" title="下载历史记录" @click="toolbarOperate('download')">
                  <el-icon :size="18"><Download /></el-icon>
                </div>
              </div>
              <el-button type="primary" @click="sendData" :disabled="loading">发送</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, computed, Ref } from 'vue';
import messageItem from './message-item.vue';
import moment from 'moment';
import useWebSocket from '@/hooks/useWebscoket';
import { useCopyText, useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import useUserStore from '@/store/user';
import { useCopyCode } from './useCopyCode'

/**
 * 实例
 */
const webscoket = useWebSocket('ws://localhost:3003', {
  onMessage: (event) => {
    const chatData = chatRecords.value[0]
    chatData.data.forEach(el => {
      if (el.id === activeMessageId.value) {
        if (el.loading) {
          el.time = getDateTime()
        }
        el.loading = false
        const data = JSON.parse(event.data)
        if (data.done) {
          loading.value = false
          saveData()
        } else {
          if (data.data.choices[0].delta.content) {
            el.text += data.data.choices[0].delta.content
          }
        }
      }
      scrollToBottom()
    })
  }
})
const userStore = useUserStore()
const ctx = useCtxInstance()


const avatar = computed(() => {
  const tmp = userStore.userInfo.avatar
  return new URL(`../userinfo/images/${tmp}.png`, import.meta.url).href
})

/**
 * 变量
 */
const activeChatId = ref(0)
const activeMessageId = ref(0)
// 发送数据
const message = ref('')
// 消息id
const id = ref(1)
// 状态列表
const chatRecords = ref([
  {
    id: Date.now(),
    title: 'vue3 ref实现原理',
    isEdit: false,
    data: [
      ...getData()
    ]
  }
])
// 全局loading状态
const loading = ref(false)
// alipay_url
const alipay = new URL('./alipay.jpg', import.meta.url).href


/**
 * 逻辑处理
 */
// 点击发送
function sendData () {
  if (message.value.trim() === '' || loading.value) {
    return
  }
  const chatData = chatRecords.value[0]
  chatData.data.push({
    id: id.value++,
    time: getDateTime(),
    text: message.value,
    reverse: true, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: false, // 请求中
    role: 'user'
  })
  activeMessageId.value = id.value++
  chatData.data.push({
    id: activeMessageId.value,
    time: getDateTime(),
    text: '',
    reverse: false, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: true, // 请求中
    role: 'assistant'
  })
  loading.value = true
  scrollToBottom()
  saveData()
  useSendData()
  message.value = ''
}
// 获取数据
function useSendData () {
  const { data } = chatRecords.value[0]
  const sendData = data.slice(0, data.length - 1).map(el => {
    return {
      role: el.role,
      content: el.text
    }
  })
  webscoket.send(JSON.stringify(sendData.slice(-6)))
}
// 工具栏操作
function toolbarOperate (type) {
  switch (type) {
    case 'delete':
      const data = chatRecords.value[0].data
      data.length && useDeleteConfirm('确定要删除数据吗?').then(() => {
        chatRecords.value[0].data.splice(0, data.length)
        localStorage.removeItem('chatData')
      })
      break
    case 'download':
      const json = chatRecords.value[0].data;
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-records.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      break
  }
}
// 处理命令
function handleCommand (type, index) {
  const chatData = chatRecords.value[0].data
  switch (type) {
    case 'copy':
      useCopyText(ctx, chatData[index].text)
      break
    case 'delete':
      chatData.splice(index, 1)
      break
  }
  saveData()
}
useCopyCode(ctx)

/**
 * 页面始终滚动到最底部
 */
const scrollRef = ref(null)
const scrollToBottom = async () => {
  nextTick(() => {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  })
}

// 获取当前日期时间
function getDateTime () {
  return moment().format('YYYY/MM/DD HH:mm:ss')
}
// 存储数据
function saveData () {
  localStorage.setItem('chatData', JSON.stringify(chatRecords.value[0].data))
}
// 获取数据
function getData () {
  const data = localStorage.getItem('chatData')
  const res = data ? JSON.parse(data).map(el => {
    return {
      ...el,
      loading: false,
      text: el.text ? el.text : '发生错误了...'
    }
  }) : []
  if (res.length) {
    id.value = res.length
  }
  return res
}


/**
 * 生命周期监听
 */
onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss">
$border-active-color: rgb(75 158 95);
$border-color: #e5e7eb;
$border: 1px solid $border-color;
.chatgpt-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
  background: #fff;
  .chatgpt-container {
    width: 100%;
    height: 100%;
    border: $border;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // border-radius: 4px;
    display: flex;
    overflow: hidden;
    .chatgpt-store {
      width: 260px;
      border-right: $border;
      display: flex;
      flex-direction: column;
      &-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .store-add {
          margin: 1rem;
          border: 1px dashed $border-color;
          height: 40px;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: rgb(51, 54, 57);
          cursor: pointer;
          transition: all .3s;
          &:hover {
            border-color: $border-active-color;
            color: $border-active-color;
          }
        }
        .store-list {
          flex: 1;
          padding: 0 1rem;
          overflow: auto;
          .store-item {
            margin-top: 10px;
            height: 46px;
            border: $border;
            border-radius: 4px;
          }
        }
      }
      &-user {
        flex-shrink: 0;
        height: 73px;
        border-top: $border;
      }
    }
    .chatgpt-message {
      flex: 1;
      display: flex;
      flex-direction: column;
      &-list {
        flex: 1;
        padding: 20px;
        overflow: auto;
      }
      &-empty {
        flex: 1;
        padding: 20px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          line-height: 25px;
          color: rgb(51, 54, 57);
          flex-shrink: 0;
        }
        .el-image {
          width: 200px !important;
          flex-shrink: 0;
        }
      }
      &-operate {
        // height: 73px;
        flex-shrink: 0;
        border-top: $border;
        // box-shadow: 0px -2px 12px 0 rgba(0, 0, 0, 0.1);
        // padding: 15px;
      }
    }
  }
}

.chatgpt-input {
  height: 110px;
  // border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: 10px;
  .msg-input {
    flex: 1;
    .el-textarea {
      height: 100%;
      .el-textarea__inner {
        height: 100%;
        border: none !important;
        padding: 5px 15px !important;
        box-shadow: none !important;
      }
    }
  }
  .msg-toolbar {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .msg-toolbar-left {
      display: flex;
      .msg-toolbar-item {
        width: 36px;
        height: 36px;
        margin-left: 5px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: rgb(75 158 95);
        font-weight: bold;
        &:hover {
          background: rgb(245 245 245);
        }
      }
    }
    .el-button {
      // padding: 5px 10px !important;
      // font-size: 12px !important;
      // height: auto !important;
    }
  }
}
</style>