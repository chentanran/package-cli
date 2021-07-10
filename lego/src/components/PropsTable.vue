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
					:[value.valueProp]="value.value"
					v-bind="value.extraProps"
					v-on="value.events"
				>
					<template v-if="value.options">
						<component
							:is="value.subComponent"
							v-for="(option, k) in value.options"
							:value="option.value"
							:key="k"
						>
							<render-vnode :vNode="option.text"></render-vnode>
						</component>
					</template>
				</component>	
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, VNode } from 'vue'
import { reduce } from 'lodash'
import { mapPropsToForms } from '../propsMap'
import { TextComponentProps } from '../defaultProps'
import RenderVnode from './RenderVnode'
import ColorPicker from './ColorPicker.vue'

interface FormProps {
	component: string;
	subComponent?: string;
	value?: string;
	extraProps?: { [key: string]: any };
	text?: string;
	options?: { text: string | VNode; value: any }[];
	valueProp: string;
	eventName: string;
	events: { [key: string]: (e: any) => void };
}

export default defineComponent({
	name: 'props-table',
	props: {
		props: {
			type: Object as PropType<TextComponentProps>
		}
	},
	components: { RenderVnode, ColorPicker },
	emits: ['change'],
	setup(props, context) {
		const finalProps = computed(() => {
			return reduce(props.props, (result, value, key) => {
				const newKey = key as keyof TextComponentProps
				const item = mapPropsToForms[newKey]
				if (item) {
					const { valueProp = 'value', eventName = 'change', initalTransform, afterTransform } = item
					const newItem: FormProps = {
						...item,
						valueProp,
						eventName,
						value: initalTransform ? initalTransform(value) : value,
						events: {
							[eventName]: (e: any) => { context.emit('change', { key, value: afterTransform ? afterTransform(e) : e }) }
						}
					}
					result[newKey] = newItem
				}
				return result
			}, {} as { [key: string]: FormProps })
		})

		return {
			finalProps
		}
	}
})
</script>

<style>

</style>