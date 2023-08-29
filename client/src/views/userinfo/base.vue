<template>
  <div class="user-base">
    <!-- <div class="user-base-title">基本设置</div> -->
    <div class="user-base-view">
      <el-form :model="form" :rules="rules" :label-position="'right'" :label-width="150">
        <el-form-item label="头像" prop="avatar">
          <div class="user-avatar">
            <img class="avatar-image" :src="userAvatar" />
            <div class="avatar-btn" @click="openAvatarDialog">修改</div>
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="form.username" placeholder="请输入昵称" size="large" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="emailemail">
          <el-input v-model="form.email" placeholder="请输入邮箱" disabled size="large" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" size="large" />
        </el-form-item>
        <el-form-item label="职业" prop="major">
          <!-- 程序猿  设计师  开发者  学生  其他 -->
          <el-check-tag
            v-for="(item, index) in majors"
            :key="'major-' + index"
            type="primary"
            :checked="form.major === item.value"
            effect="dark"
            size="large"
            @change="changeMajor(item)">
            {{ item.label }}
          </el-check-tag>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <!-- 男 女 保密 -->
          <el-radio-group v-model="form.gender">
            <el-radio
              v-for="(item, index) in genders"
              :key="'gender-' + index"
              :label="item.value"
              size="large">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <!-- <el-input v-model="form.address" placeholder="请输入用户名" size="large" /> -->
          <!-- <el-cascader
            v-model="form.address"
            :options="citys.list"
            filterable
            clearable
            :props="{
              value: 'code',
              label: 'name',
              children: 'list'
            }"
            style="width: 100%;"
            popper-class="c-cascader"
            @change="handleChange"/> -->
          <el-cascader
            v-model="form.address"
            :options="citys"
            filterable
            clearable
            style="width: 100%;"
            popper-class="c-cascader"
            size="large"/>
        </el-form-item>
        <el-form-item label="角色组" prop="role">
          <el-select v-model="form.role" size="large" disabled style="width: 100%;">
            <el-option
              v-for="(item, index) in roles"
              :key="'role-' + index"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介|个性签名" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入个人简介"></el-input>
        </el-form-item>
        <el-form-item prop="name" style="margin-top: 25px;">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <avatar-dialog
      v-if="item.visible"
      v-model="item.visible"
      :detail="form.avatar"
      @submit="avatarSubmit"></avatar-dialog>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/user';
import Dict from '@/types/Dict';
import Users from '@/types/User';
import { DictInter, UserInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, toRefs, unref } from 'vue'
import AvatarDialog from './avatar-dialog.vue'
// import citys from '@/assets/city.json'
// console.log(citys.list)
import citys from '@/assets/pca-code.json'
import { useCtxInstance } from '@/hooks/global';
interface AvatarInter {
  name: string
  suffix: string
  url?: string
}

/**
 * 实例
 */
const dict = new Dict()
const userStore = useUserStore()
const user = new Users()
const ctx = useCtxInstance()

/**
 * 变量
 */
