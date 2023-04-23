<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'存储桶数据迁移'"
    :width="'600px'"
    :before-close="handleClose">
    <p style="color: red;">图片标准: 图片类型存在于 {{ systemConfig.system.accept.join(', ') }} 中</p>
    <div class="migrate-item">
      <div class="migrate-item-title">Excel方式</div>
      <div class="migrate-item-desc">
        <p>1. 上传excel文件，自动将excel中的图片上传到本存储桶中，<a href="/template.xlsx" download="template.xlsx">下载模板</a>;</p>
        <p>2. 导出excel文件，自动将本存储桶中的图片数据自动导出到excel中;</p>
        <p><b>注意: 导入时只会导入符合标准的文件，不符合标准的文件将被略过!!!</b></p>
      </div>
      <div class="migrate-item-main">
        <el-button
          :loading="loading.export_excel"
          type="success"
          icon="Download"
          @click="exportExcel">导出excel</el-button>
        <el-button
          :loading="loading.import_excel"
          type="primary"
          icon="Upload"
          @click="importExcel">
          导入excel
          <input type="file" ref="excelRef" accept=".xlsx" @change="handleExcelChange">
        </el-button>
      </div>
    </div>
    <div class="migrate-item">
      <div class="migrate-item-title">ZIP方式</div>
      <div class="migrate-item-desc">
        <p>1. 上传zip压缩包，自动将zip包中的所有图片上传到本存储桶中;</p>
        <p>2. 导出zip文件，自动将本存储桶中的图片下载并保存到zip包中;</p>
        <p><b>注意: 导入时只会导入符合标准的文件，不符合标准的文件将被略过!!!</b></p>
      </div>
      <div class="migrate-item-main">
        <el-button
          :loading="loading.export_zip"
          type="success"
          icon="Download"
          @click="exportZip">导出ZIP包</el-button>
        <el-button
          :loading="loading.import_zip"
          type="primary"
          icon="Upload"
          @click="importZip">
          导入ZIP包
          <input type="file" ref="zipRef" accept=".zip" @change="handleZipChange">
        </el-button>
      </div>
    </div>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>
  
<script lang="ts" setup>
import Image from '@/types/Image';
import { BucketInter, ImageInter, MyPlugin } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { Ref, computed, reactive, ref } from 'vue';
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
import { utils, writeFile, read } from 'xlsx'
import { mimeTypes } from '@/global.config';
import { useCtxInstance, useGetSuffix } from '@/hooks/global';
import axios from 'axios';
import SparkMD5 from 'spark-md5';
import hmacsha1 from 'hmacsha1'
import md5 from 'md5'
import crypto from 'crypto-js'
import UploadManager from '@/hooks/uploader';
import useConfigStore from '@/store/config';

interface ChangeEvent<T = any> extends Event {
  target: EventTarget & T;
}

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: BucketInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => {
    return {}
  }
})
const emit = defineEmits(['update:modelValue', 'submit'])
const image = new Image()
const uploadManager = new UploadManager()
const ctx = useCtxInstance()
const configStore = useConfigStore()


/**
 * 变量
 */
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
// loading状态
const loading = reactive({
  export_excel: false, // 导出excel
  export_zip: false, // 导出zip
  import_excel: false, // 导入excel
  import_zip: false // 导入zip
})
// 图片列表
const images: Ref<ImageInter[]> = ref([])
// 当前存储桶插件
let plugin: MyPlugin = null
// 系统配置
const systemConfig = computed(() => {
  const config = configStore.systemConfig
  config.system.accept_str = '.' + config.system.accept.join(',.')
  return config
})

/**
 * 数据获取
 */
