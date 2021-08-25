/**
 * @desc 通过传入的容器选择器或者容器元素，返回容器
 * 
*/
function getEle(el: boxEle): boxEle {
    let _el: boxEle;
    if (typeof el === 'string') {
        _el = document.querySelector(el)! as HTMLElement;
    }else {
        _el = el;
    }
    return _el
}


function createEl(tag: string): HTMLElement {
    return document.createElement(tag);
}

const barStyle = {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '10px',
    height: '30%',
    background: 'rgba(102, 204, 255, .6)',
    'border-radius': '10px',
    transfrom: 'translateY(0)'
}

const listStyle: style = {
    margin: 0,
    padding: 0,
    position: 'relative'
}

const itemStyle: style = {
    'list-style': 'none',
    padding: '0 5px',
    height: '30px',
    position: 'absolute',
    left: 0
}

export default function generateScroll(ele: boxEle, options: optionsData): void {
    const el = getEle(ele) as HTMLElement;
    const data = options.data;
    const h = options.h || 30;
    if (!data || !data.length) {
        console.warn('请输入数据');
        return ;
    }
    const listbox = createEl('ul');
    listbox.className = 'scroll-list-box';
    const bar = createEl('div');
    bar.className = 'scroll-bar';
    Object.assign(bar.style, barStyle);
    listStyle.height = h * data.length + 'px';
    Object.assign(listbox.style, listStyle);
    el.appendChild(listbox);
    el.appendChild(bar);

    data.slice(0, 20).forEach((item, i) => {
        const el = createEl('li');
        el.innerText = item + '';
        el.style.top = i * h + 'px';
        Object.assign(el.style, itemStyle);
        listbox.appendChild(el);
    })

}