<template>
  <div class="cpt-set-block" :style="setBlockStyle">
    <div class="title" v-if="title">{{title}}</div>
    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "cpt-set-block",
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    setBlockStyle: {
      type: Object
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
.cpt-set-block {
  padding: 16px 12px;
	background: @blockBackgroundColor;
	border: solid 1px @blockBorderColor;
  border-radius: 2px;
  margin-bottom: 8px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .title {
    font-size: 12px;
    line-height: 1;
    margin-bottom: 8px;
  }
  .main {
    .setting-row {
      // margin-right: -12px;
      // padding: 8px 12px 8px 0;
      padding: 8px 0;
      border-bottom: 1px solid @blockDividerColor;
      &:last-of-type {
        border-color: transparent;
      }
      .label-wrap {
        font-size: 12px;
        .label {
          color: @labelColor;
        }
        .desc {
          color: @descColor;
        }
      }
    }
  }
}
</style>