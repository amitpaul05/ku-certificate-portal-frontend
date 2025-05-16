import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('localeStore', () => {
  const localeDefaultSchema = {
    data: 'en',
  }

  const localeData = reactive({ ...localeDefaultSchema })

  function setLocale(locale) {
    localeData.data = locale
    localStorage.setItem('locale', locale)
  }


  return { localeData, setLocale}
},{
  persist: {
    key: 'locale-store'
  },
})
