<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Funcionando!',
    description: 'Agora sim 🎉'
  })
}
</script>

<template>
  <div class="p-10">
    <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
  </div>
</template>
