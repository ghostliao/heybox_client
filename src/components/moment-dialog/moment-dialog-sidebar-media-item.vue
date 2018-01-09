<template>
  <div class="moment-dialog-sidebar-media-item" :class="{ 'current': currentMediaIndex === index }" @click="previewMedia">
    <div class="upload-status">
      <cpt-mark success small v-show="data.uploadFinished"></cpt-mark>
      <cpt-mark fail small v-show="!data.uploading && data.uploadFailed"></cpt-mark>
      <!-- <span class="upload-msg">已上传</span> -->
    </div>
    <div class="layer" :class="{ 'uploading': data.uploading, 'over': data.uploadFinished }">
      <div class="progress" v-show="data.uploading">
        <cpt-linear-progress mode="determinate" :size="2" :value="data.uploadProgress * 100"/>
      </div>
      <!-- <div class="upload-msg" v-show="!data.uploading && data.uploadFailed">上传失败</div> -->
      <cpt-button label="上传" icon="upload-fill" v-if="!data.uploading && !data.uploadFinished" @click="uploadBtn(data.localId)" small primary />
      <cpt-button label="已上传" icon="check-fill" small success v-if="!data.uploading && data.uploadFinished" />
    </div>
    <div class="info">
      <div>
        <!-- <span>{{ filterFormDate(data.createTimeStamp, 7) }}</span> -->
        <span v-text="momentDesc"></span>
      </div>
      <div v-if="data.fileType === 'video'">
        <span>{{data.duration}}s</span>
      </div>
    </div>
    <div class="thumbnail">
      <img v-lazy="thumbnail">
    </div>
    <!-- <div class="tool-bar">
      <div class="progress" v-show="data.uploading">
        <cpt-linear-progress mode="determinate" :size="2" :value="data.uploadProgress * 100"/>
      </div>
      <div class="upload-msg" v-show="!data.uploading && data.uploadFailed">上传失败</div>
      <cpt-button label="上传" icon="upload-fill" v-if="!data.uploading && !data.uploadFinished" @click="uploadMedia(data.localId)" small primary />
      <cpt-button label="已上传" icon="check-fill" small success v-if="!data.uploading && data.uploadFinished" />
    </div> -->
  </div>
</template>

<script>
import Bus from '@/components/bus'

export default {
  name: 'cpt-moment-dialog-sidebar-media-item',
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
      mediaLoading: true,
      lock: true,
      clickDelay: 300
    }
  },
  computed: {
    thumbnail () {
      return 'max-file://' + this.data.thumbnail.replace(':', '')
    },
    momentDesc () {
      if (this.data.momentDescription && this.data.momentDescription.match(/Kill-CN|Kill-EN/)) {
        return '击杀'
      } else if (this.data.momentDescription && this.data.momentDescription.match(/SoloDead-CN1/)) {
        return '结束'
      } else {
        return ''
      }
    }
  },
  watch: {
    currentMediaIndex () {
      this.lock = true
    }
  },
  methods: {
    mediaLoadFinished () {
      this.mediaLoading = false
      // console.log(this.mediaLoading)
    },
    uploadBtn (localId) {
      if (this.lock) return
      this.uploadMedia(localId)
    },
    uploadMedia (localId) {
      console.log('upload ' + localId)
      if (this.data.fileType === 'video') {
        maxjia.media.file.uploadVideo(localId)
      } else if (this.data.fileType === 'image') {
        maxjia.media.file.uploadImage(localId)
      }
      this.__REPORT('view_moment_dialog_upload')
    },
    uploadAllMoment () {
      Bus.$on('uploadAll', () => {
        this.uploadMedia(this.data.localId)
      })
    },
    unlockByMousewheel () {
      Bus.$on('mousewheel', () => {
        // this.lock = true
        // setTimeout(() => {
        //   this.lock = false
        // }, this.clickDelay)
      })
    },
    previewMedia () {
      setTimeout(() => {
        this.lock = false
      }, this.clickDelay)
      this.$emit('previewMedia', this.index)
    }
  },
  created () {
    this.uploadAllMoment()
    // this.unlockByMousewheel()
  },
  mounted () {
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.moment-dialog-sidebar-media-item {
  position: relative;
  width: 100%;
  height: 64px;
  margin-bottom: 4px;
  cursor: pointer;
  &:last-of-type {
    margin-bottom: 0;
  }
  &.current {
    box-shadow: 0 0 0 2px @primaryColor;
    .layer {
      opacity: 1;
    }
  }
  .upload-status {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .upload-msg {
      font-size: 12px;
      font-weight: 400;
      &.fail {
        color: @dangerColor;
      }
    }
  }
  .layer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(20, 25, 30, 0.8);
    opacity: 0;
    &.uploading {
      opacity: 1;
    }
    &.over {
      opacity: 0 !important;
    }
    .progress {
      width: 80%;
    }
  }
  &:hover {
    &.current {
      .layer {
        opacity: 1;
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    height: 32px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), #000000);
    font-size: 12px;
    font-weight: 400;
    color: #f1f2f3;
    line-height: 1;
    padding: 14px 4px 0;
  }
  .thumbnail {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
}

</style>