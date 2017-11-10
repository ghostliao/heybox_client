<template>
  <div class="cpt-msg-dialog">
    <cpt-mark v-show="markType === 'success'" success large></cpt-mark>
    <cpt-mark v-show="markType === 'fail'" fail large></cpt-mark>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'cpt-msg-dialog',
  props: {
    markType: {
      type: String,
      default: 'success'
    },
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      
    }
  },
  created () {
    
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-msg-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 216px;
  // border: 1px solid #000;
  // box-shadow: 0 0 0 1px @layoutBorderColor inset;
  
  border-radius: 2px;
  .cpt-mark {
    margin-bottom: 24px;
  }
  .msg {
    font-size: 16px;
    line-height: 1;
    color: @textColor;
  }
}

</style>