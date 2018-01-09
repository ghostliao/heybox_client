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
        return 'warning-fill'
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
      top: 0;
    }
    &.success {
      background-color: @successColor;
      .iconfont {
        top: 1px;
      }
    }
    &.fail {
      background-color: @dangerColor;
    }
    &.large {
      width: 40px;
      height: 40px;
    }
    &.small {
      width: 18px;
      height: 18px;
    }
  }
}
</style>