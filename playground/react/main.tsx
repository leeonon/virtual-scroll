import * as ReactDOM from 'react-dom/client';
import VirtualScroll from '../../packages/react/virtual-scroll';

type dataVal = HTMLElement | number | string;
type listOptions = {
	data: dataVal[];
	h?: number;
};
const options: listOptions = {
	data: Array.from('0'.repeat(1000), (item, i) => i + 1),
	h: 30,
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<VirtualScroll options={options} />);
