<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { computed } from 'vue'


definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()


const inicial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const voltar = () => useRouter().back()

</script>

<template>
  <div class="min-h-screen bg-[#1B1B1B] text-white">
    <header class="p-6 flex items-center gap-4 border-b border-white/5">
      <button @click="voltar" class="p-2 hover:bg-white/5 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-black">Meu Perfil</h1>
    </header>

    <main class="px-6 py-10">
      <section class="flex flex-col items-center p-8 bg-[#1B1B1B] rounded-[3rem] border border-white/5 shadow-2xl">
        <div class="w-24 h-24 rounded-full border-4 border-[#FA4805] flex items-center justify-center bg-[#020618] overflow-hidden mb-6">
          <img v-if="user?.photoURL" :src="user.photoURL" class="w-full h-full object-cover" />
          <span v-else class="text-4xl font-black text-[#00DC82]">{{ inicial }}</span>
        </div>

        <div class="text-center space-y-2">
          <h2 class="text-2xl font-black">{{ user?.displayName || 'Usuário' }}</h2>
          <p class="text-sm text-white/40 font-bold tracking-widest uppercase">{{ user?.email }}</p>
        </div>
      </section>

      <div class="mt-12">
        <button 
          @click="logout" 
          class="w-full py-5 rounded-2xl border-2 border-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
        >
          Encerrar Sessão
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>