<script setup lang="ts">
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const route = useRoute()
const { user, logout } = useAuth()
const { settings } = useUserSettings()
const toast = useToast()
const { t } = useAppI18n()
const isLightTheme = computed(() => settings.value.theme === 'light')

const displayName = computed(() => {
  return user.value?.displayName || user.value?.email || t('profile.userFallback')
})
const initials = computed(() => displayName.value.charAt(0).toUpperCase())
const avatarLoadError = ref(false)

watch(
  () => user.value?.photoURL,
  () => {
    avatarLoadError.value = false
  }
)

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
          class="relative w-80 max-w-[85vw] h-full p-6 flex flex-col pointer-events-auto transition-colors"
          :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#0B2F66] text-white'"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-12 h-12 rounded-[50%] overflow-hidden border flex items-center justify-center"
                :class="isLightTheme ? 'bg-white border-[#D8E7FF]' : 'bg-white/10 border-white/15'"
              >
                <img
                  v-if="user?.photoURL && !avatarLoadError"
                  :src="user.photoURL"
                  alt="Foto do perfil"
                  class="w-full h-full object-cover"
                  @error="avatarLoadError = true"
                />
                <span v-else class="text-base font-black">{{ initials }}</span>
              </div>
              <p
                class="text-sm font-bold truncate"
                :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'"
              >
                {{ displayName }}
              </p>
            </div>

            <button
              class="p-2 rounded-lg transition"
              :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
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
                  ? isLightTheme
                    ? 'bg-[#003D7A] text-white'
                    : 'bg-white/90 text-[#0B2F66]'
                  : isLightTheme
                    ? 'text-[#4A628A] hover:bg-[#E8F1FF] hover:text-[#0B1F3A]'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
              "
              @click="close"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="font-semibold">{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div
            class="mt-auto pt-6 border-t"
            :class="isLightTheme ? 'border-[#D8E7FF]' : 'border-white/10'"
          >
            <button
              class="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl transition font-bold"
              :class="
                isLightTheme
                  ? 'bg-[#003D7A] text-white hover:bg-[#0B2F66]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              "
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
