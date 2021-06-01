import { createApp } from 'vue'
import App from './App.vue'
import components from './plugin/antd-vue'

const app = createApp(App)

components.forEach(item => {
	app.use(item)
})

app.mount('#app')
