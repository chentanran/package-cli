<template>
	<div class="file-upload">
		<div class="isUploading" @click="triggerUpload">
			<slot v-if="isUploading" name="loading">
				<button disabled>正在上传</button>
			</slot>
			<slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data">
				<button>点击上传</button>
			</slot>
			<slot v-else name="default">
				<button>点击上传</button>
			</slot>
		</div>
		<input
			ref="fileInput"
			type="file"
			:style="{display: 'none'}"
			@change="handleFileChange"
		>
		<ul>
			<li
				:class="`uploaded-file upload-${file.status}`"
				v-for="file in uploadedFiles"
				:key="file.uid"
			>
				<span class="filename">{{file.name}}</span>
				<button class="delete-icon" @click="removeFile(file.uid)">Del</button>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, PropType } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { last } from 'lodash-es'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckUpload = (file: File) => boolean | Promise<File>
export interface UploadFile {
	uid: string;
	size: number;
	name: string;
	status: UploadStatus;
	raw: File;
	resp?: any;
}

export default defineComponent({
	props: {
		action: {
			type: String,
			required: true
		},
		beforeUpload: {
			type: Function as PropType<CheckUpload>
		}
	},
	setup(props) {
		const fileInput = ref<null | HTMLInputElement>(null)
		// const fileStatus = ref<UploadStatus>('ready')
		const uploadedFiles = ref<UploadFile[]>([])

		const isUploading = computed(() => {
			return uploadedFiles.value.some(file => file.status === 'loading')
		})

		const lastFileData = computed(() => {
			const lastFile = last(uploadedFiles.value)
			if (lastFile) {
				return {
					loaded: lastFile.status === 'success',
					data: lastFile.resp
				}
			}
			return false
		})

		const removeFile = (id: string) => {
			uploadedFiles.value = uploadedFiles.value.filter(item => item.uid !== id)
			console.log(uploadedFiles.value[0], '-------', id)
		}

		const triggerUpload = () => {
			if (fileInput.value) {
				fileInput.value.click()
			}
		}

		const postFile = (uploadFile: File) => {
			const formData = new FormData()
				formData.append(uploadFile.name, uploadFile)
				const fileObj = reactive<UploadFile>({
					uid: uuidv4(),
					size: uploadFile.size,
					name: uploadFile.name,
					status: 'loading',
					raw: uploadFile
				})
				uploadedFiles.value.push(fileObj)
				// fileStatus.value = 'loading'
				axios.post(props.action, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then(resp => {
					// fileStatus.value = 'success'
					fileObj.status = 'success'
					fileObj.resp = resp.data
					console.log(resp.data)
				}).catch(() => {
					// fileStatus.value = 'error'
					fileObj.status = 'error'
				}).finally(() => {
					if (fileInput.value) {
						fileInput.value.value = ''
					}
				})
		}

		const handleFileChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const files = target.files
			if (files) {
				const uploadFile = files[0]
				if (props.beforeUpload) {
					const result = props.beforeUpload(uploadFile)
					if (result && result instanceof Promise) {
						result.then(processedFile => {
							if (processedFile instanceof File) {
								postFile(processedFile)
							} else {
								throw new Error('beforeupload Promise 应该返回一个文件对象')
							}
						}).catch(e => {
							console.error(e)
						})
					} else if (result === true) {
						postFile(uploadFile)
					}
				} else {
					postFile(uploadFile)
				}
			}
		}

		return {
			triggerUpload,
			fileInput,
			// fileStatus,
			handleFileChange,
			isUploading,
			uploadedFiles,
			removeFile,
			lastFileData
		}
	}
})
</script>

<style>
	.upload-loading {
		color: yellow;
	}
	.upload-success {
		color: green;
	}
	.upload-error {
		color: red;
	}
</style>