import { shallowMount, VueWrapper } from '@vue/test-utils'
import Upload from '@/components/Upload.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

describe('upload components', () => {
	beforeAll(() => {
		wrapper = shallowMount(Upload, {
			props: {
				action: 'test.url'
			}
		})
	})
	it('基础', () => {
		expect(wrapper.find('button').exists()).toBeTruthy()
		expect(wrapper.get('button span').text()).toBe('点击上传')
		expect(wrapper.get('input').isVisible()).toBeFalsy()
	})
	it('上传流程', async () => {
		// 默认请求为成功的
		mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
		const fileInput = wrapper.get('input').element as HTMLInputElement
		const files = [testFile] as any // 由于 ts 报类型错误， 将其断言为 any
		// 不能直接修改 fileInput 里面的 files， 使用 Object.defineProperty 来处理
		Object.defineProperty(fileInput, 'files', {
			value: files,
			writable: false
		})
		await wrapper.get('input').trigger('change')
		// 模拟请求被调用的次数
		expect(mockedAxios.post).toHaveBeenCalledTimes(1)
		// expect(wrapper.get('button span').text()).toBe('正在上传')
		// button 为 disabled
		// expect(wrapper.get('button').attributes('disabled')).toBeTruthy()
		// expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
		// 列表长度修改， 并且有正确的class
		expect(wrapper.findAll('li').length).toBe(1)
		const firstItem = wrapper.get('li:first-child')
		// expect(firstItem.classes()).toContain('upload-loading')
		// 刷新所有未解决的已解决的Promise处理程序
		await flushPromises()
		expect(wrapper.get('button span').text()).toBe('点击上传')
		// 有正确的 class 并且文件名称相对应
		expect(firstItem.classes()).toContain('upload-success')
		expect(firstItem.get('.filename').text()).toBe(testFile.name)
	})
	it('上传失败', async () => {
		mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
		await wrapper.get('input').trigger('change')
		expect(mockedAxios.post).toHaveBeenCalledTimes(2)
		// expect(wrapper.get('button span').text()).toBe('正在上传')
		// 刷新所有未解决的已解决的Promise处理程序
		await flushPromises()
		expect(wrapper.get('button span').text()).toBe('点击上传')
		// 列表长度增加，并且列表的最后一项有正确的 class 名
		expect(wrapper.findAll('li').length).toBe(2)
		const lastItem = wrapper.get('li:last-child')
		expect(lastItem.classes()).toContain('upload-error')
		// 点击列表中右侧的 button， 可以删除这一项
		await lastItem.get('.delete-icon').trigger('click')
		expect(wrapper.findAll('li').length).toBe(1)
	})
})