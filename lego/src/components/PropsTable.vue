<template>
	<div class="props-table">
		<div
			v-for="(value, key) in finalProps"
			:key="key"
			class="prop-item"
		>
			<span class="label" v-if="value.text">{{value.text}}</span>
			<div class="prop-component">
				<component
					v-if="value"
					:is="value.component"
					:value="value.value"
					v-bind="value.extraProps"
				>
					<template v-if="value.options">
						<component
							:is="value.subComponent"
							v-for="(option, k) in value.options"
							:value="option.value"
							:key="k"
						>
							{{option.text}}
						</component>
					</template>
				</component>	
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { reduce } from 'lodash'
import { PropsToForms, mapPropsToForms } from '../propsMap'
import { TextComponentProps } from '../defaultProps'

export default defineComponent({
	name: 'props-table',
	props: {
		props: {
			type: Object as PropType<TextComponentProps>
		}
	},
	setup(props) {
		const finalProps = computed(() => {
			return reduce(props.props, (result, value, key) => {
				const newKey = key as keyof TextComponentProps
				const item = mapPropsToForms[newKey]
				if (item) {
					item.value = item.initalTransform ? item.initalTransform(value) : value
					result[newKey] = item
				}
				return result
			}, {} as Required<PropsToForms>)
		})

		return {
			finalProps
		}
	}
})
</script>

<style>

</style>