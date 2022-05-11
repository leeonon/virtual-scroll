type boxEle = HTMLElement | string | null;
type newStyle = Record<string, string | number>;
type style = newStyle;
type dataVal = HTMLElement | number | string;
type optionsData = {
	data: dataVal[];
	h: number;
};
/**
 * @desc 通过传入的容器选择器或者容器元素，返回容器
 * @param {boxEle} el 生成虚拟列表的容器元素或者其对应的选择器
 * @returns {boxEle} 返回容器
 */
function getEle(el: boxEle): boxEle {
	let _el: boxEle;
	if (typeof el === 'string') {
		_el = document.querySelector(el)! as HTMLElement;
	} else {
		_el = el;
	}
	return _el;
}
/**
 * @desc 通过标签名创建HTML元素
 * @param {string} tag 需要创建标签的名字
 * @returns {HTMLElement} 创建的元素
 */
function createEl(tag: string): HTMLElement {
	return document.createElement(tag);
}

const barStyle: newStyle = {
	position: 'absolute',
	right: 0,
	top: 0,
	zIndex: 10,
	width: '10px',
	height: '30%',
	cursor: 'pointer',
	background: 'rgba(102, 204, 255, .6)',
	'border-radius': '10px',
	transfrom: 'translateY(0px)',
};
const barBoxStyle: newStyle = {
	position: 'absolute',
	right: 0,
	top: 0,
	bottom: 0,
	zIndex: 10,
	width: '10px',
	background: 'none',
};

const listboxStyle: newStyle = {
	height: '100%',
	overflow: 'auto',
};

const listStyle: newStyle = {
	margin: 0,
	padding: 0,
	position: 'relative',
	'user-select': 'none',
};

const itemStyle: newStyle = {
	'list-style': 'none',
	padding: '0 5px',
	height: '30px',
	position: 'absolute',
	left: 0,
	overflow: 'hidden',
	'text-overflow': 'ellipsis',
	'white-space': 'no-wrap',
};

let data: dataVal[];
/**
 * @desc 生成虚拟滚动列表
 * @param {boxEle} ele 虚拟列表的容器
 * @param {optionsData} options 列表元素的相关数据
 * @returns {void}
 */
export default function generateScroll(ele: boxEle, options: optionsData): void {
	const el = getEle(ele) as HTMLElement;
	data = options.data;
	const h = options.h || 30;
	if (!data || !data.length) {
		console.warn('请输入数据');
		return;
	}
	// 包含总长度的div元素
	const listbox = generateEle('div', 'scroll-list-container-box', listboxStyle);

	// 所有内容高度的滚动区域
	listStyle.height = h * data.length + 'px';
	const list = generateEle('ul', 'scroll-list-box', listStyle);

	// 滚动条
	const barBox = generateEle('div', 'scroll-bar-box', barBoxStyle);
	const bar = generateEle('div', 'scroll-bar', barStyle);

	listbox.appendChild(list);
	barBox.appendChild(bar);
	el.appendChild(listbox);
	el.appendChild(barBox);

	const frag = generateItems(0, h);
	list.appendChild(frag);

	dealScroll(listbox, bar, h, h * data.length);
	// 给滚动条绑定点击拖拽事件
	bindDragScroll(listbox, bar, h, h * data.length);
	// 给滚动条父元素绑定点击事件
	bindClick(barBox, bar, listbox, h * data.length);
}

/**
 * @desc 根据标签名生成对应的元素，并添加对应的样式
 * @param {string} tag 生成的标签名
 * @param {string} name 生成的标签的class名字
 * @param {style} style 自定义的样式对象
 * @returns {HTMLElement} 返回创建的元素
 */
function generateEle(tag = 'div', name: string, style: style): HTMLElement {
	const el = createEl(tag);
	el.className = name;
	Object.assign(el.style, style);
	return el;
}

/**
 * @desc 监听鼠标滚动事件来处理侧边栏以及展示数据的处理
 * @param {HTMLElement} el 容器元素
 * @param {HTMLElement} bar 滚动条元素
 * @param {number} h 每个滚动元素的高度
 * @param {number} sumH 容器的总高度
 * @returns {void}
 */
