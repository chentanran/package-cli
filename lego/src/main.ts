import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import components from './plugin/antd-vue'

const app = createApp(App)

components.forEach(item => {
	app.use(item)
})

app.use(router).use(store)

app.mount('#app')
