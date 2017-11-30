<template>
  <div class="cpt-media-item" :class="mediaItemStyle" v-show="manageBarOpen">
    <div class="media-item list" v-show="mediaItemStyle === 'list'" @click="mediaAction(data.file)">
      <div class="col col-1">
        <!-- <div class="thumbnail" v-lazy:background-image="thumbnail"> -->
        <div class="thumbnail">
          <img v-lazy="thumbnail">
          <!-- <img :src="thumbnail"> -->
          <!-- <div class="thumbnail" :style="{ backgroundImage: 'url(\'max-file://video/' + data.thumbnail + '\')' }"> -->
        </div>
        <div class="layer">
          <div class="play">
            <cpt-icon v-if="data.fileType === 'video'" value="start-fill" :size="24"></cpt-icon>
            <cpt-icon v-if="data.fileType === 'image'" value="fullscreen-fill" :size="24"></cpt-icon>
          </div>
        </div>
      </div>
      <div class="col col-2">
        <span class="name">{{ data.file | fileName }}</span>
        <span v-if="data.fileType === 'video'" class="duration">{{ data.duration | duration }}</span>
      </div>
      <div class="col col-3">
        <span class="time">{{ data.createTimeStamp | formDate(1) }}</span>
      </div>
      <div class="col col-4">
        <div v-if="data.fileType === 'video'" class="size">
          <span class="upload-size" v-show="data.uploading">{{ data.fileSize * data.uploadProgress | fileSize }}</span>
          <span v-show="data.uploading">/</span>
          <span class="full-size">{{ data.fileSize | fileSize }}</span>
        </div>
        <div class="progress-bar" v-show="data.uploading">
          <div class="value" :style="{ width: data.uploadProgress * 100 + '%' }"></div>
        </div>
        <div class="progress-msg" v-show="!data.uploading && data.uploadFinished">已上传</div>
        <div class="progress-msg" v-show="!data.uploading && data.uploadFailed">上传失败</div>
      </div>
      <div class="col col-5">
        <div class="btn-group">
          <div class="btn">
            <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteMedia" danger></cpt-icon-button>
          </div>
          <div class="btn">
            <cpt-icon-button v-if="data.uploadFinished" icon="check-fill" success></cpt-icon-button>
            <!-- <cpt-mark v-if="data.uploadFinished" success small></cpt-mark> -->
            <cpt-icon-button v-else icon="upload-fill" :disabled="uploadDisabled" @click.stop="uploadMedia(data.localId)"></cpt-icon-button>
          </div>
          <div class="btn">
            <cpt-icon-button icon="search-file-fill" @click.stop="locateFileInExplorer({ url: data.file })"></cpt-icon-button>
          </div>
        </div>
      </div>
    </div>

    <div class="media-item grid" v-show="mediaItemStyle === 'grid'" @click="mediaAction(data.file)">
      <div class="media-item-wrap">
        <div class="row row-1">
          <div class="thumbnail">
            <img v-lazy="thumbnail">
          </div>
          <div class="layer" v-show="!data.uploading">
            <div class="play">
              <cpt-icon v-if="data.fileType === 'video'" value="start-fill" :size="24"></cpt-icon>
              <cpt-icon v-if="data.fileType === 'image'" value="fullscreen-fill" :size="24"></cpt-icon>
            </div>
          </div>
          <div class="upload-info" v-show="data.uploading">
            <div v-if="data.fileType === 'video'" class="size">
              <span class="upload-size" v-show="data.uploading">{{ data.fileSize * data.uploadProgress | fileSize }}</span>
              <span v-show="data.uploading">/</span>
              <span class="full-size">{{ data.fileSize | fileSize }}</span>
            </div>
            <div class="progress-bar" v-show="data.uploading">
              <div class="value" :style="{ width: data.uploadProgress * 100 + '%' }"></div>
            </div>
          </div>
          <div class="size" :class="{ 'upload-failed': data.uploadFailed }">
            <div class="size-wrap">
              <span class="full-size" v-if="data.fileType === 'video'">{{ data.fileSize | fileSize }}</span>
              <span class="upload-status" v-if="data.uploadFailed">上传失败</span>
            </div>
          </div>
          <div class="duration" v-if="data.fileType === 'video'">
            <span>{{ data.duration | duration }}</span>
          </div>
        </div>
        <div class="row row-2">
          <div class="name">{{ data.file | fileName }}</div>
          <div class="btn-group">
            <div class="btn">
              <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteMedia" danger></cpt-icon-button>
            </div>
            <div class="btn">
              <cpt-icon-button v-if="data.uploadFinished" icon="check-fill" success></cpt-icon-button>
              <!-- <cpt-mark v-if="data.uploadFinished" success small></cpt-mark> -->
              <cpt-icon-button v-else icon="upload-fill" :disabled="uploadDisabled" @click.stop="uploadMedia(data.localId)"></cpt-icon-button>
            </div>
            <div class="btn">
              <cpt-icon-button icon="search-file-fill" @click.stop="locateFileInExplorer({ url: data.file })"></cpt-icon-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- S delete confirm dialog -->
    <cpt-dialog :open="deleteDialog" title="" @close="closeDeleteDialog" @hide="closeDeleteDialog" dialogClass="delete-dialog" :overlayOpacity="0.8" cornerClose>
      <div slot="title" class="title">删除</div>
      <div class="content">确认删除所选文件吗？</div>
      <cpt-button slot="actions" label="取消" @click="closeDeleteDialog" secondary />
      <cpt-button slot="actions" label="确认" @click="_deleteMedia" :param1="data.localId" primary />
    </cpt-dialog>
    <!-- E delete confirm dialog -->

    <!-- S upload guide toast -->
    <transition name="fade">
      <div v-if="index === 0 && guideToast" class="guide-toast" ref="toast" v-clickoutside="closeGuideToast">
        <div class="wrap">
          <div class="msg">点击上传，同步精彩时刻至小黑盒APP</div>
          <cpt-icon-button icon="close" @click="closeGuideToast"></cpt-icon-button>
        </div>
      </div>
    </transition>
    <!-- E upload guide toast -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Bus from '@/components/bus'