function dealScroll(el: HTMLElement, bar: HTMLElement, h: number, sumH: number): void {
	const box_h = parseInt(getStyle(el, 'height') as any);
	const bar_h = parseInt(getStyle(bar, 'height') as any);
	sumH = sumH - box_h;
	el.addEventListener('scroll', function () {
		const scroll_v = el.scrollTop;
		if (isAutoScroll) {
			const per = scroll_v / sumH;
			const translate_y = (box_h - bar_h) * per;
			bar.style.transform = `translateY(${translate_y}px)`;
		}
		const base_num = Math.floor(scroll_v / h);
		const frag = generateItems(base_num, h);
		const list_el = el.firstChild as HTMLElement;
		// console.log(list_el)
		list_el.innerHTML = '';
		list_el.appendChild(frag);
		// console.log(frag)
	});
}

/**
 * @desc 根据滚动的高度自动生成视图区域内展示的数据
 * @param {number} base 当前展示在视图区域内的第一个元素在所有数据中的下标
 * @param {number} h 每条数据的高度
 * @returns {DocumentFragment} 包含所有视图区域内元素的文档碎片
 */
function generateItems(base: number, h: number): DocumentFragment {
	base -= 2;
	if (base <= 0) {
		base = 0;
	}
	const frag = document.createDocumentFragment();
	data.slice(base, base + 20).forEach((item, i) => {
		const el = createEl('li');
		el.innerText = item + '';
		i = (item as number) - 1;
		el.style.top = i * h + 'px';
		Object.assign(el.style, itemStyle);
		frag.appendChild(el);
	});
	return frag;
}

// 是否是默认鼠标滚动
let isAutoScroll = true;
/**
 * @desc 滚动条拖拽事件
 * @param {HTMLElement} el 包裹滚动列表的元素
 * @param {HTMLElement} bar 滚动条
 * @param {Number} h 每一个元素的高度
 * @param {Number} sumH 列表总高度
 * @returns {void}
 */
function bindDragScroll(el: HTMLElement, bar: HTMLElement, h: number, sumH: number): void {
	let isCanMove = false;
	let initY: number;
	let translate_y = 0;
	const box_h = parseInt(getStyle(el, 'height') as any);
	const bar_h = parseInt(getStyle(bar, 'height') as any);
	sumH = sumH - box_h;
	bar.addEventListener('click', e => {
		e.stopPropagation();
	});
	bar.addEventListener('mousedown', e => {
		isCanMove = true;
		isAutoScroll = false;
		initY = e.clientY;
		const t_y = bar.style.transform;
		const t_y_Rxp = /translateY\((\d+\.?(\d+)?)px\)/;
		if (t_y.match(t_y_Rxp)) {
			translate_y = Number(RegExp.$1);
		}
	});
	document.addEventListener('mousemove', e => {
		if (isCanMove) {
			const diffY = e.clientY - initY;
			let v = translate_y + diffY;
			const per = v / (box_h - bar_h);
			if (v < 0) {
				v = 0;
			} else if (v > box_h - bar_h) {
				v = box_h - bar_h;
			}
			const scroll_y = per * sumH;
			el.scrollTop = scroll_y;
			bar.style.transform = `translateY(${v}px)`;
		}
	});
	document.addEventListener('mouseup', e => {
		isCanMove = false;
		isAutoScroll = true;
	});
}

/**
 * @desc 给侧边滚动条父元素绑定点击事件，让滚动条滚动到指定的位置
 * @param {HTMLElement} el 容器元素
 * @param {HTMLElement} bar 滚动条元素
 * @param {HTMLElement} listbox 虚拟列表的父容器
 * @param {number} sumH 容器的高度
 * @returns {void}
 */
function bindClick(el: HTMLElement, bar: HTMLElement, listbox: HTMLElement, sumH: number): void {
	const box_h = parseInt(getStyle(el, 'height') as any);
	const bar_h = parseInt(getStyle(bar, 'height') as any);
	sumH = sumH - box_h;
	el.addEventListener('click', (e: MouseEvent) => {
		const h = bar_h / 2;
		let y = e.offsetY - h;
		if (y < 0) {
			y = 0;
		}
		if (y > box_h - bar_h) {
			y = box_h - bar_h;
		}
		const per = y / (box_h - bar_h);
		const scroll_y = sumH * per;
		bar.style.transform = `translateY(${y}px)`;
		listbox.scrollTop = scroll_y;
	});
}

/**
 * @desc 获取指定元素的样式
 * @param {HTMLElement} el 需要获取样式的元素
 * @param {string} tag 指定获取的样式属性
 * @returns {CSSStyleDeclaration | string | number} 返回样式集合或指定的样式值
 */
function getStyle(el: HTMLElement, tag?: string): CSSStyleDeclaration | string | number {
	if (!el) {
		return '';
	}
	const style = window.getComputedStyle(el, null);
	if (tag) {
		return style[tag as any];
	}
	return style;
}
