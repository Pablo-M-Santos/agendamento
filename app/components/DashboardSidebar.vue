<script setup lang="ts">
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { ref, watch, onMounted, onUnmounted } from 'vue'

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
const avatarLoadError = ref(false)
const isDesktop = ref(false)

watch(
  () => user.value?.photoURL,
  () => {
    avatarLoadError.value = false
  }
)

const updateBreakpoint = () => {
  isDesktop.value = window.matchMedia('(min-width: 1024px)').matches
}

onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
})

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
          v-if="!isDesktop && props.modelValue"
          class="absolute inset-0 bg-black/60 pointer-events-auto"
          :aria-label="t('sidebar.closeMenu')"
          @click="close"
        />
      </Transition>

      <Transition
        v-if="!isDesktop"
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-250 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="props.modelValue"
          class="relative w-80 max-w-[85vw] h-full p-6 flex flex-col pointer-events-auto bg-[#141A28] text-[#EDEFF4]"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 min-w-0">
              <div
                 class="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center bg-[#1E2A3D] border-[#262E42] flex-shrink-0"
              >
                <img
                  v-if="user?.photoURL && !avatarLoadError"
                  :src="user.photoURL"
                  alt="Foto do perfil"
                  class="w-full h-full object-cover"
                  @error="avatarLoadError = true"
                />
                <span v-else class="text-base font-black text-[#4FD1C5]">{{ initials }}</span>
              </div>
              <p
             class="text-sm font-bold truncate text-[#EDEFF4]"
              >
                {{ displayName }}
              </p>
            </div>

            <button
               class="p-2 rounded-lg transition hover:bg-white/5 text-[#8A93A6]"
              :aria-label="t('sidebar.close')"
              @click="close"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <nav class="mt-4 space-y-2">
            <NuxtLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
            :class="
              isActive(item.to)
                ? 'bg-[#1B4F4A] text-[#EAFBF6]'
                : 'text-[#8A93A6] hover:bg-[#1E2A3D] hover:text-[#EDEFF4]'
            "
              @click="close"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="font-semibold">{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div
             class="mt-auto pt-6 border-t border-[#262E42]"
          >
            <button
               class="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl transition font-bold bg-[#1E2A3D] text-[#EDEFF4] hover:bg-[#262E42]"
              @click="handleLogout"
            >
              <ArrowLeftOnRectangleIcon class="w-5 h-5" />
              {{ t('sidebar.logout') }}
            </button>
          </div>
        </aside>
      </Transition>

      <aside
        v-if="isDesktop && props.modelValue"
        class="fixed left-0 top-0 z-[90] h-full w-80 max-w-[85vw] p-6 flex flex-col pointer-events-auto bg-[#141A28] text-[#EDEFF4] border-r border-[#262E42]"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3 min-w-0">
            <div
               class="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center bg-[#1E2A3D] border-[#262E42] flex-shrink-0"
            >
              <img
                v-if="user?.photoURL && !avatarLoadError"
                :src="user.photoURL"
                alt="Foto do perfil"
                class="w-full h-full object-cover"
                @error="avatarLoadError = true"
              />
              <span v-else class="text-base font-black text-[#4FD1C5]">{{ initials }}</span>
            </div>
            <p
           class="text-sm font-bold truncate text-[#EDEFF4]"
            >
              {{ displayName }}
            </p>
          </div>

          <button
             class="p-2 rounded-lg transition hover:bg-white/5 text-[#8A93A6]"
            :aria-label="t('sidebar.close')"
            @click="close"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <nav class="mt-4 space-y-2">
          <NuxtLink
            v-for="item in links"
            :key="item.to"
            :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="
            isActive(item.to)
              ? 'bg-[#1B4F4A] text-[#EAFBF6]'
              : 'text-[#8A93A6] hover:bg-[#1E2A3D] hover:text-[#EDEFF4]'
          "
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-semibold">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div
           class="mt-auto pt-6 border-t border-[#262E42]"
        >
          <button
             class="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl transition font-bold bg-[#1E2A3D] text-[#EDEFF4] hover:bg-[#262E42]"
            @click="handleLogout"
          >
            <ArrowLeftOnRectangleIcon class="w-5 h-5" />
            {{ t('sidebar.logout') }}
          </button>
        </div>
      </aside>
    </div>
  </Teleport>
</template>