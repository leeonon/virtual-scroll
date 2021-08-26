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

const listboxStyle = {
    height: '100%',
    overflow: 'auto'
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
    left: 0,
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'no-wrap'
}

let data: dataVal[];
export default function generateScroll(ele: boxEle, options: optionsData): void {
    const el = getEle(ele) as HTMLElement;
    data = options.data;
    const h = options.h || 30;
    if (!data || !data.length) {
        console.warn('请输入数据');
        return ;
    }
    const list = createEl('ul');
    list.className = 'scroll-list-box';
    const listbox = createEl('div');
    listbox.className = 'scroll-list-container-box';
    const bar = createEl('div');
    bar.className = 'scroll-bar';
    Object.assign(bar.style, barStyle);

    listStyle.height = h * data.length + 'px';
    Object.assign(list.style, listStyle);
    
    Object.assign(listbox.style, listboxStyle);
    listbox.appendChild(list);
    el.appendChild(listbox);
    el.appendChild(bar);

    const frag = generateItems(0, h);
    list.appendChild(frag);
    dealScroll(listbox, bar, h, h * data.length);
}

function dealScroll(el: HTMLElement, bar: HTMLElement, h: number, sumH: number): void {
    const box_h = parseInt(el.style.height);
    el.addEventListener('scroll', function(e: Event) {
        const scroll_v = el.scrollTop;
        const per = scroll_v / sumH;
        const translate_y = box_h * per;
        bar.style.transform = `translateY(${translate_y}px)`;
        const base_num = Math.floor(scroll_v / h);
        const frag = generateItems(base_num, h);
        const list_el = el.firstChild as HTMLElement;
        // console.log(list_el)
        list_el.innerHTML = '';
        list_el.appendChild(frag);
        // console.log(frag)
    })
}

function generateItems(base: number, h: number): DocumentFragment {
    base -= 2;
    if (base <= 0) {
        base = 0;
    }
    const frag = document.createDocumentFragment();
    data.slice(base, base + 20).forEach((item, i) => {
        const el = createEl('li');
        el.innerText = item + '';
        i = item as number - 1;
        el.style.top = i * h + 'px';
        Object.assign(el.style, itemStyle);
        frag.appendChild(el);
    })
    return frag;
}
