import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Material from '@primeuix/themes/material'
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(router)

app.mount('#app')

app.use(PrimeVue, {
  theme: {
    preset: Material
  }
})
