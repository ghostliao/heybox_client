<template>
  <div class="cpt-button">
    <div class="box" @click="handleClick(param1)" :class="buttonClass">
      <span class="label" :class="labelClass" v-if="label && labelPosition === 'before'">{{label}}</span>
      <icon :value="icon" :class="iconClass"></icon>
      <slot></slot>
      <span class="label" :class="labelClass" v-if="label && labelPosition === 'after'">{{label}}</span>
    </div>
  </div>
</template>

<script>
import icon from '../icon'

export default {
  name: "cpt-button",
  components: {
    icon
  },
  props: {
    icon: {
      type: String
    },
    iconClass: {
      type: [String, Array, Object]
    },
    label: {
      type: String
    },
    labelPosition: {
      type: String,
      default: 'after'
    },
    labelClass: {
      type: [String, Array, Object],
      default: ''
    },
    param1: {
      type: [Boolean, Number, String],
      default: false
    },
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    long: {
      type: Boolean,
      default: false
    },
    narrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    buttonClass () {
      return {
        'primary': this.primary,
        'secondary': this.secondary,
        'success': this.success,
        'danger': this.danger,
        'small': this.small,
        'long': this.long,
        'narrow': this.narrow
      }
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-button {
  display: inline-block;
  overflow: hidden;
  position: relative;
  // margin: 0 8px;
  > .box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 90px;
    height: 36px;
    padding: 0 10px;
    color: @textColor;
    background: transparent;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid fade(@textColor, 80%);
    border-radius: 2px;
    letter-spacing: 0px;
    // .common-transition; // 优化按钮 border bug
    cursor: pointer;
    &:hover, &:active {
      color: @alternateTextColor;
      background: fade(@textColor, 80%);
      border-color: transparent;
    }
    &:active {
      opacity: .4;
    }
    &.primary {
      color: @textColor;      
      background: fade(@primaryColor, 80%);
      border-color: transparent;
      &:hover {
        color: @textColor;
        background: fade(@primaryColor, 100%);
      }
      &:active {
        opacity: .4;
      }
    }
    &.secondary {
      color: #bec3c8;
      background: fade(@textColor, 10%);
      border-color: transparent;
      &:hover {
        color: #f1f2f3;
        background: fade(@textColor, 20%);
      }
      &:active {
        opacity: .4;
      }
    }
    &.success {
      color: @textColor;      
      background: fade(@successColor, 80%);
      border-color: transparent;
      &:hover {
        color: @textColor;
        background: fade(@successColor, 100%);
      }
      &:active {
        opacity: .4;
      }
    }
    &.danger {
      color: @textColor;      
      background: fade(@dangerColor, 80%);
      border-color: transparent;
      &:hover {
        color: @textColor;
        background: fade(@dangerColor, 100%);
      }
      &:active {
        opacity: .4;
      }
    }
    &.small {
      min-width: 80px;
      height: 28px;
      font-size: 12px;
      .iconfont {
        font-size: 14px;
      }
    }
    &.long {
      width: 134px;
      font-size: 14px;
    }
    &.narrow {
      min-width: 68px;
    }
    &.disabled {
      opacity: .1;
    }
    .label {
      line-height: 1;
    }
  }
}
</style>