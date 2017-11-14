<template>
<abstract-button @click="handleClick"
  @hover="handleHover" @hoverExit="handleHoverExit" @keyboardFocus="handleKeyboardFocus"
  :to="to" :tag="tag" :activeClass="activeClass" :event="event" :exact="exact" :append="append" :replace="replace"
  :type="type" :href="href" :target="target" :disabled="disabled" :keyboardFocused="keyboardFocused" wrapperClass="icon-wrap" :style="buttonStyle" class="mu-icon-button" :danger="danger" :success="success">
  <slot>
    <icon :value="icon" :class="iconClass" :size="iconSize"></icon>
  </slot>
  <tooltip v-if="tooltip" :trigger="tooltipTrigger" :verticalPosition="verticalPosition" :horizontalPosition="horizontalPosition" :show="tooltipShown" :label="tooltip" :touch="touch"></tooltip>
</abstract-button>
</template>

<script>
import abstractButton from '../internal/abstractButton'
import routerMixin from '../internal/routerMixin'
import icon from '../icon'
import tooltip from '../tooltip'
export default {
  name: 'cpt-icon-button',
  mixins: [routerMixin],
  props: {
    icon: {
      type: String
    },
    iconClass: {
      type: [String, Array, Object],
      default: ''
    },
    iconSize: {
      type: Number,
    },
    type: {
      type: String
    },
    href: {
      type: String,
      default: ''
    },
    target: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    keyboardFocused: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String
    },
    tooltipPosition: {
      type: String,
      default: 'bottom-center'
    },
    touch: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonStyle () {
      return {
        'font-size': this.iconSize + 'px',
        'width': this.iconSize + 'px',
        'height': this.iconSize + 'px',
        'line-height': this.iconSize + 'px',
        // 'color': getColor(this.color)
      }
    },
    verticalPosition () {
      const tooltipPosition = this.tooltipPosition.split('-')
      return tooltipPosition[0]
    },
    horizontalPosition () {
      const tooltipPosition = this.tooltipPosition.split('-')
      return tooltipPosition[1]
    }
  },
  data () {
    return {
      tooltipShown: false,
      tooltipTrigger: null
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    },
    handleHover (event) {
      this.tooltipShown = true
      this.$emit('hover', event)
    },
    handleHoverExit (event) {
      this.tooltipShown = false
      this.$emit('hoverExit', event)
      this.$emit('hover-exit', event)
    },
    handleKeyboardFocus (isFocus) {
      this.$emit('keyboardFocus', isFocus)
      this.$emit('keyboard-focus', isFocus)
    }
  },
  mounted () {
    this.tooltipTrigger = this.$el
  },
  components: {
    'abstract-button': abstractButton,
    icon,
    tooltip
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.mu-icon-button {
  position: relative;
  display: inline-block;
  overflow: visible;
  line-height: 1;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 24px;
  // padding: 12px;
  border: none;
  appearance: none;
  background: none;
  color: inherit;
  text-decoration: none;
  .common-transition;
  .flex-shrink(0);
  margin: 0;
  outline: 0;
  cursor: pointer;
  .mu-circle-ripple{
    color: @textColor;
  }
  &.hover {
    color: @hoverColor;
  }
  &:active {
    color: @activeColor;
  }
  &.danger {
    &.hover {
      color: @dangerHoverColor;
    }
    &:active {
      color: @dangerActiveColor;
    }
  }
  &.success {
    color: @successColor;
  }
  &.disabled{
    color: @disabledColor;
    cursor: not-allowed;
  }
  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
