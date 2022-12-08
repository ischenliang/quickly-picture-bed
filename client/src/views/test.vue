<template>
  <div>
    <input type="file" @change="handleChange">
  </div>
</template>

<script lang="ts" setup>
function useFileToBase64 (file: File, prefix: boolean = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result: any = reader.result
      if (prefix) {
        resolve(result)
      } else {
        resolve(result.split(",").pop())
      }
    };
    reader.onerror = (error) => {
      reject(error)
    };
  });
}

const handleChange = async (event) => {
  const file: File = event.target.files[0]
  console.log(file)
  const data = await useFileToBase64(file)
  console.log(data)
}
</script>

<style lang="scss">

</style>