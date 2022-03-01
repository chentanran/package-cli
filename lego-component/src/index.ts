import { App } from 'vue'

import LText from './components/LText'

const components = [
	LText
]

const install = (app: App) => {
	components.forEach(component => {
		app.component(component.name, component)
	})
}

export {
	LText,
	install
}

export default {
	install
}