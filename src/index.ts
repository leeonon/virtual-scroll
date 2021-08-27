import scroll from './scroll';
import './base.css'

const options = {
    data: Array.from('0'.repeat(1000), (item, i) => i + 1),
    h: 30
}
scroll('#app', options)
