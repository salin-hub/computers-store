import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import stores from './stores'
const app = createApp(App)

app.use(createPinia())
app.use(stores)
app.use(router)

app.mount('#app')
