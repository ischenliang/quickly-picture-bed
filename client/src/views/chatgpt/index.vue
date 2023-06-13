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
        <div class="chatgpt-message-list" ref="scrollRef" v-if="chatRecords[0].data.length && chatgpt">
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
          <p v-if="!chatgpt" style="color: red;font-weight: bold;">您未被授权使用chatgpt功能，如需使用请联系管理员授权！</p>
          <p v-if="!chatgpt" style="color: red;font-weight: bold;">联系邮箱: itchenliang@163.com</p>
          <el-image :src="alipay"></el-image>
        </div>
        <div class="chatgpt-message-operate">
          <div class="chatgpt-input">
            <div class="msg-input">
              <el-input type="textarea" :disabled="!chatgpt" resize="none" placeholder="说点什么吧..." v-model="message" @keydown.enter.prevent="sendData"></el-input>
            </div>
            <div class="msg-toolbar">
              <div class="msg-toolbar-left">
                <el-tooltip content="支持作者" placement="top">
                  <div class="msg-toolbar-item" @click="toolbarOperate('reward')">
                    <el-icon :size="18"><Box /></el-icon>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="chatgpt" content="清空历史记录" placement="top">
                  <div class="msg-toolbar-item" @click="toolbarOperate('delete')">
                    <el-icon :size="18"><Delete /></el-icon>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="chatgpt" content="导出聊天记录" placement="top">
                  <div class="msg-toolbar-item" @click="toolbarOperate('download')">
                    <el-icon :size="18"><Download /></el-icon>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="chatgpt" content="导入聊天记录" placement="top">
                  <div class="msg-toolbar-item" @click="toolbarOperate('upload')">
                    <el-icon :size="18"><Upload /></el-icon>
                    <input type="file" ref="uploadRef" accept=".json" @change="uploadChange" style="display: none;">
                  </div>
                </el-tooltip>
              </div>
              <el-button type="primary" @click="sendData" :disabled="loading || !chatgpt">发送</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <!-- 打赏弹窗 -->
    <reward-dialog
      v-if="visible.reward"
      v-model="visible.reward">
    </reward-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, computed, Ref, reactive, watch } from 'vue';
import messageItem from './message-item.vue';
import moment from 'moment';
import useWebSocket from '@/hooks/useWebscoket';
import { useCopyText, useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import useUserStore from '@/store/user';
import { useCopyCode } from './useCopyCode'
import { ChatData } from '@/typings/interface';
import rewardDialog from './reward-dialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import Log from '@/types/Log';

interface ChangeEvent<T = Element> extends Event {
  target: EventTarget & T
}

interface ChatRecord {
  id: number
  title: string
  isEdit: boolean
  data: ChatData[]
}

// 是否允许使用chatgpt
const chatgpt = computed(() => {
  return userStore.userInfo.config.chatgpt
})

/**
 * 实例
 */
let webscoket: WebSocket = null
const userStore = useUserStore()
const ctx = useCtxInstance()
const log = new Log()


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
const chatRecords: Ref<ChatRecord[]> = ref([
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
// 生成客户端id
const clientId = getClientId()
// 弹窗
const visible = reactive({
  reward: false
})
// 上传ref
const uploadRef: Ref<HTMLInputElement> = ref(null)


/**
 * 逻辑处理
 */
// 点击发送
function sendData () {
  if (message.value.trim() === '' || loading.value) {
    return
  }

  if (webscoket.readyState !== webscoket.OPEN) {
    ElMessage({ message: '连接已经关闭，请刷新后重试', type: 'warning', duration: 1000 })
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
    role: 'user',
    clientId: clientId
  })
  activeMessageId.value = id.value++
  chatData.data.push({
    id: activeMessageId.value,
    time: getDateTime(),
    text: '',
    reverse: false, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: true, // 请求中
    role: 'assistant',
    clientId: clientId
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
      content: el.text,
      clientId: el.clientId
    }
  })
  webscoket.send(JSON.stringify(sendData.slice(-1)[0]))
  log.create({
    type: 5,
    operate_id: userStore.userInfo.email,
    operate_cont: userStore.userInfo.email,
    content: '使用了chatgpt'
  })
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
    case 'reward':
      visible.reward = true
      break
    case 'upload':
      uploadRef.value.click()
      break
  }
}
// 上传聊天记录
function uploadChange (e: ChangeEvent<HTMLInputElement>) {
  const file: File = e.target.files[0]
  ElMessageBox.confirm('上传聊天记录将覆盖当前聊天记录，是否确定上传？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    console.log(file)
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const res: any = fileReader.result
      try {
        const jsonObj = JSON.parse(res)
        chatRecords.value[0].data = jsonObj
        saveData()
        scrollToBottom()
      } catch (error) {
        ctx.$message({ message: 'json文件内容不符合要求', duration: 1000, type: 'error' })
      }
    }
    fileReader.readAsText(file)
  }).catch(() => {})
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
 * 获取客户端id： 根据时间戳生成客户端id
 *    考虑到时效和聊天token长度问题，故每天生成客户端id
 *   生成规则：
 *      1. 每天生成一个客户端id
 *      2. 如果是当天第一次获取则生成
 *      3. 如果是当天第n次则从缓存中获取
 */
function getClientId () {
  // 时间
  const chatClient = localStorage.getItem('client_id')
  if (chatClient) {
    const chatClienDate = new Date(chatClient)
    const today = new Date()
    if (chatClienDate.toDateString() === today.toDateString()) {
      return chatClienDate.getTime()
    } else {
      return today.getTime()
    }
  }
  const today = new Date()
  localStorage.setItem('client_id', today.getTime().toString())
  return today.getTime()
}

/**
 * 页面始终滚动到最底部
 */
const scrollRef = ref(null)
const scrollToBottom = async () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
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
    id.value = res[res.length - 1].id
  }
  return res
}


/**
 * 生命周期监听
 */
onMounted(() => {
  scrollToBottom()
})


/**
 * 侦听器
 */
watch(() => chatgpt.value, (val, old) => {
  if (val) {
    webscoket = useWebSocket('ws://124.222.54.192:3003', {
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
              // 老版本
              // if (data.data.choices[0].delta.content) {
              //   el.text += data.data.choices[0].delta.content
              // }

              // 新版本
              el.text += data.data.content
            }
          }
          scrollToBottom()
        })
      },
      onClose: () => {
        console.log('连接关闭了')
        ElMessage({ message: '连接已经关闭，请刷新后重试，此时无法使用chatgpt', type: 'warning', duration: 1000 })
      }
    })
  }
}, {
  immediate: true
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
      overflow: hidden;
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