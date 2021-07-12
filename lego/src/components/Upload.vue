<template>
	<div class="file-upload">
		<button @click="triggerUpload">
			<span v-if="fileStatus === 'loading'">正在上传</span>
			<span v-else-if="fileStatus === 'success'">上传成功</span>
			<span v-else-if="fileStatus === 'error'">上传失败</span>
			<span v-else>点击上传</span>
		</button>
		<input
			ref="fileInput"
			type="file"
			:style="{display: 'none'}"
			@change="handleFileChange"
		>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

export default defineComponent({
	props: {
		action: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const fileInput = ref<null | HTMLInputElement>(null)
		const fileStatus = ref<UploadStatus>('ready')
		const triggerUpload = () => {
			if (fileInput.value) {
				fileInput.value.click()
			}
		}

		const handleFileChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const files = target.files
			if (files) {
				const uploadFile = files[0]
				const formData = new FormData()
				formData.append(uploadFile.name, uploadFile)
				fileStatus.value = 'loading'
				axios.post(props.action, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then(resp => {
					fileStatus.value = 'success'
					console.log(resp.data)
				}).catch(() => {
					fileStatus.value = 'error'
				})
			}
		}

		return {
			triggerUpload,
			fileInput,
			fileStatus,
			handleFileChange
		}
	}
})
</script>

<style>

</style>