import type { FC, ReactNode } from 'react';

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { getStyle } from './getStyle';
import styles from './virtualScroll.module.scss';

type dataVal = ReactNode | number | string;
type listVal = dataVal[];
type listOptions = {
	data: listVal;
	h?: number;
};

interface IVirtualScrollProps {
	options: listOptions
}

const VirtualScroll: FC<IVirtualScrollProps> = ({ options }) => {
	const data = options.data;
	const h = options.h || 30;
	let sumH = h * data.length;
	const [base, setBase] = useState(0);
	const bar = useRef<HTMLDivElement>(null);
	const box = useRef<HTMLDivElement>(null);
	let box_h: number;
	let bar_h: number;
	useEffect(() => {
		const box_h_v = getStyle(box.current, 'height') as string;
		const bar_h_v = getStyle(bar.current, 'height') as string;
		box_h = parseInt(box_h_v);
		bar_h = parseInt(bar_h_v);
		sumH -= box_h;
		document.addEventListener('mousemove', docMouseMove);
		document.addEventListener('mouseup', docMouseUp);
		return () => {
			document.removeEventListener('mousemove', docMouseMove);
			document.removeEventListener('mouseup', docMouseUp);
		};
	}, []);

	const scrollDeal = (eve: any) => {
		const scroll_v = eve.target.scrollTop;
		if (isAutoScroll) {
			const per = scroll_v / sumH;
			const translate_y = (box_h - bar_h) * per;
			if (bar?.current) {
			  bar.current.style.transform = `translateY(${translate_y}px)`;
			}
		}
		const base_num = Math.floor(scroll_v / h);
		setBase(base_num);
	};

	// 拖拽滚动条实现列表一致
	const [isCanMove, setIsCanMove] = useState(false);
	const [initY, setInitY] = useState(0);
	const [translate_y, setTranslate_y] = useState(0);
	const [isAutoScroll, setIsAutoScroll] = useState(true);
	const scrollBarDown = (e: any) => {
		setIsCanMove(true);
		setIsAutoScroll(false);
		setInitY(e.clientY);
		const el = bar.current;
		const t_y = el?.style.transform;
		const t_y_Rxp = /translateY\((\d+\.?(\d+)?)px\)/;
		if (t_y?.match(t_y_Rxp)) {
			setTranslate_y(Number(RegExp.$1));
		}
	};
	const docMouseMove = (e: MouseEvent) => {
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
			if (box.current) {
				box.current.scrollTop = scroll_y;
			}
			if (bar.current) {
				bar.current.style.transform = `translateY(${v}px)`;
			}
		}
	};
	const docMouseUp = () => {
		setIsCanMove(false);
		setIsAutoScroll(true);
	};
	return (
		<div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
			<div className={styles['scroll-list-container-box']} onScroll={scrollDeal} ref={box}>
				<ul className={styles['scroll-list-box']} style={{ height: sumH + 'px' }}>
					{data.slice(base, base + 20).map((item, i) => {
						return (
							<li
								className={styles['item']}
								key={item + '-' + i}
								style={{ height: h + 'px', top: ((item as number) - 1) * h + 'px' }}
							>
								{item}
							</li>
						);
					})}
				</ul>
			</div>
			<div className={styles['scroll-bar']} ref={bar} onMouseDown={scrollBarDown}></div>
		</div>
	);
}

export default VirtualScroll;

function getShowData(base: number, data: listVal): listVal {
	base -= base;
	if (base < 0) {
		base = 0;
	}
	return data.slice(base, base + 20);
}
