<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'头像切换'"
    :width="'600px'"
    :before-close="handleClose"
    class="avatar-dialog">
    <div class="tabs">
      <el-button-group>
        <el-button
          v-for="(item, index) in types"
          :key="index"
          :type="item.value === type ? 'primary' : 'info'"
          @click="changeType(item)">
          {{ item.label }}
        </el-button>
      </el-button-group>
    </div>
    <div class="avatar-list">
      <template v-for="(item, index) in typeAvatars" :key="index">
        <div :class="['avatar-item', item.name === avatar ? 'active' : '']" @click="changeAvatar(item)">
          <img :src="item.url" alt="">
          <span>
            <b v-if="item.name === avatar">✔</b>
            {{ item.name }}
          </span>
        </div>
      </template>
    </div>
    <template #action>
      <el-button type="danger" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { ImageInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, toRaw } from 'vue';
interface AvatarInter {
  name: string
  suffix: string
  url?: string
}

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: '星座_处女座'
})
const emit = defineEmits(['update:modelValue', 'submit'])

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
// 头像类别列表
const types = ref([
  { label: '星座头像', value: '星座' },
  { label: '生肖头像', value: '生肖' },
  { label: '比赛头像', value: '比赛' },
  // { label: '学生卡通', value: '学生卡通' },
  // { label: '学生扁平', value: '学生扁平' },
  { label: '通用头像', value: '通用' }
])
// 当前类别
const type = ref('星座')
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
// 当前类别所在头像列表
const typeAvatars = computed(() => {
  return avatars.value.filter(item => {
    return item.name.indexOf(type.value) !== -1
  })
})
const avatar = ref(toRaw(props.detail))

/**
 * 逻辑处理
 */
// 切换类别
const changeType = (item) => {
  type.value = item.value
}
// 切换头像
const changeAvatar = (item) => {
  avatar.value = item.name
}


/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const handleSubmit = () => {
  emit('submit', avatar.value)
  handleClose()
}
</script>

<style lang="scss">
.tabs {
  display: flex;
  justify-content: center;
}
.avatar-list {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  justify-content: space-around;
  .avatar-item {
    width: 120px;
    margin: 7px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--el-fill-color-dark);
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
    img {
      width: 100%;
      height: 119px;
    }
    span {
      padding: 2px 0;
      width: 100%;
      background: var(--el-color-primary);
      text-align: center;
      font-size: 12px;
      color: var(--el-color-white);
      b {
        margin-right: 5px;
      }
    }
    &.active {
      border-color: var(--el-color-primary);
    }
  }
}
.avatar-dialog {
  .el-dialog__body {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>