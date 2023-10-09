import { reactive } from "vue"

const types_status = reactive({
  11: {
    text: '登录系统',
    status: 'primary'
  },
  21: {
    text: '图片-上传',
    status: 'success'
  },
  22: {
    text: '图片-删除',
    status: 'danger'
  },
  23: {
    text: '图片-更新',
    status: 'warning'
  },
  31: {
    text: 'ChatGPT',
    status: 'primary'
  },
  41: {
    text: '存储桶-创建',
    status: 'primary'
  },
  42: {
    text: '存储桶-更新',
    status: 'warning'
  },
  43: {
    text: '存储桶-删除',
    status: 'danger'
  },
  51: {
    text: '相册-创建',
    status: 'primary'
  },
  52: {
    text: '相册-更新',
    status: 'warning'
  },
  53: {
    text: '相册-删除',
    status: 'danger'
  },
  61: {
    text: '插件-创建',
    status: 'primary'
  },
  62: {
    text: '插件-更新',
    status: 'warning'
  },
  63: {
    text: '插件-删除',
    status: 'danger'
  },
  64: {
    text: '插件-安装',
    status: 'primary'
  },
  65: {
    text: '插件-卸载',
    status: 'warning'
  },
  66: {
    text: '插件-更新版本',
    status: 'warning'
  },
})

export default types_status