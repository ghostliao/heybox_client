<template>
  <div class="cpt-set-block-head">
    <span class="title">{{title}}</span>
    <span class="subtitle" v-if="subtitle">{{subtitle}}</span>
  </div>
</template>

<script>
export default {
  name: "cpt-set-block-head",
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
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
.cpt-set-block-head {
  height: 54px;
  line-height: 54px;
  .title {
    font-size: 18px;
  }
  .subtitle {
    font-size: 12px;
    color: fade(@textColor, 20%);
  }
}
</style>