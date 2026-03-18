<script setup lang="ts">
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
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
const toast = useToast()
const { t } = useAppI18n()

const displayName = computed(() => {
  return user.value?.displayName || user.value?.email || t('profile.userFallback')
})
const initials = computed(() => displayName.value.charAt(0).toUpperCase())

const isActive = (path: string) => route.path === path

const close = () => emit('update:modelValue', false)

const handleLogout = async () => {
  close()
  toast.add({
    title: t('sidebar.logoutDoneTitle'),
    description: t('sidebar.logoutDoneDescription'),
    color: 'success'
  })
  await logout()
}

const links = computed(() => [
  { to: '/dashboard', label: t('sidebar.dashboard'), icon: HomeIcon },
  { to: '/schedule', label: t('sidebar.schedule'), icon: CalendarDaysIcon },
  { to: '/reports', label: t('sidebar.reports'), icon: ChartBarIcon },
  { to: '/profile', label: t('sidebar.profile'), icon: UserIcon }
])
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
          :aria-label="t('sidebar.closeMenu')"
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
          class="relative w-80 max-w-[85vw] h-full bg-[#0B2F66] text-white p-6 flex flex-col pointer-events-auto"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-12 h-12 rounded-[50%] overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center"
              >
                <img
                  v-if="user?.photoURL"
                  :src="user.photoURL"
                  alt="Foto do perfil"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-base font-black">{{ initials }}</span>
              </div>
              <p class="text-sm font-bold truncate text-white">{{ displayName }}</p>
            </div>

            <button
              class="p-2 rounded-lg hover:bg-white/10 transition"
              :aria-label="t('sidebar.close')"
              @click="close"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <nav class="mt-15 space-y-2">
            <NuxtLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
              :class="
                isActive(item.to)
                  ? 'bg-white/90 text-[#0B2F66]'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              "
              @click="close"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="font-semibold">{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div class="mt-auto pt-6 border-t border-white/10">
            <button
              class="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-bold"
              @click="handleLogout"
            >
              <ArrowLeftOnRectangleIcon class="w-5 h-5" />
              {{ t('sidebar.logout') }}
            </button>
          </div>
        </aside>
      </Transition>
    </div>
  </Teleport>
</template>
