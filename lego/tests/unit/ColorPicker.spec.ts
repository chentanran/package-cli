import { mount, VueWrapper } from '@vue/test-utils'
import ColorPicker from '@/components/ColorPicker.vue'
const defaultColor = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', ''];

describe('UserProfile', () => {
	// let wrapper: VueWrapper<any>;
	// beforeAll(() => {
		const wrapper = mount(ColorPicker, {
			props: {
				value: '#ffffff'
			}
		})
	// })
	it('render', () => {
		// <div><input><div>
		// <ul class="picked-color-list">
		// <li class="item-0" or class="transparent-back">
		// <div></div>
		// </li>
		// </ul>

		// 测试左侧是否为 input， 类型和值是否正确
		expect(wrapper.find('input').exists()).toBeTruthy()
		const input = wrapper.get('input').element
		expect(input.value).toBe('color')
		expect(input.value).toBe('#ffffff')
		// 测试右侧是否有颜色列表
		expect(wrapper.findAll('.picker-color-list li').length).toBe(defaultColor.length)
		// 测试一个元素的css backgroundColor属性是否相等对应的颜色
		const firstItem = wrapper.get('li:first-child div').element
		expect(firstItem.style.backgroundColor).toBe(defaultColor[0])
		// 测试最后一个元素是否有特殊的类名
		const lastItem = wrapper.get('li:first-child div').element
		expect(lastItem.classList.contains('transparent-back')).toBeTruthy()
	})
	it('emit - change', async () => {
		// 测试 input 修改以后， 是否发送对应的事件和对应的值
		const blackHex = '#000000'
		const input = wrapper.get('input')
		await input.setValue(blackHex)
		expect(wrapper.emitted()).toHaveProperty('change')
		const events = wrapper.emitted('change')
		expect(events && events[0]).toEqual([blackHex])
	})
	it('click', () => {
		// 测试点击右侧颜色列表以后，是否发送对应的值
		const firstItem = wrapper.get('li:first-child div')
		firstItem.trigger('click')
		const evets = wrapper.emitted('change')
		expect(evets && evets[1]).toEqual([defaultColor[0]])
	})
})