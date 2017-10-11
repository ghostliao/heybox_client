<template>
  <div class="cpt-text-field">
    <div class="text-field" v-if="readonly">{{value}}</div>
    <input class="text-field" type="text" v-else>
  </div>
</template>

<script>
export default {
  name: "text-field",
  components: {
  },
  props: {
    readonly: {
      type: boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-text-field {
  .text-field {
    height: 24px;
    line-height: 24px;
    color: 
	  background-color: @textFieldBackgroundColor;
	  border: solid 1px @textFieldBorderColor;
	  border-radius: 2px;
    text-align: center;    
  }
}
</style>