<template>
  <div class="card-item">
    <div class="card-item-left">
      <div class="card-item-count">
        <span class="total-count">{{ formatCount(item.total) }}</span>
        <span class="today-count" v-if="item.today !== 0" :style="{
          color: formatStyle(item.today)
        }">{{ formatTodayCount(item.today) }}</span>
      </div>
      <span class="card-item-label">
        {{ item.label }}
        <small v-if="item.unit">({{ item.unit }})</small>
      </span>
    </div>
    <div class="card-item-right">
      <el-icon :color="item.color" :size="40"><component :is="item.cover"></component></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  item?: {
    total?: number
    today?: number
    label?: string
    bgcolor?: string
    cover?: string
    unit?: string // 单位
    color?: string // 颜色
  }
}
withDefaults(defineProps<Props>(), {
  item: () => ({
    total: 0,
    today: 0,
    label: '名称',
    bgcolor: '#ccc',
    cover: '',
    unit: '个',
    color: '#ccc'
  })
})

const formatCount = (count) => {
  return ('' + count).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
const formatTodayCount = (count) => {
  if (count > 0) {
    return '+' + count
  } else if (count <= 0) {
    return count
  }
}
const formatStyle = (count) => {
  if (count === 0) {
    return '#909399'
  } else if (count < 0) {
    return '#f56c6c'
  } else {
    return '#67c23a'
  }
}
</script>

<style lang="scss">
.card-item {
  width: 100%;
  height: 130px;
  background: #fff;
  border-radius: 4px;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-item-right {
    width: 70px;
    height: 70px;
    margin-left: 10px;
    flex-shrink: 0;
    background: v-bind('item.bgcolor');
    // border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-item-left {
    flex: 1;
    .card-item-count {
      margin-bottom: 10px;
      .total-count {
        font-size: 30px;
      }
      .today-count {
        font-size: 16px;
        color: rgb(102, 144, 249);
        margin-left: 5px;
      }
    }
    .card-item-label {
      // color: #1d2129;
      color: #009688;
      font-weight: bold;
      font-size: 18px;
    }
  }
}
</style>