<template>
  <div>
    <!-- 拖拽排序列表 -->
    <ul ref="sortableListRef">
      <li v-for="item in items" :key="item.id" :data-id="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs';
import { ref, onMounted, Ref } from 'vue'

const sortableListRef: Ref<HTMLElement | null> = ref()

const items = ref([
  { id: 1, name: 'Item1', weight: 1 },
  { id: 2, name: 'Item2', weight: 2 },
  { id: 3, name: 'Item3', weight: 3 },
  { id: 4, name: 'Item4', weight: 4 },
])

onMounted(() => {
  const sortableList = new Sortable(sortableListRef.value, {
    animation: 150,
    onEnd: (event: any) => {
      console.log(event)
      const { oldIndex, newIndex } = event
      // const newIndex = event.newIndex;
      // const movedItem = items.value.splice(event.oldIndex, 1)[0]
      // items.value.splice(newIndex, 0, movedItem)

      const [from, to] = [items.value[oldIndex], items.value[newIndex]]
      const fromIndex = items.value.findIndex(el => el.id === from.id)
      const toIndex = items.value.findIndex(el => el.id === to.id)
      items.value.splice(fromIndex, 1, to)
      items.value.splice(toIndex, 1, from)
    }
  })
})
</script>

<style lang="scss">
ul {
  padding: 20px;
  li {
    height: 40px;
    background: #ccc;
    margin-bottom: 10px;
    padding: 10px 20px;
  }
}
</style>