import clickoutside from '@/components/internal/clickoutside'

export default {
  name: "cpt-media-item",
  components: {
  },
  directives: {
    clickoutside
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    },
    mediaItemStyle: {
      type: [Object, Array, String],
      default: 'grid'
    },
    manageBar: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      deleteDialog: false,
      guideToast: false,
      manageBarOpen: true
    }
  },
  computed: {
    thumbnail () {
      return 'max-file://' + this.data.thumbnail.replace(':', '')
    },
    uploadDisabled () {
      if (this.data.fileType === 'video') {
        return !(this.data.isMomentCapture && !this.data.uploadFinished && !this.data.uploading && this.data.fileSize < 100 * 1024 * 1024)
      } else if (this.data.fileType === 'image') {
        return !(!this.data.uploadFinished && !this.data.uploading)
      }
    }
  },
  methods: {
    ...mapActions([
      'playVideoFile',
      'checkImageFile',
      'locateFileInExplorer'
    ]),
    openDeleteDialog () {
      this.deleteDialog = true
    },
    closeDeleteDialog () {
      this.deleteDialog = false
    },
    // 播放视频
    playVideo (url) {
      // console.log('play')
      const videoSource = url
      this.playVideoFile({
        'file': videoSource
      })

      // var video = document.getElementById('single-play')
      // video.load()

      // video.addEventListener('load', () => {
      //   this.play()
      // })
    },
    // 查看图片
    checkImage (url) {
      // console.log('check')
      const imageSource = url
      this.checkImageFile({
        'local': true,
        'file': imageSource
      })
    },
    mediaAction (file) {
      if (this.data.fileType === 'video') {
        this.playVideo(file)
      } else if (this.data.fileType === 'image') {
        this.checkImage(file)
      }
    },
    uploadMedia (localId) {
      // console.log('upload')
      if (this.data.fileType === 'video') {
        maxjia.media.file.uploadVideo(localId)
      } else if (this.data.fileType === 'image') {
        maxjia.media.file.uploadImage(localId)
      }
    },
    deleteMedia () {
      this.openDeleteDialog()
    },
    _deleteMedia (localId) {
      console.log('delete ' + localId)
      if (this.data.fileType === 'video') {
        maxjia.media.file.deleteVideo(localId)
      } else if (this.data.fileType === 'image') {
        maxjia.media.file.deleteImage(localId)
      }
      this.closeDeleteDialog()
    },
    formDate (t) {
      const timeSpan = t * 1000
      const dateTime = new Date(parseInt(timeSpan))
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const day = dateTime.getDate()
      return `${year}-${month}-${day}`
    },
    firstUploadNotice () { // 首次上传成功后提示
      if (localStorage.getItem('firstUpload') !== '1') {
        this.$watch('data.uploadFinished', (newValue, oldValue) => {
          if (localStorage.getItem('firstUpload') !== '1' && oldValue === false && newValue === true) {
            localStorage.setItem('firstUpload', 1)
            this.$emit('firstUpload')
          }
        })
      }
    },
    closeGuideToast () {
      this.guideToast = false
      localStorage.setItem('uploadGuide', 1)
    },
    uploadGuide () { // 上传引导
      if (localStorage.getItem('uploadGuide') !== '1') {
        this.guideToast = true
      }
    }
  },
  created () {
    this.uploadGuide()
    this.firstUploadNotice()
    Bus.$on('toggleManageBar', data => {
      if (this.formDate(data[0]) === this.formDate(this.data.createTimeStamp)) {
        this.manageBarOpen = !this.manageBarOpen
      }
    })
  },
  mounted () {
    // console.log(this.data)
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-media-item {
  position: relative;
  &.list {
    width: 100%;
  }
  &.grid {
    width: 20%;
    padding-right: 20px;
  }
  .media-item {
    &.list {
      position: relative;
      display: flex;
      height: 64px;
      // border: 1px solid #151A20;
      border-radius: 2px;
      background: @blockBackgroundColor;
      // background-image: linear-gradient(to bottom, #2a2e34, #30343a);
      // box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
      // box-shadow: inset 0 0 0 1px #151A20;
      margin-bottom: 2px;
      cursor: pointer;
      &:hover {
        // background: #292D34;
        background: fade(#fff, 10%);
        box-shadow: none;
      }
      // &:after {
      //   content: '';
      //   position: absolute;
      //   z-index: 1;
      //   top: 0;
      //   left: 0;
      //   right: 0;
      //   bottom: 0;
      //   border-radius: 2px;
      //   border: solid 1px @blockBorderColor;
      //   .common-transition;
      // }
      // &:hover:after {
      //   border-color: @primaryColor;
      // }
      > .col {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      > .col-1 {
        position: relative;
        width: 134px;
        height: 100%;
        background: fade(#000, 20%);
        .thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-size: cover;
          img {
            // position: absolute;
            // top: 0;
            // left: 50%;
            // transform: translateX(-50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .layer {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: fade(#14191e, 80%);
          opacity: 0;
          // .common-transition;
          .play {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 28px;
            font-size: 14px;
            color: fade(#fff, 80%);
          }
        }
      }
      > .col-2 {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        // background: rgba(20, 25, 30, 0.6);
        padding: 0 12px;
        .name {
          .ellipsis;
        }
        .duration {
          font-size: 12px;
          color: fade(@textColor, 40%);
        }
      }
      > .col-3 {
        width: 12.5%;
        color: fade(@textColor, 40%);
        font-size: 12px;
      }
      > .col-4 {
        width: 20%;
        color: fade(@textColor, 60%);
        font-size: 12px;
        .size {
          .upload-size {
            color: fade(@textColor, 60%);
          }
        }
        .progress-bar {
          height: 2px;
          border-radius: 2px;
          background-color: fade(#fff, 20%);
          margin-top: 6px;
          .value {
            position: relative;
            height: 2px;
            border-radius: 2px;
            background-image: linear-gradient(to right, #36b0fa, #a1dcff);
            &:after {
              content: '';
              position: absolute;
              z-index: 1;
              top: 0;
              right: -1px;
              width: 2px;
              height: 2px;
              border-radius: 2px;
              background-color: #a1dbff;
              box-shadow: 0 0 6px 0 #a1dbff, 0 0 6px 0 #a1dbff;
            }
          }
        }
      }
      > .col-5 {
        position: relative;
        z-index: 2;
        width: 12.5%;
        // width: 90px;
        .btn-group {
          display: flex;
          padding-right: 15px;
          justify-content: flex-end;
          .btn {
            position: relative;
            // width: 14px;
            // height: 14px;
            margin: 0 3px;
            color: @lightIconColor;
            &.disabled {
              color: fade(@textColor, 10%);
              cursor: not-allowed;
            }
          }
        }
      }
      &:hover {
        > .col-1 {
          .layer {
            opacity: 1;
          }
        }
      }
    }
    &.grid {
      margin-bottom: 8px;
      cursor: pointer;
      .media-item-wrap {
        > .row-1 {
          position: relative;
          padding-top: 56.25%;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 0 6px rgba(0,0,0,.5);
          .thumbnail {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .layer {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: fade(#14191e, 80%);
            opacity: 0;
            // .common-transition;
            .play {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 36px;
              height: 28px;
              font-size: 14px;
              color: fade(#fff, 80%);
            }
          }
          .upload-info {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: fade(#14191e, 80%);
            color: fade(@textColor, 60%);
            font-size: 12px;
            .size {
              .upload-size {
                color: fade(@textColor, 60%);
              }
            }
            .progress-bar {
              width: 80%;
              height: 2px;
              border-radius: 2px;
              background-color: fade(#fff, 20%);
              margin-top: 6px;
              .value {
                position: relative;
                height: 2px;
                border-radius: 2px;
                background-image: linear-gradient(to right, #36b0fa, #a1dcff);
                &:after {
                  content: '';
                  position: absolute;
                  z-index: 1;
                  top: 0;
                  right: -1px;
                  width: 2px;
                  height: 2px;
                  border-radius: 2px;
                  background-color: #a1dbff;
                  box-shadow: 0 0 6px 0 #a1dbff, 0 0 6px 0 #a1dbff;
                }
              }
            }
          }
          > .size {
            position: absolute;
            z-index: 3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            color: @textColor;
            .size-wrap {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 58px;
              font-size: 12px;
              font-weight: 400;
              line-height: 1;
              padding: 40px 4px 6px;
              background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.6));
            }
            &.upload-failed {
              color: @dangerColor;
              border: 1px solid @dangerColor;
            }
          }
          .duration {
            position: absolute;
            z-index: 4;
            left: 0;
            right: 0;
            bottom: 0;
            height: 58px;
            font-size: 12px;
            font-weight: 400;
            line-height: 1;
            padding: 40px 4px 6px;
            text-align: right;
            // background: @tooltipBackgroundColor;
          }
        }
        > .row-2 {
          display: flex;
          height: 36px;
          .name {
            flex: 1;
            min-width: 0;
            font-size: 14px;
            line-height: 36px;
            .ellipsis;
          }
          .btn-group {
            display: none;
            justify-content: flex-end;
            align-items: center;
            padding-left: 10px;
            .btn {
              position: relative;
              // width: 14px;
              // height: 14px;
              margin-left: 6px;
              color: @lightIconColor;
              &.disabled {
                color: fade(@textColor, 10%);
                cursor: not-allowed;
              }
            }
          }
        }
        &:hover {
          > .row-1 {
            .layer {
              opacity: 1;
            }
          }
        }
      }
      &:hover {
        .media-item-wrap {
          > .row-2 {
            .btn-group {
              display: flex;
            }
          }
        }
      }
    }
  }
  .guide-toast {
    position: absolute;
    right: 31px;
    bottom: 54px;
    width: 400px;
    height: 56px;
    .wrap {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: fade(@primaryColor, 80%);
      color: #fff;
      &:after {
        content: '';
        position: absolute;
        right: 16px;
        bottom: -10px;
        border-top: 10px solid fade(@primaryColor, 80%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
    }
    .msg {
      flex: 1;
      min-width: 0;
    }
    .cpt-icon-button {
      color: fade(@textColor, 60%);
      &:hover, &:active {
        color: #fff;
      }
    }
  }
}
</style>