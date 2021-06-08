<template>
	<component :is="tag" :style="styleProps" class="l-text-compoent">
		{{text}}
	</component>	
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { pick } from 'lodash-es'
export default defineComponent({
	name: 'l-text',
	props: {
		text: {
			type: String,
		},
		fontSize: {
			type: String,
		},
		tag: {
			type: String,
			default: 'div'
		}
	},
	setup (props) {
		const styleProps = computed(() => pick(props, ['fontSize']))
		return {
			styleProps
		}
	}
})
</script>

<style>

</style>