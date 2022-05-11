/**
 * @desc 获取指定元素的样式
 * @param {HTMLElement} el 需要获取样式的元素
 * @param {string} attr 需要获取值的属性
 * @returns {CSSStyleDeclaration | string | number} 返回元素的样式集合或者指定的样式值
 */
export function getStyle(el: HTMLElement | null, attr?: string): CSSStyleDeclaration | string | number {
	if (!el) {
		return '';
	}
	const style = window.getComputedStyle(el, null);
	if (attr) {
		return style[attr as any];
	}
	return style;
}
