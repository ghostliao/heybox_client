<template>
  <div class="moment-dialog-media-item" :class="{ 'game-over': !momentKill }">
    <div class="media-wrap">
      <!-- <div class="loading" v-if="mediaLoading">
        <cpt-circular-progress :size="40" />
      </div> -->
      <template v-if="data.fileType === 'video'">
        <video :src="'max-file://' + data.file" preload="preload" autoplay="autoplay" loop ref="media" @canplay="mediaLoadFinished"></video>
      </template>
      <template v-if="data.fileType === 'image'">
        <img :src="'max-file://' + data.file" @load="mediaLoadFinished">
      </template>
    </div>
  </div>
</template>

<script>
import Bus from '@/components/bus'

export default {
  name: 'cpt-moment-dialog-media-item',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    },
    currentMediaIndex: {
      type: Number      
    }
  },
  data () {
    return {
      mediaLoading: true
    }
  },
  computed: {
    momentKill () {
      return this.data.momentDescription && this.data.momentDescription.match(/Kill-CN|Kill-EN/)
    }
  },
  watch: {
    currentMediaIndex (newIndex) {
      if (this.data.fileType === 'video') {
        if (newIndex !== this.index) {
          // console.log('pause '+ this.index)
          this.$refs.media.pause()
        } else {
          // console.log('play '+ newIndex)       
          this.$refs.media.play()          
        }
      }
    }
  },
  methods: {
    mediaLoadFinished () {
      this.mediaLoading = false
      if (this.data.fileType === 'video') {
        this.$refs.media.play()
      }
      // console.log(this.mediaLoading)
    }
  },
  created () {
  },
  mounted () {

  },
  activated () {
    console.log('activated')
  },
  deactivated () {
    console.log('deactivated')
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.moment-dialog-media-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .media-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    .loading {
      // position: absolute;
      // z-index: 1;
      // top: 0;
      // left: 0;
      // right: 0;
      // bottom: 0;
      // margin: auto;
      // display: flex;
      // justify-content: center;
      // align-items: center;
    }
    video {
      // width: 100%;
      // background: #111;
      max-width: 100%;
      max-height: calc(~"100% - 80px");
      box-shadow: 0 2px 10px rgba(0, 0, 0, .5);      
    }
    img {
      // width: 100%;
      // background: #111;
      max-width: 100%;
      max-height: calc(~"100% - 80px");
      box-shadow: 0 2px 10px rgba(0, 0, 0, .5);
    }
  }
}

</style>