import { computed, watch } from 'vue'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { enUS, es, ptBR } from 'date-fns/locale'

export type AppLanguage = 'pt-BR' | 'en-US' | 'es-ES'

type UserSettings = {
  language: AppLanguage
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'pt-BR'
}

const SETTINGS_STORAGE_KEY = 'agendamento-user-settings'

export const useUserSettings = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

  const settings = useState<UserSettings>('user-settings', () => ({ ...DEFAULT_SETTINGS }))
  const settingsLoading = useState<boolean>('user-settings-loading', () => false)
  const settingsSaving = useState<boolean>('user-settings-saving', () => false)
  const settingsInitialized = useState<boolean>('user-settings-initialized', () => false)
  const loadedUid = useState<string | null>('user-settings-loaded-uid', () => null)

  const getLocalSettings = (): UserSettings | null => {
    if (!import.meta.client) return null

    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw) as Partial<UserSettings>
      const language =
        parsed.language === 'pt-BR' || parsed.language === 'en-US' || parsed.language === 'es-ES'
          ? parsed.language
          : null

      if (!language) return null

      return {
        language
      }
    } catch {
      return null
    }
  }

  const saveLocalSettings = (nextSettings: UserSettings) => {
    if (!import.meta.client) return
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
  }

  const applySettings = (nextSettings: Partial<UserSettings>) => {
    settings.value = {
      ...settings.value,
      ...nextSettings
    }

    saveLocalSettings(settings.value)
  }

  const loadSettings = async () => {
    if (!user.value?.uid) {
      settings.value = { ...DEFAULT_SETTINGS }
      loadedUid.value = null
      return
    }

    if (loadedUid.value === user.value.uid) return

    settingsLoading.value = true

    try {
      const local = getLocalSettings()
      if (local) {
        applySettings(local)
      }

      const ref = doc($db, 'user_settings', user.value.uid)
      const snapshot = await getDoc(ref)

      if (!snapshot.exists()) {
        loadedUid.value = user.value.uid
        return
      }

      const data = snapshot.data() as Partial<UserSettings>
      applySettings({
        language:
          data.language === 'pt-BR' || data.language === 'en-US' || data.language === 'es-ES'
            ? data.language
            : settings.value.language
      })

      loadedUid.value = user.value.uid
    } finally {
      settingsLoading.value = false
    }
  }

  const saveLanguage = async (language: AppLanguage) => {
    applySettings({ language })

    if (!user.value?.uid) return

    settingsSaving.value = true

    try {
      const ref = doc($db, 'user_settings', user.value.uid)
      await setDoc(
        ref,
        {
          language,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    } finally {
      settingsSaving.value = false
    }
  }

  const initUserSettings = () => {
    if (settingsInitialized.value) return

    settingsInitialized.value = true

    const local = getLocalSettings()
    if (local) {
      applySettings(local)
    }

    watch(
      () => user.value?.uid || null,
      async (uid) => {
        if (!uid) {
          loadedUid.value = null
          settings.value = { ...DEFAULT_SETTINGS }

          const stored = getLocalSettings()
          if (stored) {
            applySettings(stored)
          }
          return
        }

        await loadSettings()
      },
      { immediate: true }
    )
  }

  const dateLocale = computed(() => {
    if (settings.value.language === 'en-US') return enUS
    if (settings.value.language === 'es-ES') return es
    return ptBR
  })

  const availableLanguages: Array<{ value: AppLanguage; label: string }> = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ]

  return {
    settings,
    settingsLoading,
    settingsSaving,
    availableLanguages,
    dateLocale,
    loadSettings,
    saveLanguage,
    initUserSettings
  }
}
