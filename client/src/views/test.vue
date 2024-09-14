<template>
  <div>
    <diff-editor
      language="javascript"
      :old-value="oldValue"
      :value="value"
      style="height: 500px;"></diff-editor>
  </div>
</template>

<script lang="ts" setup>
import DiffEditor from '@/components/editor/diff-editor.vue'
import { ref } from 'vue';

const oldValue = ref('console.log(123);')
const value = ref('console.log(123);\nvar a = 1;')
</script>

<style lang="scss">

</style>