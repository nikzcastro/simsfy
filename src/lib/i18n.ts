import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import br from '../locales/br.json'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import de from '../locales/de.json'
import ru from '../locales/ru.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      br: { translation: br },
      en: { translation: en },
      fr: { translation: fr },
      pt: { translation: pt },
      de: { translation: de },
      ru: { translation: ru },
    },
    fallbackLng: 'br',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
