<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { computed, ref } from 'vue'
import { useUserSettings } from '~/composables/useUserSettings'

definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()
const { settings, settingsSaving, availableLanguages, availableThemes, saveLanguage, saveTheme } =
  useUserSettings()
const { t } = useAppI18n()

const isLightTheme = computed(() => settings.value.theme === 'light')
const activeSavingSection = ref<'language' | 'theme' | null>(null)

type LanguageValue = (typeof availableLanguages)[number]['value']
type ThemeValue = (typeof availableThemes)[number]['value']

const inicial = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const userName = computed(() => user.value?.displayName || t('profile.userFallback'))
const userEmail = computed(() => user.value?.email || '--')

const languageOptions = computed(() => availableLanguages)
const themeOptions = computed<Array<{ value: ThemeValue; label: string }>>(() => {
  return availableThemes.map((option) => ({
    value: option.value,
    label: t(`profile.${option.value}`)
  }))
})

const languageFeedback = computed(() => {
  return settingsSaving.value && activeSavingSection.value === 'language'
    ? t('profile.savingLanguage')
    : t('profile.languageSaved')
})

const themeFeedback = computed(() => {
  return settingsSaving.value && activeSavingSection.value === 'theme'
    ? t('profile.savingTheme')
    : t('profile.themeSaved')
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

const voltar = () => useRouter().back()

const handleSelectLanguage = async (language: LanguageValue) => {
  if (settings.value.language === language) return
  activeSavingSection.value = 'language'
  try {
    await saveLanguage(language)
  } finally {
    activeSavingSection.value = null
  }
}

const handleSelectTheme = async (theme: ThemeValue) => {
  if (settings.value.theme === theme) return
  activeSavingSection.value = 'theme'
  try {
    await saveTheme(theme)
  } finally {
    activeSavingSection.value = null
  }
}

const onLanguageSelect = (value: string) => {
  if (!availableLanguages.some((option) => option.value === value)) return
  void handleSelectLanguage(value as LanguageValue)
}

const onThemeSelect = (value: string) => {
  if (!availableThemes.some((option) => option.value === value)) return
  void handleSelectTheme(value as ThemeValue)
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <ProfilePageHeader :is-light-theme="isLightTheme" :title="t('profile.title')" @back="voltar" />

    <main class="px-6 py-10 max-w-2xl mx-auto">
      <ProfileUserCard
        :is-light-theme="isLightTheme"
        :photo-url="user?.photoURL"
        :name="userName"
        :email="userEmail"
        :initial="inicial"
      />

      <div class="mt-10 grid gap-5">
        <ProfileSettingsCard
          :is-light-theme="isLightTheme"
          :title="t('profile.language')"
          :options="languageOptions"
          :selected-value="settings.language"
          :disabled="settingsSaving"
          :feedback="languageFeedback"
          @select="onLanguageSelect"
        />

        <ProfileSettingsCard
          :is-light-theme="isLightTheme"
          :title="t('profile.theme')"
          :options="themeOptions"
          :selected-value="settings.theme"
          :disabled="settingsSaving"
          :feedback="themeFeedback"
          columns-class="grid-cols-2"
          @select="onThemeSelect"
        />

        <ProfileAccountInfoCard
          :is-light-theme="isLightTheme"
          :title="t('profile.about')"
          :provider-label="t('profile.loginProvider')"
          :provider-value="provedorConta"
          :uid-label="t('profile.accountUid')"
          :uid-value="uidCurto"
        />

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
