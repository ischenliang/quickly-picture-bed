import { reactive } from "vue"

const types_status = reactive({
  1: {
    text: '登录系统',
    status: 'primary'
  },
  2: {
    text: '图片-上传',
    status: 'success'
  },
  3: {
    text: '图片-删除',
    status: 'danger'
  },
  4: {
    text: '图片-更新',
    status: 'warning'
  },
  5: {
    text: 'ChatGPT',
    status: 'primary'
  },
  6: {
    text: '存储桶-创建',
    status: 'primary'
  },
  7: {
    text: '存储桶-更新',
    status: 'warning'
  },
  8: {
    text: '存储桶-删除',
    status: 'danger'
  },
  9: {
    text: '相册-创建',
    status: 'primary'
  },
  10: {
    text: '相册-更新',
    status: 'warning'
  },
  11: {
    text: '相册-删除',
    status: 'danger'
  },
})

export default types_status