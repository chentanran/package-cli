<template>
	<div class="create-component-list">
		<div v-for="(item, index) in list" :key="index" class="component-item" @click="onItemClick(item)">
			<l-text v-bind="item"></l-text>
		</div>
	</div>
	<StyledUploader @success="onImageUploaded"></StyledUploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import LText from './LText.vue'
import StyledUploader from '../components/StyledUpload.vue'
import { ComponentData } from '../store/editor'
import { imageDefaultProps, TextComponentProps } from '../defaultProps'
import { UploadResp } from '../extraType'
import { getImageDimensions } from '../helper'

export default defineComponent({
	name: 'components-list',
	props: {
		list: {
			type: Array,
			required: true
		}
	},
	emits: ['on-item-click'],
	components: {
		LText,
		StyledUploader
	},
	setup(props, context) {
		const onItemClick = (data: any) => {
			context.emit('on-item-click', data)
		}
		const onImageUploaded = (data: { resp: UploadResp; file: File }) => {
      const { resp, file } = data
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功')
      componentData.props.src = resp.data.url
      getImageDimensions(file).then(({ width }) => {
        console.log(width)
        const maxWidth = 373
        componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
        context.emit('on-item-click', componentData)
      })
    }
		return {
			onItemClick,
			onImageUploaded
		}
	}
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>