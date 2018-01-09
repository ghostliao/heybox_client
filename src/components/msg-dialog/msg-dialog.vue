<template>
  <div class="cpt-msg-dialog">
    <div class="msg">{{ msg }}</div>
    <cpt-mark v-show="markType === 'success'" success large></cpt-mark>
    <cpt-mark v-show="markType === 'fail'" fail large></cpt-mark>
    <div v-show="desc" class="desc">{{ desc }}</div>
    <cpt-button label="知道了" secondary long @click="$emit('close')"></cpt-button>
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
    },
    desc: {
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
  padding: 32px 0 24px;
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
    margin-bottom: 24px;
  }
  .desc {
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    color: #82878c;
    margin-bottom: 24px;
  }
}

</style>