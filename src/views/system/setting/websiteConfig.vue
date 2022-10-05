<template>
  <el-form class="website-form" :model="form" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'网站logo&打赏'" :header-padding="'18px 15px'">
      <el-row>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="logo" label="网站logo">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="网站ico">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="阿里支付">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="微信支付">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
    
    <c-card :title="'网站信息'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="网站名称">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="title" label="网站标题">
            <el-input v-model="form.title" placeholder="请输入网站标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="subtitle" label="网站副标题">
            <el-input v-model="form.subtitle" placeholder="请输入网站副标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="desc" label="网站作者">
            <el-input v-model="form.desc" placeholder="请输入网站作者" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="网站域名">
            <el-input v-model="form.domain" placeholder="请输入网站域名" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="keys" label="网站关键字">
            <el-select
              v-model="form.keys"
              multiple
              filterable
              allow-create
              default-first-option
              size="large"
              :reserve-keyword="false"
              placeholder="网站关键字">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="label_position" label="label位置">
            <el-select v-model="form.label_position" size="large" placeholder="请选择网站lable所在位置">
              <el-option 
                v-for="(item, index) in [{
                  label: '上',
                  value: 'top'
                }, {
                  label: '左',
                  value: 'left'
                }, {
                  label: '右',
                  value: 'right'
                }]" 
                :key="'label-' + index"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="版本号">
            <el-input v-model="form.domain" placeholder="请输入版本号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="24">
          <el-form-item prop="desc" label="网站描述">
            <el-input v-model="form.desc" placeholder="请输入网站描述" size="large" type="textarea" :rows="7" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'版权信息'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_company" label="版权归属公司">
            <el-input v-model="form.copyright_company" placeholder="请输入版权归属公司" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_time" label="运营时间段">
            <el-input v-model="form.copyright_time" placeholder="请输入运营时间段" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_miitbeian" label="工信备案号">
            <el-input v-model="form.copyright_miitbeian" placeholder="请输入工信部备案号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="copyright_miiturl" label="备案地址">
            <el-input v-model="form.copyright_miiturl" placeholder="请输入工信部备案地址" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <el-form-item class="submit-form-item">
      <el-button size="large" type="default">取消</el-button>
      <el-button size="large" type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

/**
 * 变量
 */
const form = reactive({
  logo: '',
  name: '',
  title: '',
  subtitle: '',
  domain: '',
  desc: '',
  keys: [],
  label_position: 'top', // form表单的label位置
  copyright_company: '', // 版权归属公司名称
  copyright_time: '', // 网站运营时间
  copyright_miitbeian: '', // 工信部备案号
  copyright_miiturl: 'https://beian.miit.gov.cn/', // 工信部备案地址(即工信部官网地址)
})
const formRef = ref()
const options = []
const rules = reactive({
  logo: [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ],
  name: [
    { required: true, message: '请输入网站名称', trigger: ['blur'] }
  ],
  title: [
    { required: true, message: '请输入网站标题', trigger: ['blur'] }
  ]
})
</script>

<style lang="scss">
.website-form {
  padding: 0 30px;
  .el-form-item__label {
    font-weight: 700;
  }
  .submit-form-item {
    .el-form-item__content {
      justify-content: center;
    }
  }
}
.el-row {
  margin-bottom: 20px;
  .el-col {
    padding: 0 20px;
    .el-select {
      width: 100%;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>