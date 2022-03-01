import { createApp } from 'vue'
import App from './App.vue'
import testPlugin from './test.plugin'
import router from './router'
import store from './store'

createApp(App)
.use(testPlugin)
.use(store)
.use(router)
.mount('#app')
