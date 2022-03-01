import { App } from 'vue'
const plugins = {
	install: (app: App) => {
		app.config.globalProperties.$echo = () => {
			console.log('this is plugins')
		}
		app.provide('test', { message: 'this is plugin' })
	}
}

export default plugins