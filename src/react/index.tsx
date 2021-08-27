import * as ReactDOM from 'react-dom';
import * as React from 'react'
import VirtualScroll from './virtual-scroll';

type dataVal = HTMLElement | number | string;
type listOptions = {
    data: dataVal[],
    h?: number;
}
const options: listOptions = {
    data: Array.from('0'.repeat(1000), (item, i) => i + 1),
    h: 30
}
ReactDOM.render(<VirtualScroll options={options} />, document.getElementById('app'));
