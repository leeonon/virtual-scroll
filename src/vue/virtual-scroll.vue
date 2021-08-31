<template>
	<div class="container">
		<div class="scroll-list-container-box" @scroll="scrollDeal">
			<ul class="scroll-list-box" :style="{ height: sumHeight + 'px' }">
				<li class="item" v-for="(item, i) in list" :key="item + '-' + i" :style="itemStyle(item)">
					{{ item }}
				</li>
			</ul>
		</div>
		<div class="scroll-bar" ref="bar"></div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

function getShowData(base: number, data: Array<any>): Array<any> {
	base -= base;
	if (base < 0) {
		base = 0;
	}
	return data.slice(base, base + 20);
}

export default defineComponent({
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		height: {
			type: Number,
			default: 30,
		},
	},
	setup(props) {
		let { height, data } = props;
		const base = ref(0);
		const sumHeight = ref(data.length * height);
		const list = computed(() => {
			// const _list = getShowData(base.value, data); // 这样直接调用 getShowData无效？
			const _list = data.slice(base.value, base.value + 20);
			return _list;
		});
		const h = ref(height);
		const bar = ref(null);
		const itemStyle = (item: any) => {
			return {
				height: height + 'px',
				top: ((item as number) - 1) * height + 'px',
			};
		};

		const scrollDeal = (eve: any) => {
			const scroll_v = eve.target.scrollTop;
			const per = scroll_v / sumHeight.value;
			const box_h = 400;
			const translate_y = box_h * per;
			const el = bar.value! as HTMLElement;
			el.style.transform = `translateY(${translate_y}px)`;
			const base_num = Math.floor(scroll_v / height);
			base.value = base_num;
			// const _list = data.slice(base_num, base_num + 20);
			// list.values = _list as any;
			// console.log(list.values);
		};
		return {
			list,
			h,
			base,
			sumHeight,
			itemStyle,
			scrollDeal,
			bar,
		};
	},
});
</script>
<style lang="scss" scoped>
.container {
	height: 100%;
	overflow: hidden;
	position: relative;
	.scroll-list-container-box {
		height: 100%;
		overflow: auto;
		position: relative;
		&::-webkit-scrollbar,
		&::-webkit-scrollbar-thumb,
		&::-webkit-scrollbar-track {
			width: 0;
			height: 0;
			display: none;
		}
		.scroll-list-box {
			margin: 0;
			padding: 0;
			position: relative;
			.item {
				list-style: none;
				padding: 0 5px;
				position: absolute;
				left: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: no-wrap;
				box-sizing: border-box;
			}
		}
	}
	.scroll-bar {
		position: absolute;
		top: 0;
		right: 0;
		width: 10px;
		height: 30%;
		border-radius: 10px;
		background: rgba(102, 204, 255, 0.6);
		transform: translateY(0);
	}
}
</style>
