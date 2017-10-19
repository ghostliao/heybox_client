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
        'fail': this.fail
      }
    },
    markIcon () {
      if (this.success) {
        return 'success'
      }
    },
    iconSize () {
      if (this.small) {
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
    &.success {
      background-color: @successColor; 
    }
  }
}
</style>