<template>
  <div class="image-checker">
    <img :src="$store.state.imageCheckerOptions.src" alt="" :style="imgStyle">
  </div>
</template>

<script>
export default {
  name: 'image-checker',
  props: {
    
  },
  data () {
    return {
      maxHeight: 0
    }
  },
  computed: {
    imgStyle () {
      return {
        'max-height': this.maxHeight + 'px',
        'max-width': this.maxWidth + 'px'
      }
    }
  },
  methods: {
    imgSizeCalc () {
      const h = document.body.clientHeight
      const w = document.body.clientWidth
      this.maxHeight = h * 0.8
      this.maxWidth = w * 0.8
    }
  },
  created () {
    this.imgSizeCalc()
    window.onresize = this.imgSizeCalc()
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.image-checker {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    display: block;
    max-height: 600px;
  }
}

</style>