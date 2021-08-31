<template>
	<div class="virtual-box">
		<virtual-scroll :height="h" :data="data" />
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import virtualScroll from './virtual-scroll.vue';
export default defineComponent({
	components: {
		virtualScroll,
	},
	setup() {
		const h = ref(35);
		const data = reactive(Array.from('0'.repeat(1000), (item, i) => i + 1));
		return {
			h,
			data,
		};
	},
});
</script>
<style lang="scss" scoped>
.virtual-box {
	height: 100%;
}
</style>
