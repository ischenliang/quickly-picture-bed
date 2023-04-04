<template>
  <div class="chatgpt-page">
    <div class="chatgpt-container">
      <!-- 左侧聊天列表区域 -->
      <aside class="chatgpt-store">
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
      </aside>
      <!-- 右侧消息区域 -->
      <main class="chatgpt-message">
        <div class="chatgpt-message-list" ref="scrollRef">
          <message-item
            v-for="(item, index) in chatRecords[0].data"
            :key="item.id"
            :reverse="item.reverse"
            :loading="item.loading"
            :time="item.time"
            :text="item.text"></message-item>
        </div>
        <div class="chatgpt-message-operate">
          <div class="chatgpt-input">
            <div class="msg-input">
              <el-input type="textarea" resize="none" placeholder="说点什么吧..." v-model="message"></el-input>
            </div>
            <div class="msg-toolbar">
              <el-button size="mini" type="primary" @click="sendData" :disabled="loading">发送</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import messageItem from './message-item.vue';
import axios from 'axios';
import moment from 'moment';

// 发送数据
const message = ref('')
// 状态列表
const chatRecords = ref([
  {
    id: Date.now(),
    title: 'vue3 ref实现原理',
    isEdit: false,
    data: []
  },
  {
    id: Date.now() + 1,
    title: 'vue3 ref实现原理',
    isEdit: false,
    data: []
  }
])
// 消息id
const id = ref(1)
// 全局loading状态
const loading = ref(false)


/**
 * 逻辑处理
 */
// 点击发送
function sendData () {
  const chatData = chatRecords.value[0]
  chatData.data.push({
    id: id.value++,
    time: getDateTime(),
    text: message.value,
    reverse: true, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: false, // 请求中
  })
  const key = id.value++
  chatData.data.push({
    id: key,
    time: getDateTime(),
    text: '',
    reverse: false, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: true, // 请求中
  })
  scrollToBottom()
  useEventSource(key, message.value)
  message.value = ''
}

// 获取数据
function useEventSource (key, message) {
  const chatData = chatRecords.value[0]
  const eventSource = new EventSource('http://localhost:3002/?msg=' + message)
  eventSource.onopen = () => {
    console.log('连接成功')
  }
  eventSource.onerror = () => {
    console.log('报错了')
  }
  eventSource.addEventListener('test', (e) => {
    chatData.data.forEach(el => {
      if (el.id === key) {
        const data = JSON.parse(e.data)
        if (data.done) {
          loading.value = false
          el.loading = false
          el.time = getDateTime()
          eventSource.close()
        } else {
          if (data.data.choices[0].delta.content) {
            el.text += data.data.choices[0].delta.content
          }
        }
      }
      scrollToBottom()
    })
  });
}

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
    border-radius: 4px;
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
  height: 100px;
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
        padding: 5px 8px !important;
        box-shadow: none !important;
      }
    }
  }
  .msg-toolbar {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    .el-button {
      // padding: 5px 10px !important;
      // font-size: 12px !important;
      // height: auto !important;
    }
  }
}
</style>