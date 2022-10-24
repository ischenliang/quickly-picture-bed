<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="detail && detail.id ? '编辑用户' : '新建用户'"
    :width="'600px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" :label-position="'left'" class="dict-form">
      <el-form-item label="邮箱/账号" prop="email">
       <el-input v-model="form.email" size="large" placeholder="请输入邮箱" disabled />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" size="large" style="width: 100%;">
          <el-option
            v-for="(item, index) in roles"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
       <el-input v-model="form.username" size="large" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
       <el-input v-model="form.phone" size="large" placeholder="请输入联系电话" disabled />
      </el-form-item>
      <el-form-item label="状态" prop="status">
       <el-switch v-model="form.status" size="large" active-text="启用" inactive-text="禁用"/>
      </el-form-item>
    </el-form>
    <template #action>
      <el-button size="large" @click="handleClose">取 消</el-button>
      <el-button size="large" type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, Ref, ref, watch } from 'vue';
import Dict from '@/types/Dict';
import { DictInter, UserInter } from '@/typings/interface';
import Users from '@/types/User';
import { JsonResponse } from '@/typings/req-res';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: UserInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    email :'',
    role: 2,
    username: '',
    phone: '',
    status: true
  } as UserInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const user = new Users()


/**
 * 变量
 */
const dialogVisible = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})
const form: UserInter = reactive({
  id: '',
  username: '',
  email: '',
  role: 2,
  phone: '',
  status: true
})
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur'] }
  ],
  role: [
    { required: true, message: '请勾选角色', trigger: ['blur'] }
  ]
})
const formRef = ref(null)
const roles = ref([])


/**
 * 数据获取
 */
const getRoleDict = () => {
  const dict = new Dict()
  dict.detailByPro('code', 'user_role').then((res: DictInter) => {
    roles.value = res.values
  })
}
getRoleDict()

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const tmp: UserInter = JSON.parse(JSON.stringify(form))
      delete tmp.id
      if (form.id) {
        // 不允许修改电话和邮箱
        delete tmp.email
        delete tmp.phone
        user.update({
          id: form.id,
          ...tmp
        }).then(res => {
          handleClose()
          emit('submit')
        })
      } else {
        user.create({
          ...tmp,
          password: '000000'
        }).then(res => {
          handleClose()
          emit('submit')
        })
      }
    }
  })
}

watch(() => props.detail, (val) => {
  if (val) {
    form.id = props.detail.id
    for (let key in form) {
      form[key] = props.detail[key]
    }
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.inline-item {
  flex-direction: column;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.dict-form {
  overflow: hidden;
}
</style>