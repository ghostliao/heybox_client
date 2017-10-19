<template>
  <div class="cpt-linear-loading">
    div.
  </div>
</template>

<script>
export default {
  name: 'cpt-linear-loading',
  props: {
    time: Number
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    window.setTimeout(() => {
        this.show = true
    }, this.time)
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-linear-loading {

}

</style>