function submit () {
  handleClose()
  emit('submit')
}
// 获取图片列表
function getImages () {
  image.find({
    bucket_id: props.detail.id, // 图床
  }).then((res: PageResponse<ImageInter>) => {
    const baseUrl = props.detail.config_baseUrl
    images.value = res.items.map(el => {
      return {
        ...el,
        img_preview_url: baseUrl + el.img_url
      }
    })
  })
}
getImages()
// 导出图片ZIP
function exportZip () {
  loading.export_zip = true
  var zip = new JSZip();
  var count = images.value.length;
  var zipFilename = props.detail.name + '.zip';
  images.value.forEach((image, i) => {
    JSZipUtils.getBinaryContent(image.img_preview_url, (err, data) => {
      if(err) {
        throw err;
      }
      zip.file(image.img_name, data, { binary:true })
      count--;
      if (count === 0) {
        zip.generateAsync({type:'blob'}).then(function(content) {
          saveAs(content, zipFilename)
          loading.export_zip = false
        })
      }
    })
  })
}
// 导出图片excel
function exportExcel () {
  loading.export_excel = true
  const sheet = utils.json_to_sheet(images.value.map(el => {
    return {
      img_name: el.img_name,
      img_preview_url: el.img_preview_url
    }
  }));
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, 'Sheet1');
  writeFile(workbook, props.detail.name + '.xlsx');
  loading.export_excel = false
}
const zipRef: Ref<HTMLInputElement> = ref()
// 导入图片zip
function importZip () {
  loading.import_zip = true
  zipRef.value.click()
}
function handleZipChange (e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files[0]
  if (!file) {
    loading.import_zip = false
    return
  }
  // 创建FileReader对象读取文件内容
  var reader = new FileReader()
  reader.onload = function() {
    var zip = new JSZip()
    // 解析zip文件
    zip.loadAsync(reader.result).then((zip) => {
      // 遍历zip文件内所有文件
      var filenames = Object.keys(zip.files).filter(el => {
        // 判断是否为图片文件
        const system = systemConfig.value.system
        return el && system.accept.includes(useGetSuffix(el))
      })
      const maps = filenames.map((filename) => {
        // 获取图片内容
        return zip.file(filename).async('blob')
      })
      // 将blob处理成file
      Promise.all(maps).then(blobs => {
        const files = blobs.map((blob, index) => {
          const filename = filenames[index]
          return new File([blob], filename, {type: mimeTypes[useGetSuffix(filename)]});
        })
        uploadImages(files, 'import_zip')
      })
    })
  }
  reader.readAsArrayBuffer(file)
}
// 导出图片excel
const excelRef: Ref<HTMLInputElement> = ref()
function importExcel () {
  loading.import_excel = true
  excelRef.value.click()
}
function handleExcelChange (e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files[0]
  if (!file) {
    loading.import_excel = false
    return
  }
  var fileReader = new FileReader();
  fileReader.onload = (event: any) =>  {
    var data = new Uint8Array(event.target.result);
    var workbook = read(data, { type: 'array' });
    // console.log(workbook.SheetNames);
    const excel_data: ImageInter[] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).filter((el: ImageInter) => {
      // 判断是否是支持的文件类型
      const system = systemConfig.value.system
      return el.img_name && system.accept.includes(useGetSuffix(el.img_name))
    })
    const maps = excel_data.map((el: ImageInter) => {
      // 获取图片内容
      return fetch(el.img_preview_url).then(res => res.blob())
    })
    // 将blob处理成file
    Promise.all(maps).then(blobs => {
      const files = blobs.map((blob, index) => {
        const filename = excel_data[index].img_name
        return new File([blob], filename, {type: mimeTypes[useGetSuffix(filename)]});
      })
      uploadImages(files, 'import_excel')
    })
  };
  fileReader.readAsArrayBuffer(file);
}
// 上传图片
function uploadImages (files, key: string) {
  // 上传文件
  uploadManager.uploadFile(plugin, files, ({ loaded, index, total }) => {
    // 进度处理
  }).then((res: Array<ImageInter>) => {
    res.forEach((item, index) => {
      let tmp = {
        ...item,
        bucket_id: props.detail.id,
        bucket_type: props.detail.type
      }
      image.create({ ...tmp }).then((result: ImageInter) => {
        if (index === res.length - 1) {
          ctx.$message({ message: '导入成功', duration: 1000, type: 'success' })
          loading[key] = false
          if (key === 'import_zip') {
            zipRef.value.value = ''
          }
          if (key === 'import_excel') {
            excelRef.value.value = ''
          }
        }
      })
    })
  })
}
// 注册插件
function registerPlugin () {
  const bucket = props.detail
  const obj = JSON.parse(bucket.config)
  for (let key in obj) {
    obj[key] = obj[key].replace(/\$\{((config).*?)\}/g, (v, key) => {
      const keys = key.split('.')
      if (keys[0] === 'config') {
        return obj[keys[1]]
      }
    })
  }
  // 此处还需注册插件
  if (bucket.plugin) {
    // 第一步：将定义好的插件中的${config.xxx}替换成真实的数据(即全局config中的数据)
    const tmp = bucket.plugin.replace(/\$\{((config|file).*?)\}/g, (v, key) => {
      const keys = key.split('.')
      if (keys[0] === 'config') {
        return obj[keys[1]]
      }
    })

    // 第二步：将定义好的插件转成js对象
    plugin = new Function('return ' + tmp)()
    plugin.name = bucket.id
    // 第三步：为了解决直接调用axios报错问题，动态在uploader上挂载axios，然后才可以在内部使用this['axios']调用
    plugin.uploader.axios = axios
    plugin.uploader.sparkMd5 = SparkMD5
    plugin.uploader.hmacsha1 = hmacsha1
    plugin.uploader.crypto = crypto
    plugin.uploader.md5 = md5
  }
}
registerPlugin()

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
  emit('submit')
}

/**
 * 监听器
 */
</script>
  
<style lang="scss">
.migrate-item {
  &-title {
    font-size: 18px;
    color: #000;
    margin: 5px 0;
  }
  &-desc {
    line-height: 24px;
    font-size: 16px;
    text-align: justify;
  }
  &-main {
    margin-top: 10px;
    .el-button {
      input {
        display: none;
      }
    }
  }
  + .migrate-item {
    margin-top: 30px;
  }
}
</style>