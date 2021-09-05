<template>
	<div class="file-upload">
		<div 
			class="upload-area"
			:class="{ 'is-dragover': drag && isDragOver }"
			v-on="events"
		>
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
		<ul :class="`upload-list upload-list-${listType}`" v-if="showUploadList">
			<li
				:class="`uploaded-file upload-${file.status}`"
				v-for="file in filesList"
				:key="file.uid"
			>
				<img
					v-if="file.url && listType === 'picture'"
					class="upload-list-thumbnail"
					:src="file.url"
					:alt="file.name"
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
type FileListType = 'picture' | 'text'
type CheckUpload = (file: File) => boolean | Promise<File>
export interface UploadFile {
	uid: string;
	size: number;
	name: string;
	status: UploadStatus;
	raw: File;
	resp?: any;
	url?: string;
}

export default defineComponent({
	props: {
		action: {
			type: String,
			required: true
		},
		beforeUpload: {
			type: Function as PropType<CheckUpload>
		},
		onProgress: {
			type: Function as PropType<(file: File) => void>
		},
		onSuccess: {
			type: Function as PropType<(res: any, file: UploadFile, fileList: UploadFile[]) => void>
		},
		onError: {
			type: Function as PropType<(e: Error, file: UploadFile, fileList: UploadFile[]) => void>
		},
		onChange: {
			type: Function as PropType<(file: File | UploadFile, fileList: File[] | UploadFile[]) => void>
		},
		drag: {
			type: Boolean,
			default: false
		},
		autoUpload: {
			type: Boolean,
			default: true
		},
		listType: {
			type: String as PropType<FileListType>,
			default: 'picture'
		},
		showUploadList: {
			type: Boolean,
			default: true
		}
	},
	setup(props) {
		const fileInput = ref<null | HTMLInputElement>(null)
		// const fileStatus = ref<UploadStatus>('ready')
		const filesList = ref<UploadFile[]>([])
		const isDragOver = ref(false)

		const isUploading = computed(() => {
			return filesList.value.some(file => file.status === 'loading')
		})

		const lastFileData = computed(() => {
			const lastFile = last(filesList.value)
			if (lastFile) {
				return {
					loaded: lastFile.status === 'success',
					data: lastFile.resp
				}
			}
			return false
		})

		const removeFile = (id: string) => {
			filesList.value = filesList.value.filter(item => item.uid !== id)
			// console.log(filesList.value[0], '-------', id)
		}

		const triggerUpload = () => {
			if (fileInput.value) {
				fileInput.value.click()
			}
		}

		const postFile = (readyFile: UploadFile) => {
			const formData = new FormData()
				formData.append(readyFile.name, readyFile.raw)
				readyFile.status = 'loading'
				axios.post(props.action, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					onUploadProgress: function (progressEvent) {
						if (props.onProgress) {
							props.onProgress(progressEvent)
						}
					}
				}).then(resp => {
					// fileStatus.value = 'success'
					readyFile.status = 'success'
					readyFile.resp = resp.data
					// console.log(resp.data)
					if (props.onSuccess) {
						props.onSuccess(resp.data, readyFile, filesList.value)
					}
					if (props.onChange) {
						props.onChange(readyFile, filesList.value)
					}
				}).catch((e) => {
					// fileStatus.value = 'error'
					readyFile.status = 'error'
					if (props.onError) {
						props.onError(e, readyFile, filesList.value)
					}
					if (props.onChange) {
						props.onChange(readyFile, filesList.value)
					}
				}).finally(() => {
					if (fileInput.value) {
						fileInput.value.value = ''
					}
				})
		}

		const addFileToList = (uploadFile: File) => {
			const fileObj = reactive<UploadFile>({
					uid: uuidv4(),
					size: uploadFile.size,
					name: uploadFile.name,
					status: 'ready',
					raw: uploadFile
				})
				if (props.listType === 'picture') {
					// try {
					// 	fileObj.url = URL.createObjectURL(uploadFile)
					// } catch (err) {
					// 	console.log('upload File error', err)
					// }
					const fileReader = new FileReader()
					fileReader.readAsDataURL(uploadFile)
					fileReader.addEventListener('load', () => {
						fileObj.url = fileReader.result as string
					})
				}
				filesList.value.push(fileObj)
				if (props.autoUpload) {
					postFile(fileObj)
				}
		}

		const beforeUploadCheck = (files: null | FileList) => {
			if (files) {
				const uploadFile = files[0]
				if (props.onChange) {
					props.onChange(uploadFile, Array.from(files))
				}
				if (props.beforeUpload) {
					const result = props.beforeUpload(uploadFile)
					if (result && result instanceof Promise) {
						result.then(processedFile => {
							if (processedFile instanceof File) {
								addFileToList(processedFile)
							} else {
								throw new Error('beforeupload Promise 应该返回一个文件对象')
							}
						}).catch(e => {
							console.error(e)
						})
					} else if (result === true) {
						addFileToList(uploadFile)
					}
				} else {
					addFileToList(uploadFile)
				}
			}
		}

		const uploadFiles = () => {
			filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
		}

		let events: { [key: string]: (e: any) => void } = {
			'click': triggerUpload
		}

		const handleFileChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			beforeUploadCheck(target.files)
		}

		const handleDrag = (e: DragEvent, over: boolean) => {
			e.preventDefault()
			isDragOver.value = over
		}

		const handleDrop = (e: DragEvent) => {
			e.preventDefault()
			isDragOver.value = false
			if (e.dataTransfer) {
				beforeUploadCheck(e.dataTransfer.files)
			}
		}

		if (props.drag) {
			events = {
				...events,
				'dragover': (e: DragEvent) => { handleDrag(e, true) },
				'dragleave': (e: DragEvent) => { handleDrag(e, false) },
				'drop': handleDrop
			}
		}

		return {
			triggerUpload,
			fileInput,
			// fileStatus,
			handleFileChange,
			isUploading,
			filesList,
			removeFile,
			lastFileData,
			isDragOver,
			events,
			uploadFiles
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
	.upload-list-thumbnail {
		height: 200px;
		width: 200px;
	}
</style>