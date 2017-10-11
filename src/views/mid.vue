<template>
  
</template>
<script>
export default {
  name: "mid",
  data () {
    return {
      
    }
  },
  mounted () {
    const name = this.getParameterByName('from')
    this.$router.push({ name: name })
  }
}
</script>
<style lang="less">

</style>
