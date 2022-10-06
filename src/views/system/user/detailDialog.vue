<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="'查看用户'"
    :width="'800px'"
    :footerStyle="{
      'text-align': 'center'
    }"
    :before-close="handleClose">
    <el-form :model="detail" label-width="100px" :label-position="'right'" class="dict-form" @submit.prevent="">
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="detail.avatar" size="large" placeholder="请输入头像" readonly />
      </el-form-item>
      <el-form-item label="邮箱/账号" prop="email" class="inline">
        <el-input v-model="detail.email" size="large" placeholder="请输入邮箱" readonly />
      </el-form-item>
      <el-form-item label="角色" prop="role" class="inline">
        <el-select v-model="detail.role" size="large" style="width: 100%;" readonly>
          <el-option
            v-for="(item, index) in roles"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username" class="inline">
        <el-input v-model="detail.username" size="large" placeholder="请输入姓名" readonly />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobilePhoneNumber" class="inline">
        <el-input v-model="detail.mobilePhoneNumber" size="large" placeholder="请输入联系电话" readonly />
      </el-form-item>
      <el-form-item label="职业" prop="major" class="inline">
        <el-input v-model="detail.major" size="large" placeholder="请输入职业" readonly />
      </el-form-item>
      <el-form-item label="性别" prop="gender" class="inline">
        <el-select v-model="detail.gender" size="large" style="width: 100%;" readonly>
          <el-option
            v-for="(item, index) in genders"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt" class="inline">
        <el-input v-model="detail.createdAt" size="large" readonly />
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt" class="inline">
        <el-input v-model="detail.updatedAt" size="large" readonly />
      </el-form-item>
      <el-form-item label="地址" prop="address" class="inline">
        <el-input v-model="detail.address" size="large" readonly />
      </el-form-item>
      <el-form-item label="密码" prop="address" class="inline">
        <el-input value="●●●●●●●●●●●●●" size="large" readonly>
          <template #append>
            <el-button type="primary" @click="resetPassword">重置密码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt" class="inline">
        <el-input v-model="detail.updatedAt" size="large" readonly />
      </el-form-item>
      <el-form-item label="用户状态" prop="status" class="inline">
        <el-switch v-model="detail.status" size="large" readonly />
      </el-form-item>
      <el-form-item label="邮箱验证状态" prop="emailVerified" class="inline">
        <el-switch v-model="detail.emailVerified" size="large" readonly />
      </el-form-item>
      <el-form-item label="个人简介" prop="desc">
        <el-input v-model="detail.desc" size="large" type="textarea" :rows="4" readonly />
      </el-form-item>
    </el-form>
    <template #action>
      <el-button type="primary" size="large" @click="handleClose">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Dict from '@/types/Dict';
import Users from '@/types/User';
import { DictInter, UserInter } from '@/typings/interface';
import { JsonResponse } from '@/typings/req-res';
import { useCtxInstance } from '@/hooks/global';

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
    mobilePhoneNumber: '',
    status: true
  } as UserInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const user = new Users()
const ctx = useCtxInstance()


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
const roles = ref([])
const genders = ref([])


/**
 * 数据获取
 */
const getRoleDict = () => {
  const dict = new Dict()
  dict.detailByPro('code', 'user_role').then((res: JsonResponse<DictInter>) => {
    roles.value = res.data.values
  })
}
getRoleDict()
const getGenderDict = () => {
  const dict = new Dict()
  dict.detailByPro('code', 'user_gender').then((res: JsonResponse<DictInter>) => {
    genders.value = res.data.values
  })
}
getGenderDict()

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const resetPassword = () => {
  user.updateByPro(props.detail.id, 'password', '000000').then(res => {
    ctx.$message({
      type: 'success',
      message: '密码重置成功，重置密码为000000',
      duration: 1000
    })
  })
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.dict-form {
  overflow: hidden;
  @include flex-layout-align(row, flex-start, flex-start, wrap);
  .el-form-item {
    width: 100%;
    padding: 0 20px 0 15px;
    &.inline {
      width: 50%;
    }
  }
}
</style>