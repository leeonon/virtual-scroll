import { ReactElement } from "react"
// import {styles} from './virtualScroll.module.scss';

type dataVal = HTMLElement | number | string;
export default function virtualScroll(options: dataVal[]): ReactElement {
    return <div className="scroll-list-container-box">
        <ul className="scroll-list-box">
            {options.map(item => {
                return <li className="item">{item}</li>
            })}
        </ul>
    </div>
}
