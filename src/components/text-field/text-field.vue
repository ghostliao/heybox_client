<template>
  <div class="cpt-text-field">
    <div class="text-field" v-if="readonly" :class="{ 'pre-icon': preIcon }">
      <icon :value="preIcon" v-if="preIcon"></icon>
      <span>{{value}}</span>
    </div>
    <input class="text-field" type="text" v-else>
  </div>
</template>

<script>
import icon from '../icon'

export default {
  name: "text-field",
  components: {
    icon
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    preIcon: {
      type: String
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
    position: relative;
    height: 28px;
    line-height: 18px;
    font-size: 12px;
    color: fade(@textColor, 50%);
	  background-color: @textFieldBackgroundColor;
	  border: solid 1px @textFieldBorderColor;
	  border-radius: 2px;
    text-align: left;
    padding: 4px 6px;
    user-select: text;
    .iconfont {
      position: absolute;
      left: 6px;
      top: 5px;
    }
    &.pre-icon {
      padding-left: 28px;
      .iconfont {
        color: @lightIconColor;
      }
    }
  }
}
</style>