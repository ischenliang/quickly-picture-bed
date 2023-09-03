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
import { BucketInter, ImageInter } from '@/typings/interface';
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
import useConfigStore from '@/store/config';
import { useJudgeImageNormal } from './useImageHook'
import { blob } from 'stream/consumers';

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
        zip.generateAsync({type:'blob'}).then((content) => {
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
  zipRef.value.click()
}
function handleZipChange (e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files[0]
  if (!file) {
    loading.import_zip = false
    return
  }
  loading.import_zip = true
  // 创建FileReader对象读取文件内容
  var reader = new FileReader()
  reader.onload = function() {
    var zip = new JSZip()
    // 解析zip文件
    zip.loadAsync(reader.result).then((zip) => {
      // 第一步、遍历zip文件内所有文件
      var filenames = Object.keys(zip.files).filter(el => {
        // 判断是否为图片文件
        const system = systemConfig.value.system
        return el && system.accept.includes(useGetSuffix(el))
      })
      // 第二步、处理图片
      const maps = filenames.map((filename) => {
        // 获取图片内容
        return zip.file(filename).async('blob')
      })
      // 第三步、将blob处理成file
      handleData(maps, filenames, 'import_zip')
    })
  }
  reader.readAsArrayBuffer(file)
}
// 导出图片excel
const excelRef: Ref<HTMLInputElement> = ref()
function importExcel () {
  excelRef.value.click()
}
function handleExcelChange (e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files[0]
  if (!file) {
    loading.import_excel = false
    return
  }
  loading.import_excel = true
  var fileReader = new FileReader();
  fileReader.onload = (event: any) =>  {
    var data = new Uint8Array(event.target.result);
    var workbook = read(data, { type: 'array' });
    const excel_data: ImageInter[] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).filter((el: ImageInter) => {
      // 判断是否是支持的文件类型
      const system = systemConfig.value.system
      return el.img_name && system.accept.includes(useGetSuffix(el.img_name))
    })
    const maps = excel_data.map((el: ImageInter) => {
      // 获取图片内容
      return fetch(el.img_preview_url).then(res => res.blob())
    })
    handleData(maps, excel_data.map(el => el.img_name), 'import_excel')
  };
  fileReader.readAsArrayBuffer(file);
}
// 上传图片
function uploadImages (files, key: string) {
}
// 处理数据
function handleData (maps, filenames, key: 'import_excel' | 'import_zip') {
  // 将blob处理成file
  Promise.all(maps).then(blobs => {
    // 判断图片是否损坏
    const judges = blobs.map((blob, index) => {
      return Object.values(mimeTypes).includes(blob.type) || blob.type === ''  ? useJudgeImageNormal(blob, useGetSuffix(filenames[index])) : false
    })
    Promise.all(judges).then(res => {
      const finalImages = []
      // 去除有损图片
      res.forEach((el, index) => {
        if (el) {
          finalImages.push({
            blob: blobs[index],
            filename: filenames[index]
          })
        }
      })
      if (finalImages.length) {
        // 处理正确的图片
        const files = finalImages.map((fileImage, index) => {
          const filename = fileImage.filename
          return new File([fileImage.blob], filename, {type: mimeTypes[useGetSuffix(filename)]})
        })
        uploadImages(files, key)
      } else {
        loading[key] = false
        if (judges.length) {
          ctx.$message({ message: '出问题啦，请检查上传的文件内的图片能正常访问', type: 'error', duration: 1000 })
        }
      }
    })
  })
}

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