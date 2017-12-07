<template>
  <div class="moment-dialog-media-item">
    <template v-if="data.fileType === 'video'">
      <video :src="'max-file://' + data.file" preload="preload" loop muted ref="media"></video>
    </template>
    <template v-if="data.fileType === 'image'">
      <img :src="'max-file://' + data.file">
    </template>
  </div>
</template>

<script>
export default {
  name: 'cpt-moment-dialog-media-item',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    videoAutoPlay () {
      const _this = this
      const wrap = this.$parent.$parent.$refs.momentList
      const el = this.$refs.media
      function isMediaInView () {
        const offsetTopIn = el.offsetTop - wrap.offsetTop
        const _elHeight = el.clientHeight
        const _scrollTop = wrap.scrollTop
        const _scrollHeight = wrap.scrollHeight
        const _wrapHeight = wrap.clientHeight
        // 可见范围即父容器滚动条当前位置 至 父容器高度这个范围
        if (offsetTopIn >= _scrollTop - _elHeight && offsetTopIn <= _scrollTop + _wrapHeight) {
          el.play()
          // console.log(_this.index + ' play')
        } else {
          el.pause()
          // console.log(_this.index + ' pause')
        }
      }
      isMediaInView()
      wrap.addEventListener('scroll', () => {
        isMediaInView()
      })
    }
  },
  created () {
    
  },
  mounted () {
    if (this.data.fileType === 'video') {
      this.videoAutoPlay()
    }
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.moment-dialog-media-item {
  padding: 12px 24px;
  video {
    width: 100%;
  }
  img {
    width: 100%;
  }
}

</style>