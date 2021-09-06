import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { getStyle } from '../utils/getStyle';
import styles from './virtualScroll.module.scss';

type dataVal = HTMLElement | number | string;
type listVal = dataVal[];
type listOptions = {
	data: listVal;
	h?: number;
};
export default function virtualScroll(props: { options: listOptions }): ReactElement {
	const { options } = props;
	const data = options.data;
	const h = options.h || 30;
	let sumH = h * data.length;
	const [base, setBase] = useState(0);
	const bar = useRef(null);
	const box = useRef(null);
	let box_h: number;
	let bar_h: number;
	useEffect(() => {
		const box_h_v = getStyle(box.current, 'height') as string;
		const bar_h_v = getStyle(bar.current, 'height') as string;
		box_h = parseInt(box_h_v);
		bar_h = parseInt(bar_h_v);
		sumH -= box_h;
	});

	const scrollDeal = (eve: any) => {
		const scroll_v = eve.target.scrollTop;
		const per = scroll_v / sumH;
		const translate_y = (box_h - bar_h) * per;
		bar.current.style.transform = `translateY(${translate_y}px)`;
		const base_num = Math.floor(scroll_v / h);
		setBase(base_num);
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
			<div className={styles['scroll-bar']} ref={bar}></div>
		</div>
	);
}

function getShowData(base: number, data: listVal): listVal {
	base -= base;
	if (base < 0) {
		base = 0;
	}
	return data.slice(base, base + 20);
}
