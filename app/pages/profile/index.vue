<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { computed, ref, watch } from 'vue'
import { useUserSettings } from '~/composables/useUserSettings'

definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()
const { settings, settingsSaving, availableLanguages, availableThemes, saveLanguage, saveTheme } =
  useUserSettings()
const { t } = useAppI18n()

const isLightTheme = computed(() => settings.value.theme === 'light')
const activeSavingSection = ref<'language' | 'theme' | null>(null)
const avatarLoadError = ref(false)

const inicial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const provedorConta = computed(() => {
  const providers = user.value?.providerData || []
  const hasGoogle = providers.some((item) => item.providerId === 'google.com')
  const hasPassword = providers.some((item) => item.providerId === 'password')

  if (hasGoogle) return t('provider.google')
  if (hasPassword) return t('provider.emailPassword')
  return t('provider.unknown')
})

const uidCurto = computed(() => {
  const uid = user.value?.uid || ''
  if (!uid) return '--'
  return `${uid.slice(0, 6)}...${uid.slice(-4)}`
})

watch(
  () => user.value?.photoURL,
  () => {
    avatarLoadError.value = false
  }
)

const voltar = () => useRouter().back()

const handleSelectLanguage = async (language: (typeof availableLanguages)[number]['value']) => {
  if (settings.value.language === language) return
  activeSavingSection.value = 'language'
  try {
    await saveLanguage(language)
  } finally {
    activeSavingSection.value = null
  }
}

const handleSelectTheme = async (theme: (typeof availableThemes)[number]['value']) => {
  if (settings.value.theme === theme) return
  activeSavingSection.value = 'theme'
  try {
    await saveTheme(theme)
  } finally {
    activeSavingSection.value = null
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <header
      class="sticky top-0 z-20 p-6 flex items-center gap-4 border-b backdrop-blur-sm"
      :class="isLightTheme ? 'border-[#D8E7FF]' : 'border-white/10'"
    >
      <button
        class="p-2 rounded-full transition-colors active:scale-95"
        :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
        @click="voltar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-xl font-black">{{ t('profile.title') }}</h1>
    </header>

    <main class="px-6 py-10 max-w-2xl mx-auto">
      <section
        class="relative overflow-hidden flex flex-col items-center p-8 rounded-[2rem] border shadow-2xl transition-colors"
        :class="isLightTheme ? 'bg-white border-[#D8E7FF]' : 'bg-white/10 border-white/10'"
      >
        <div
          class="pointer-events-none absolute inset-0"
          :class="
            isLightTheme
              ? 'bg-[radial-gradient(circle_at_top,_rgba(79,156,255,0.18),_transparent_55%)]'
              : 'bg-[radial-gradient(circle_at_top,_rgba(181,255,246,0.15),_transparent_55%)]'
          "
        />

        <div
          class="relative z-10 w-24 h-24 rounded-full border-4 border-[#00D3B8] flex items-center justify-center overflow-hidden mb-6"
          :class="isLightTheme ? 'bg-[#E8F1FF]' : 'bg-[#0B2C54]'"
        >
          <img
            v-if="user?.photoURL && !avatarLoadError"
            :src="user.photoURL"
            alt="Foto de perfil"
            class="w-full h-full object-cover"
            @error="avatarLoadError = true"
          />
          <span
            v-else
            class="text-4xl font-black"
            :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
          >
            {{ inicial }}
          </span>
        </div>

        <div class="relative z-10 text-center space-y-2">
          <h2 class="text-2xl font-black">
            {{ user?.displayName || t('profile.userFallback') }}
          </h2>
          <p
            class="max-w-[280px] mx-auto px-1 text-xs sm:text-sm font-semibold tracking-[0.08em] break-all"
            :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/60'"
          >
            {{ user?.email }}
          </p>
        </div>
      </section>

      <div class="mt-10 grid gap-5">
        <section
          class="p-5 rounded-3xl border transition-colors"
          :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/15 bg-white/10'"
        >
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] mb-4"
            :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/80'"
          >
            {{ t('profile.language') }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="option in availableLanguages"
              :key="option.value"
              class="w-full p-3 rounded-2xl border text-left font-bold text-sm transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="settingsSaving"
              :aria-pressed="settings.language === option.value"
              :class="
                settings.language === option.value
                  ? isLightTheme
                    ? 'bg-[#003D7A] border-[#003D7A] text-white'
                    : 'bg-white border-white text-[#003D7A]'
                  : isLightTheme
                    ? 'bg-[#F4F8FF] border-[#D8E7FF] text-[#0B1F3A]'
                    : 'bg-white/10 border-white/20 text-white'
              "
              @click="handleSelectLanguage(option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <p class="text-xs mt-3" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
            {{
              settingsSaving && activeSavingSection === 'language'
                ? t('profile.savingLanguage')
                : t('profile.languageSaved')
            }}
          </p>
        </section>

        <section
          class="p-5 rounded-3xl border transition-colors"
          :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/15 bg-white/10'"
        >
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] mb-4"
            :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/80'"
          >
            {{ t('profile.theme') }}
          </h3>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in availableThemes"
              :key="option.value"
              class="w-full p-3 rounded-2xl border text-left font-bold text-sm transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="settingsSaving"
              :aria-pressed="settings.theme === option.value"
              :class="
                settings.theme === option.value
                  ? isLightTheme
                    ? 'bg-[#003D7A] border-[#003D7A] text-white'
                    : 'bg-white border-white text-[#003D7A]'
                  : isLightTheme
                    ? 'bg-[#F4F8FF] border-[#D8E7FF] text-[#0B1F3A]'
                    : 'bg-white/10 border-white/20 text-white'
              "
              @click="handleSelectTheme(option.value)"
            >
              {{ t(`profile.${option.value}`) }}
            </button>
          </div>

          <p class="text-xs mt-3" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
            {{
              settingsSaving && activeSavingSection === 'theme'
                ? t('profile.savingTheme')
                : t('profile.themeSaved')
            }}
          </p>
        </section>

        <section
          class="p-5 rounded-3xl border transition-colors"
          :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/15 bg-white/10'"
        >
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] mb-4"
            :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/80'"
          >
            {{ t('profile.about') }}
          </h3>

          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <span :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
                {{ t('profile.loginProvider') }}
              </span>
              <span class="font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
                {{ provedorConta }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <span :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
                {{ t('profile.accountUid') }}
              </span>
              <span class="font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
                {{ uidCurto }}
              </span>
            </div>
          </div>
        </section>

        <button
          class="w-full py-5 rounded-2xl border-2 border-red-500/25 text-red-500 font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
          @click="logout"
        >
          {{ t('profile.logout') }}
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
