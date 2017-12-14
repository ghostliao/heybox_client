<template>
  <div class="moment-dialog-media-item" :class="{ 'game-over': !momentKill }">
    <div class="info-bar" :class="{ 'only-one': itemCount === 1 }">
      <div class="time">{{ filterFormDate(data.createTimeStamp, 7) }}</div>
      <div class="desc" v-text="momentKill ? '击杀' : '结束'"></div>
    </div>
    <div class="media-wrap">
      <!-- <div class="loading" v-if="mediaLoading">
        <cpt-circular-progress :size="40" />
      </div> -->
      <template v-if="data.fileType === 'video'">
        <video :src="'max-file://' + data.file" preload="preload" loop muted ref="media" @canplay="mediaLoadFinished"></video>
      </template>
      <template v-if="data.fileType === 'image'">
        <img :src="'max-file://' + data.file" @load="mediaLoadFinished">
      </template>
    </div>
    <div class="tool-bar">
      <div class="progress" v-show="data.uploading">
        <cpt-linear-progress mode="determinate" :size="2" :value="data.uploadProgress * 100"/>
      </div>
      <div class="upload-msg" v-show="!data.uploading && data.uploadFailed">上传失败</div>
      <cpt-button label="上传" icon="upload-fill" v-if="!data.uploading && !data.uploadFinished" @click="uploadMedia(data.localId)" small primary />
      <cpt-button label="已上传" icon="check-fill" small success v-if="!data.uploading && data.uploadFinished" />
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
    itemCount: {
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
  methods: {
    mediaLoadFinished () {
      this.mediaLoading = false
      // console.log(this.mediaLoading)
    },
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
    },
    uploadMedia (localId) {
      // console.log('upload')
      if (this.data.fileType === 'video') {
        maxjia.media.file.uploadVideo(localId)
      } else if (this.data.fileType === 'image') {
        maxjia.media.file.uploadImage(localId)
      }
    },
    uploadAllMoment () {
      Bus.$on('uploadAll', () => {
        this.uploadMedia(this.data.localId)
      })
    }
  },
  created () {
    this.uploadAllMoment()
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
  .info-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 1;
    border-left: 2px solid #323741;
    padding-left: 12px;
    &.only-one {
      border-color: transparent;
    }
    &::after {
      content: '';
      position: absolute;
      z-index: 2;
      top: 14px;
      left: -7px;
      width: 8px;
      height: 8px;
      border: 2px solid #323741;
      border-radius: 50%;
      background: #fff;
    }
    .time {
      color: @textColor;
      font-size: 16px;
      font-weight: 600;
      margin-right: 8px;
    }
    .desc {
      font-size: 12px;
    }
  }
  &.game-over {
    .info-bar {
      &::after {
        border: 2px solid #fff;
        background: @primaryColor;
      }
    }
  }
  &:first-of-type {
    .info-bar {
      &::before {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        left: -2px;
        width: 2px;
        height: 20px;
        background: #272a32;
      }
    }
  }
  .media-wrap { // 加position，自动播放判断会失效
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 450px;
    border-left: 2px solid #323741;
    padding: 0 0 12px 12px;
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
      width: 100%;
      background: #111;
    }
    img {
      width: 100%;
      background: #111;      
    }
  }
  .tool-bar {
    display: flex;
    height: 28px;
    justify-content: flex-end;
    align-items: center;
    border-left: 2px solid #323741;
    padding-left: 12px;
    .progress {
      width: 250px;
    }
    .upload-msg {
      font-size: 14px;
      font-weight: 400;
      color: @dangerColor;
      padding-right: 10px;
    }
  }
  &:last-of-type {
    .info-bar {
      &::before {
        content: '';
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: -2px;
        width: 2px;
        height: 20px;
        background: #272a32;
      }
    }
    .media-wrap {
      border-color: transparent;
    }
    .tool-bar {
      border-color: transparent;      
    }  
  }
}

</style>