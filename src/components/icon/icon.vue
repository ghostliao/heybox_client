<script>
import {getColor} from '../utils'
export default {
  name: 'cpt-icon',
  props: {
    value: {
      type: String
    },
    size: {
      type: Number
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconStyle () {
      return {
        'font-size': this.size + 'px',
        'width': this.size + 'px',
        'height': this.size + 'px',
        'line-height': this.size + 'px',
        'color': getColor(this.color)
      }
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  },
  render (h) {
    const {value, iconStyle, handleClick} = this
    if (!value) return null
    const text = ''
    return h('i', {
      class: ['iconfont', 'icon-' + value],
      style: iconStyle,
      on: {
        click: handleClick
      }
    }, text)
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.iconfont {
  font-size: @iconSize;
  height: @iconSize;
  line-height: @iconSize;
  cursor: inherit;
  & + .label, .label + & {
    margin-left: 8px;
  }
}
</style>
