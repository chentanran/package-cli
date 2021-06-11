import { Module } from 'vuex'
import { GlobalDataProps } from './index'
import { v4 as uuidv4 } from 'uuid'

export interface EditorProps {
	// 供中间编辑器渲染的数组
	components: ComponentData[];
	// 当前编辑的是哪个元素
	currentElement: string;
}

interface ComponentData {
	// 
	props: { [key: string]: any };
	//
	id: string;
	// 业务组件库名称 l-text l-image 等等
	name: string;
}

export const testComponents: ComponentData[] = [
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello', fontSize: '20px', paddingLeft: '20px' } },
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '30px', paddingLeft: '40px' } },
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello3', fontSize: '40px', paddingLeft: '60px' } },
]

const editor: Module<EditorProps, GlobalDataProps> = {
	state: {
		components: testComponents,
		currentElement: ''
	},
	mutations: {
		addComponent(state, props) {
			const newComponent: ComponentData = {
				id: uuidv4(),
				name: 'l-text',
				props
			}
			state.components.push(newComponent)
		}
	}
}

export default editor
