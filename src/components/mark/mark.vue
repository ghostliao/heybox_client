<template>
  <div class="cpt-mark">
    <div class="icon-wrap" :class="markClass">
      <cpt-icon :value="markIcon" :size="iconSize"></cpt-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cpt-mark',
  props: {
    success: {
      type: Boolean,
      default: false
    },
    fail: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    markClass () {
      return {
        'success': this.success,
        'fail': this.fail,
        'large': this.large,
        'small': this.small
      }
    },
    markIcon () {
      if (this.success) {
        return 'success'
      } else if (this.fail) {
        return 'close'
      }
    },
    iconSize () {
      if (this.large) {
        return 28
      } else if (this.small) {
        return 12
      } else {
        return 20
      }
    }
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-mark {
  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    .iconfont {
      position: relative;
      top: 1px;
    }
    &.success {
      background-color: @successColor; 
    }
    &.fail {
      background-color: @dangerColor;
    }
    &.large {
      width: 42px;
      height: 42px;
    }
    &.small {
      width: 18px;
      height: 18px;
    }
  }
}
</style>