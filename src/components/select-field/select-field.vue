<template>
  <div class="cpt-select-field" :class="{ 'full-width': fullWidth }">
    <div class="select-field" :class="{ 'active': menuOpen }" :style="selectFieldStyle" ref="menuButton" @click="menuToggle">
      <div>{{select}}</div>
    </div>
    <cpt-popover :trigger="menuTrigger" :popoverClass="['left']" :open="menuOpen" @close="menuHandleClose">
      <slot></slot>
    </cpt-popover>
  </div>
</template>

<script>
import cptPopover from '@/components/popover'
import Bus from '@/components/bus'

export default {
  name: 'cpt-select-field',
  components: {
    'cpt-popover': cptPopover
  },
  props: {
    select: {
      type: String,
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    selectFieldStyle: {
      type: Object
    }
  },
  data () {
    return {
      menuOpen: false,
      menuTrigger: null
    }
  },
  methods: {
    menuToggle () {
      this.menuOpen = !this.menuOpen
    },
    menuHandleClose (e) {
      this.menuOpen = false
    }
  },
  created () {
    Bus.$on('closeMenu', data => {
      this.menuHandleClose()
    })
  },
  mounted () {
    this.menuTrigger = this.$refs.menuButton
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-select-field {
  display: inline-block;
  &.full-width {
    width: 100%;
  }
  .select-field {
    position: relative;
    display: flex;
    align-items: center;
    // min-width: 56px;
    height: 28px;
    background-color: @textFieldBackgroundColor;
    border: solid 1px @textFieldBorderColor;
    border-radius: 2px;
    padding: 0 24px 0 12px;
    color: fade(@textColor, 80%);
    font-size: 12px;
    cursor: pointer;
    .common-transition;
    // &:after {
    //   content: '\e654';
    //   position: absolute;
    //   top: 6px;
    //   right: 6px;
    //   font-family: 'iconfont';
    //   font-weight: 400;
    //   font-size: 12px;
    // }
    &:after {
      content: '';
      position: absolute;
      top: 11px;
      right: 6px;
      border-top: 4px solid @lightIconColor;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
    }
    &.active {
      border-color: @primaryColor;
    }
  }
}

</style>