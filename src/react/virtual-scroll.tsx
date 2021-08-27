import React, { ReactElement, useEffect, useRef, useState } from "react"
import styles from './virtualScroll.module.scss';

type dataVal = HTMLElement | number | string;
type listOptions = {
    data: dataVal[],
    h?: number;
}
export default function virtualScroll(props: {options: listOptions}): ReactElement {
    const {options} = props;
    const data = options.data;
    const h = options.h || 30;
    const sumH = h * data.length;
    const [base, setBase] = useState(0);
    const [list, setList] = useState(getShowData(base, data));
    const bar = useRef(null);
    const scrollDeal = (eve) => {
        const scroll_v = eve.target.scrollTop;
        const per = scroll_v / sumH;
        const box_h = 400;
        const translate_y = box_h * per;
        bar.current.style.transform = `translateY(${translate_y}px)`;
        const base_num = Math.floor(scroll_v / h);
        // setBase(base_num);
        setList(getShowData(base_num, data));
    }

    return <div style={{height: '100%', overflow: "hidden", position: 'relative'}}>
        <div className={styles["scroll-list-container-box"]} onScroll={scrollDeal}>
            <ul className={styles["scroll-list-box"]} style={{height: sumH + 'px'}}>
                {list.map((item,i) => {
                return <li className={styles["item"]} key={item + '-' + i} style={{height: h + 'px', top: ((item as number) - 1) * h + 'px'}}>{item}</li>
            })}
        </ul>
        </div>
        <div className={styles["scroll-bar"]} ref={bar}></div>
    </div>
}

function getShowData(base: number, data: dataVal[]): dataVal[] {
    base -= base;
    if (base < 0) {
        base = 0
    }
    return data.slice(base, base + 20);
}
