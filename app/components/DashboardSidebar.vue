<script setup lang="ts">
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const route = useRoute()
const { user, logout } = useAuth()

const displayName = computed(() => user.value?.displayName || user.value?.email || 'Usuário')
const initials = computed(() => displayName.value.charAt(0).toUpperCase())

const isActive = (path: string) => route.path === path

const close = () => emit('update:modelValue', false)

const handleLogout = async () => {
  close()
  await logout()
}

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/schedule', label: 'Agenda', icon: CalendarDaysIcon },
  { to: '/reports', label: 'Relatórios', icon: ChartBarIcon },
  { to: '/profile', label: 'Perfil', icon: UserIcon }
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[90] flex pointer-events-none">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <button
          v-if="props.modelValue"
          class="absolute inset-0 bg-black/50 pointer-events-auto"
          aria-label="Fechar menu"
          @click="close"
        />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-250 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="props.modelValue"
          class="relative w-80 max-w-[85vw] h-full bg-[#111214] text-white p-6 flex flex-col pointer-events-auto"
        >
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-sm uppercase tracking-[0.2em] text-white/60 font-black">Menu</h2>
            <button
              class="p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Fechar"
              @click="close"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="flex items-center gap-4 mb-8">
            <div
              class="w-14 h-14 rounded-[50%] overflow-hidden bg-[#1D1E20] border border-white/10 flex items-center justify-center"
            >
              <img
                v-if="user?.photoURL"
                :src="user.photoURL"
                alt="Foto do perfil"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-lg font-black">{{ initials }}</span>
            </div>
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-[0.15em] text-white/50">Bem-vindo</p>
              <p class="font-bold truncate">{{ displayName }}</p>
            </div>
          </div>

          <nav class="space-y-2">
            <NuxtLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
              :class="
                isActive(item.to)
                  ? 'bg-white text-[#111214]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              "
              @click="close"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="font-semibold">{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div class="mt-auto pt-6 border-t border-white/10">
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition font-bold"
              @click="handleLogout"
            >
              <ArrowLeftOnRectangleIcon class="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>
      </Transition>
    </div>
  </Teleport>
</template>
