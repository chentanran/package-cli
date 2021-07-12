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
		// 刷新所有未解决的已解决的Promise处理程序
		await flushPromises()
		expect(wrapper.get('button span').text()).toBe('上传成功')
	})
	it('上传失败', async () => {
		mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
		await wrapper.get('input').trigger('change')
		expect(mockedAxios.post).toHaveBeenCalledTimes(2)
		// expect(wrapper.get('button span').text()).toBe('正在上传')
		// 刷新所有未解决的已解决的Promise处理程序
		await flushPromises()
		expect(wrapper.get('button span').text()).toBe('上传失败')
	})
})