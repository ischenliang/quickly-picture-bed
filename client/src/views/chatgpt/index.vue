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
            :text="item.text"></message-item>
        </div>
        <div class="chatgpt-message-operate">
          <el-input v-model="message" placeholder="请输入内容"></el-input>
          <el-button @click="handleClick">发送</el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import messageItem from './message-item.vue';
import axios from 'axios';
const message = ref('')

const chatRecords = ref([
  {
    id: 1679798895614,
    title: 'vue3 ref实现原理',
    isEdit: false,
    data: []
  }
])

const text = ref('')


/**
 * 逻辑处理
 */
// 点击发送
let chatId = ref(1)
function handleClick () {
  chatRecords.value[0].data.push({
    id: chatId.value,
    time: '2023/3/26 17:43:24',
    text: message.value,
    reverse: true, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: false, // 请求中
    requestOptions: {
      prompt: '', // 咨询的问题
      reqId: 0
    }
  })
  chatRecords.value[0].data.push({
    id: chatId.value + 1,
    time: '2023/3/26 17:43:24',
    text: '',
    reverse: false, // 询问时为true，回答时为false
    error: false, // 是否报错
    loading: true, // 请求中
    requestOptions: {
      prompt: message.value, // 咨询的问题
      reqId: chatId.value
    }
  })
  scrollToBottom()
  // sendMessage()
  axios({
    url: 'https://cbjtestapi.binjie.site:7777/api/generateStream',
    method: 'POST',
    data: {
      "prompt": message.value,
      "userId": "#/chat/" + chatRecords.value[0].id,
      "network": true
    },
    onDownloadProgress: ({ event }: any) => {
      const responseText = event.target.responseText
      let chunk = responseText
      chatRecords.value[0].data.forEach(el => {
        if (el.requestOptions.reqId === chatId.value) {
          el.text = chunk
          el.loading = false
        }
      })
      scrollToBottom()
    }
  }).then(() => {

  }).catch(error => {

  }).finally(() => {
    message.value = ''
    chatId.value++
  })
}
// 发送数据
function sendMessage () {
  axios({
    url: 'https://cbjtestapi.binjie.site:7777/api/generateStream',
    method: 'POST',
    data: {
      "prompt": message.value,
      "userId": "#/chat/" + Date.now(),
      "network": true
    },
    onDownloadProgress: (event) => {
      console.log(event)
      // const responseText = event.target.responseText
      // let chunk = responseText
      // text.value = chunk
    }
  })
}


const scrollRef = ref(null)
const scrollToBottom = async () => {
  nextTick(() => {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  })
  
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
        height: 73px;
        flex-shrink: 0;
        border-top: $border;
        box-shadow: 0px -2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 15px;
      }
    }
  }
}
</style>