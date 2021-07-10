import { Module } from 'vuex'
import { GlobalDataProps } from './index'
import { v4 as uuidv4 } from 'uuid'
import { TextComponentProps } from '../defaultProps'

export interface EditorProps {
	// 供中间编辑器渲染的数组
	components: ComponentData[];
	// 当前编辑的是哪个元素
	currentElement: string;
}

export interface ComponentData {
	// 
	props: Partial<TextComponentProps>;
	//
	id: string;
	// 业务组件库名称 l-text l-image 等等
	name: string;
}

export const testComponents: ComponentData[] = [
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello', fontSize: '20px', paddingLeft: '20px', lineHeight: "1", color: '#000000' } },
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '30px', paddingLeft: '40px', textAlign: 'center' } },
	{ id: uuidv4(), name: 'l-text', props: { text: 'hello3', fontSize: '40px', paddingLeft: '60px', fontFamily: '宋体' } },
]

const editor: Module<EditorProps, GlobalDataProps> = {
	state: {
		components: testComponents,
		currentElement: ''
	},
	mutations: {
		addComponent(state, props: Partial<TextComponentProps>) {
			const newComponent: ComponentData = {
				id: uuidv4(),
				name: 'l-text',
				props
			}
			state.components.push(newComponent)
		},
		setActive(state, currentId: string) {
			state.currentElement = currentId
		},
		updateComponent(state, { key, value }) {
			const updatedComponent = state.components.find((component) => component.id === state.currentElement)
			if (updatedComponent) {
				updatedComponent.props[key as keyof TextComponentProps] = value
			}
		}
	},
	getters: {
		getCurrentElement: (state) => {
			return state.components.find(component => component.id === state.currentElement)
		}
	}
}

export default editor