const form: Ref<UserInter> = ref({
  ...unref(userStore.userInfo)
})
const rules = reactive({
  name: [
    { message: '请输入用户名', required: true, trigger: ['blur'] }
  ]
})
const item = reactive({
  visible: false,
  data: {}
})
// 性别列表
const genders: Ref<Array<{ label: string, value: string | number | boolean }>> = ref([])
// 职业列表
const majors: Ref<Array<{ label: string, value: string | number | boolean }>> = ref([])
// 角色列表
const roles: Ref<Array<{ label: string, value: string | number | boolean }>> = ref([])
// 用户头像
// 所有头像列表
const avatars: Ref<AvatarInter[]> = ref([
  { name: '星座_白羊座', suffix: 'png' },
  { name: '星座_金牛座', suffix: 'png' },
  { name: '星座_双子座', suffix: 'png' },
  { name: '星座_巨蟹座', suffix: 'png' },
  { name: '星座_狮子座', suffix: 'png' },
  { name: '星座_处女座', suffix: 'png' },
  { name: '星座_天秤座', suffix: 'png' },
  { name: '星座_天蝎座', suffix: 'png' },
  { name: '星座_射手座', suffix: 'png' },
  { name: '星座_摩羯座', suffix: 'png' },
  { name: '星座_水瓶座', suffix: 'png' },
  { name: '星座_双鱼座', suffix: 'png' },

  
  { name: '生肖_鼠', suffix: 'png' },
  { name: '生肖_牛', suffix: 'png' },
  { name: '生肖_虎', suffix: 'png' },
  { name: '生肖_兔', suffix: 'png' },
  { name: '生肖_龙', suffix: 'png' },
  { name: '生肖_蛇', suffix: 'png' },
  { name: '生肖_马', suffix: 'png' },
  { name: '生肖_羊', suffix: 'png' },
  { name: '生肖_猴', suffix: 'png' },
  { name: '生肖_鸡', suffix: 'png' },
  { name: '生肖_狗', suffix: 'png' },
  { name: '生肖_猪', suffix: 'png' },

  
  { name: '比赛_1', suffix: 'png' },
  { name: '比赛_2', suffix: 'png' },
  { name: '比赛_3', suffix: 'png' },
  { name: '比赛_4', suffix: 'png' },
  { name: '比赛_5', suffix: 'png' },
  { name: '比赛_6', suffix: 'png' },
  { name: '比赛_7', suffix: 'png' },
  { name: '比赛_8', suffix: 'png' },
  { name: '比赛_9', suffix: 'png' },
  { name: '比赛_10', suffix: 'png' },
  { name: '比赛_11', suffix: 'png' },
  { name: '比赛_12', suffix: 'png' },
  
  
  { name: '学生卡通_1', suffix: 'png' },
  { name: '学生卡通_2', suffix: 'png' },
  { name: '学生卡通_3', suffix: 'png' },
  { name: '学生卡通_4', suffix: 'png' },
  { name: '学生卡通_5', suffix: 'png' },
  { name: '学生卡通_6', suffix: 'png' },
  { name: '学生卡通_7', suffix: 'png' },
  { name: '学生卡通_8', suffix: 'png' },
  { name: '学生卡通_9', suffix: 'png' },
  { name: '学生卡通_10', suffix: 'png' },
  { name: '学生卡通_11', suffix: 'png' },
  { name: '学生卡通_12', suffix: 'png' },
  
  
  { name: '学生扁平_1', suffix: 'png' },
  { name: '学生扁平_2', suffix: 'png' },
  { name: '学生扁平_3', suffix: 'png' },
  { name: '学生扁平_4', suffix: 'png' },
  { name: '学生扁平_5', suffix: 'png' },
  { name: '学生扁平_6', suffix: 'png' },
  { name: '学生扁平_7', suffix: 'png' },
  { name: '学生扁平_8', suffix: 'png' },
  { name: '学生扁平_9', suffix: 'png' },
  { name: '学生扁平_10', suffix: 'png' },
  { name: '学生扁平_11', suffix: 'png' },
  { name: '学生扁平_12', suffix: 'png' },
  
  { name: '通用_1', suffix: 'png' },
  { name: '通用_2', suffix: 'png' },
  { name: '通用_3', suffix: 'png' },
  { name: '通用_4', suffix: 'png' },
  { name: '通用_5', suffix: 'png' },
  { name: '通用_6', suffix: 'png' },
  { name: '通用_7', suffix: 'png' },
  { name: '通用_8', suffix: 'png' },
  { name: '通用_9', suffix: 'png' },
  { name: '通用_10', suffix: 'png' },
  { name: '通用_11', suffix: 'png' },
  { name: '通用_12', suffix: 'png' },
])
avatars.value.forEach(item => {
  item.url = new URL(`./images/${item.name}.${item.suffix}`, import.meta.url).href
})
const userAvatar = computed(() => {
  // props.userInfo.avatar
  return avatars.value.find(item => item.name === form.value.avatar).url
})

/**
 * 逻辑处理
 */
// 打开头像选择框
const openAvatarDialog = () => {
  item.visible = true
}
const avatarSubmit = (e) => {
  form.value.avatar = e
}
const submit = () => {
  user.save(form.value).then(res => {
    ctx.$message({ message: '更新成功', duration: 1000, type: 'success' })
    userStore.updateUserInfo(form.value)
  })
}
// 切换职业
const changeMajor = (item) => {
  form.value.major = item.value
}

/**
 * 数据获取
 */
// 获取性别字典
const getGender = () => {
  dict.detailByPro('code', 'user_gender').then((res: DictInter) => {
    console.log(res)
    genders.value = res.values
  })
}
getGender()
// 获取性别字典
const getMajor = () => {
  dict.detailByPro('code', 'user_major').then((res: DictInter) => {
    majors.value = res.values
  })
}
getMajor()
// 获取性别字典
const getRole = () => {
  dict.detailByPro('code', 'user_role').then((res: DictInter) => {
    roles.value = res.values
  })
}
getRole()
</script>

<style lang="scss">
.user-base-title {
  margin-bottom: 12px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.user-base-view {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  // justify-content: center;
  .el-form {
    width: 100%;
    width: 650px;
    .el-form-item__label {
      padding: 0 25px 0 0;
    }
    .user-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      background: #c0c4cc;
      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar-btn {
        width: 100%;
        height: 32px;
        background: rgba(0,0,0,.60);
        position: absolute;
        bottom: 0;
        left: 0;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 16px;
      }
    }
    .el-check-tag {
      margin: 3px 10px 3px 0;
    }
  }
}
</style>