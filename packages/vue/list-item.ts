import { defineComponent, h, inject } from "vue";

export default defineComponent({
    name: 'ListItem',
    props: {
        content: {
            type: [String, Number, Object],
            default: null
        }
    },
    setup(props) {
        const { content } = inject('virtual-scroll').slots
        return () => {
            if (!content) {
                return h('', null, props.content)
            }
            return h('div', null, [content(props.content)])
        }
    }
})
