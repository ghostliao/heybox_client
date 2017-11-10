<template>
  <div class="cpt-block-button" :class="buttonClass" @click="handleClick" @mouseenter="handleHover" @mouseleave="handleHoverExit">
    <cpt-icon v-if="icon" :value="icon" :size="iconSize"></cpt-icon>
    <slot name="icon"></slot>
    <span v-if="text" class="txt" :class="textClass">{{ text }}</span>
    <slot></slot>
    <cpt-tooltip v-if="tooltipLabel" :label="tooltipLabel" :show="tooltipShown" :trigger="tooltipTrigger" verticalPosition="bottom" horizontalPosition="center"/>
  </div>
</template>

<script>
export default {
  name: 'cpt-block-button',
  props: {
    buttonClass: {
      type: [String, Object]
    },
    icon: {
      type: String
    },
    iconSize: {
      type: Number,
      default: 24
    },
    text: {
      type: String
    },
    textClass: {
      type: [String, Object]
    },
    tooltipLabel: {
      type: String
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
    handleHover () {
      this.tooltipShown = true
    },
    handleHoverExit () {
      this.tooltipShown = false
    }
  },
  created () {
    
  },
  mounted () {
    this.tooltipTrigger = this.$el
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-block-button {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 134px;
  height: 76px;
  color: @textColor;
  border-radius: 2px;
  background-color: fade(@textColor, 10%);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  margin-right: 12px;
  cursor: pointer;
  > .icon {
    width: 24px;
    height: 24px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .iconfont {
    color: fade(@textColor, 80%);
  }
  .txt {
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    margin-top: 8px;
    &.time {
      font-family: 'liquidcr';
      font-size: 16px;
      margin-top: 2px;
    }
  }
  &:hover {
    background-color: fade(@textColor, 20%);
  }
  &:active {
    background-color: fade(@textColor, 20%);
  }
  &.recording {
    color: @dangerColor;
    .iconfont {
      color: @dangerColor;
    }
  }
  &.close {
    color: fade(@textColor, 40%);
    .iconfont {
      color: fade(@textColor, 40%);
    }
  }
  &.set {
    width: 76px;
    background-color: fade(@textColor, 5%);
    .iconfont {
      color: fade(@textColor, 40%);
    }
    &:hover {
      background-color: fade(@textColor, 20%);
    }
  }
}

</style>