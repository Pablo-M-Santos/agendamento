import { computed } from 'vue'
import { ptBR } from '../i18n/pt-BR'
import { enUS } from '../i18n/en-US'
import { esES } from '../i18n/es-ES'

type Dict = Record<string, string>

type Dictionaries = {
  'pt-BR': Dict
  'en-US': Dict
  'es-ES': Dict
}

const dictionaries: Dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES
}

export const useAppI18n = () => {
  const { settings } = useUserSettings()

  const language = computed(() => settings.value.language)

  const t = (key: string, params?: Record<string, string | number>) => {
    const dict = dictionaries[language.value] || dictionaries['pt-BR']
    const fallback = dictionaries['pt-BR'][key] || key
    let text = dict[key] || fallback

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replaceAll(`{${paramKey}}`, String(value))
      })
    }

    return text
  }

  return {
    language,
    t
  }
}
