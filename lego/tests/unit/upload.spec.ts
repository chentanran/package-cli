import { shallowMount, VueWrapper, mount } from '@vue/test-utils'
import Upload from '@/components/Upload.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
const mockCpmponent = {
	template: '<div><slot></slot></div>'
}
const mockComponents = {
	'DeleteOutlined': mockCpmponent,
	'LoadingOutlined': mockCpmponent,
	'FileOutlined': mockCpmponent
}

const setInputValue = (input: HTMLInputElement) => {
	const files = [testFile] as any
	Object.defineProperty(input, 'files', {
		value: files,
		writable: false
	})
}

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
		expect(wrapper.get('button').text()).toBe('点击上传')
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
		expect(wrapper.get('button').text()).toBe('点击上传')
		// 有正确的 class 并且文件名称相对应
		expect(firstItem.classes()).toContain('upload-success')
		expect(firstItem.get('.filename').text()).toBe(testFile.name)
	})
	it('上传失败', async () => {
		mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
		await wrapper.get('input').trigger('change')
		expect(mockedAxios.post).toHaveBeenCalledTimes(1)
		// expect(wrapper.get('button span').text()).toBe('正在上传')
		// 刷新所有未解决的已解决的Promise处理程序
		await flushPromises()
		expect(wrapper.get('button').text()).toBe('点击上传')
		// 列表长度增加，并且列表的最后一项有正确的 class 名
		expect(wrapper.findAll('li').length).toBe(2)
		const lastItem = wrapper.get('li:last-child')
		expect(lastItem.classes()).toContain('upload-error')
		// 点击列表中右侧的 button， 可以删除这一项
		await lastItem.get('.delete-icon').trigger('click')
		expect(wrapper.findAll('li').length).toBe(1)
	})
	it('自定义插槽', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { url: 'lalala.url' } })
		mockedAxios.post.mockResolvedValueOnce({ data: { url: 'xyz.url' } })
		const wrapper = mount(Upload, {
			props: {
				action: 'test.url'
			},
			slots: {
				default: '<button>button</button>',
				loading: '<div class="loading">loading</div>',
				uploaded: `<template #uploaded="{ uploadedData }">
					<div class="loaded">{{uploadedData.url}}</div>
				</template>`
			},
			global: {
				stubs: mockComponents
			}
		})

		expect(wrapper.get('button').text()).toBe('button')
		const fileInput = wrapper.get('input').element as HTMLInputElement
		setInputValue(fileInput)
		await wrapper.get('input').trigger('change')
		// expect(wrapper.get('.loading').text()).toBe('loading')
		await flushPromises()
		expect(wrapper.get('.loaded').text()).toBe('lalala.url')
		await wrapper.get('input').trigger('change')
		// expect(wrapper.get('.loading').text()).toBe('loading')
		await flushPromises()
		expect(wrapper.get('.loaded').text()).toBe('xyz.url')
	})

	it('before upload check', async () => {
		const callback = jest.fn()
		mockedAxios.post.mockResolvedValueOnce({ data: { url: 'wahaha.url' } })
		const checkFileSize = (file: File) => {
			if (file.size > 2) {
				callback()
				return false
			}
			return true
		}
		const wrapper = shallowMount(Upload, {
			props: {
				action: 'test.url',
				beforeUpload: checkFileSize
			}
		})
		const fileInput = wrapper.get('input').element as HTMLInputElement
		setInputValue(fileInput)
		await wrapper.get('input').trigger('change')
		expect(mockedAxios.post).not.toHaveBeenCalled()
		expect(wrapper.findAll('li').length).toBe(0)
		expect(callback).toHaveBeenCalled()
	})

	it('befor upload check using Promise', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { url: 'wahaha.url' } })
		const failedPromise = (file: File) => {
			return Promise.reject('wrong type')
		}
		const successPromise = (file: File) => {
			const newFile = new File([file], 'new_name.docx', { type: file.type })
			return Promise.resolve(newFile)
		}
		const wrapper = shallowMount(Upload, {
			props: {
				action: 'test.url',
				beforeUpload: failedPromise
			}
		})
		const fileInput = wrapper.get('input').element as HTMLInputElement
		setInputValue(fileInput)
		await wrapper.get('input').trigger('change')
		await flushPromises()
		expect(mockedAxios.post).not.toHaveBeenCalled()
		expect(wrapper.findAll('li').length).toBe(0)
		await wrapper.setProps({beforeUpload: successPromise})
		await wrapper.get('input').trigger('change')
		await flushPromises()
		expect(mockedAxios.post).toHaveBeenCalled()
		const firstItem = wrapper.get('li:first-child')
		expect(firstItem.classes()).toContain('upload-success')	
		expect(firstItem.get('.filename').text()).toBe('new_name.docx')
	})
	it('测试拖拽', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { url: 'dummy.url' } })
		const wrapper = shallowMount(Upload, {
			props: {
				action: 'test.url',
				drag: true
			}
		})
		const uploadArea = wrapper.get('.upload-area')
		await uploadArea.trigger('dragover')
		expect(uploadArea.classes()).toContain('is-dragover')
		await uploadArea.trigger('dragleave')
		expect(uploadArea.classes()).not.toContain('is-dragover')
		await uploadArea.trigger('drop', { dataTransfer: { files: [testFile] } })
		expect(mockedAxios.post).toHaveBeenCalled()
		await flushPromises()
		expect(wrapper.findAll('li').length)
	})
	afterEach(() => {
		mockedAxios.post.mockReset()
	})
})