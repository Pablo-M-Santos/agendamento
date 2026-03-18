<script setup>

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header class="h-16 bg-black text-white flex items-center px-6">Header</header>

    <main class="flex-1 p-6">
      <slot />
    </main>

    <footer class="h-14 bg-black text-white flex items-center justify-center">Footer</footer>
  </div>
</template>
