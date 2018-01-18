<template>
  <div class="cpt-media-item-cloud" :class="mediaItemStyle" v-show="manageBarOpen && mediaItemShow">
    <div class="media-item list" v-show="mediaItemStyle === 'list'" @click="mediaAction(data.file)">
      <div class="col col-1">
        <div class="thumbnail">
          <img v-lazy="thumbnail">
        </div>
        <div class="layer">
          <div class="play">
            <cpt-icon v-if="data.fileType === 'video'" value="start-fill" :size="24"></cpt-icon>
            <cpt-icon v-if="data.fileType === 'image'" value="fullscreen-fill" :size="24"></cpt-icon>
          </div>
        </div>
      </div>
      <div class="col col-2">
        <span class="name">{{ data.id }}</span>
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
          <div v-if="data.fileType === 'video'" class="btn">
            <cpt-icon-button icon="link-fill" :tooltip="linkTooltip" @click.stop="copyLink(data.id)"></cpt-icon-button>
          </div>
          <div class="btn">
            <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteMedia" danger></cpt-icon-button>
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
          <div class="layer" :class="{ 'hover': data.uploading }">
            <div class="name">{{ data.id }}</div>
            <div class="upload-status">
              <div class="icon-fail" v-show="data.uploadFailed">
                <cpt-icon value="warning-fill" :size="12"></cpt-icon>
              </div>
              <div class="msg" v-show="data.uploadFailed">上传失败</div>
            </div>
            <div class="progress-bar" v-show="data.uploading">
              <div class="value" :style="{ width: data.uploadProgress * 100 + '%' }"></div>
            </div>
            <div class="size">
              <template v-if="data.fileType === 'video'">
                <span class="upload-size" v-show="data.uploading">{{ data.fileSize * data.uploadProgress | fileSize }}</span>
                <span class="upload-size" v-show="data.uploading">/</span>
                <span class="full-size">{{ data.fileSize | fileSize }}</span>
              </template>
            </div>
            <div class="btn-group">
              <div class="btn">
                <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteMedia" danger></cpt-icon-button>
              </div>
              <div v-if="data.fileType === 'video'" class="btn">
                <cpt-icon-button icon="link-fill" :tooltip="linkTooltip" @click.stop="copyLink(data.id)"></cpt-icon-button>
              </div>
            </div>
          </div>
          <div class="duration" v-if="data.fileType === 'video'">
            <span>{{ data.duration | duration }}</span>
          </div>
          <div class="bottom-mask" v-if="data.fileType === 'video'"></div>
        </div>
      </div>
    </div>

    <input v-if="data.fileType === 'video'" type="text" :value="videoShareUrl" class="video-share-url" ref="videoShareUrl">

    <!-- S delete confirm dialog -->
    <cpt-dialog :open="deleteDialog" title="" @close="closeDeleteDialog" @hide="closeDeleteDialog" dialogClass="msg-dialog" :overlayOpacity="0.8" cornerClose>
      <div slot="title" class="title">删除文件</div>
      <div class="content">您确定从服务端删除该项目吗？</div>
      <cpt-button slot="actions" label="取消" @click="closeDeleteDialog" secondary long />
      <cpt-button slot="actions" label="删除" @click="_deleteMedia" danger long />
    </cpt-dialog>
    <!-- E delete confirm dialog -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Bus from '@/components/bus'
import clickoutside from '@/components/internal/clickoutside'

export default {
  name: "cpt-media-item-cloud",
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
    },
    mediaItemShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      deleteDialog: false,
      manageBarOpen: true,
      linkState: 0
    }
  },
  computed: {
    thumbnail () {
      if (this.data.fileType === 'video') {
        return this.data.thumbnail
      } else if (this.data.fileType === 'image') {
        return this.data.file
      }
    },
    linkTooltip () {
      if (this.linkState === 0) {
        return '复制链接到剪贴板'
      } else if (this.linkState === 1) {
        return '链接已复制到剪贴板'
      }
    },
    videoShareUrl () {
      return this.$store.state.origin[this.$store.state.config.env] + '/pc/media/share/?heybox_id=' + this.$store.state.accountInfo.uid + '&id=' + this.data.id
    }
  },
  methods: {
    ...mapActions([
      'playVideoFile',
      'checkImageFile'
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
      this.$store.state.videoPlayer = true
      this.getVideoSrc().then(res => {
        this.playVideoFile({
          'local': false,
          'file': res
        })
      })

      // var video = document.getElementById('single-play')
      // video.load()

      // video.addEventListener('load', () => {
      //   this.play()
      // })
    },
    // 查看图片
    checkImage (url) {
      this.checkImageFile({
        'local': false,
        'file': url
      })
    },
    mediaAction (file) {
      if (this.data.fileType === 'video') {
        this.playVideo(file)
      } else if (this.data.fileType === 'image') {
        this.checkImage(file)
      }
    },
    deleteMedia () {
      this.openDeleteDialog()
      this.__REPORT('view_media_cloud_delete')
    },
    _deleteMedia () {
      console.log('delete ' + this.data.id)
      const url = '/pc/del_media/'
      const options = {
        params: {
          'heybox_id': this.$store.state.accountInfo.uid,
          'os_type': 'pc',
          'id': this.data.id
        }
      }
      this.$ajax(url, options).then(res => {
        const data = res.data
        this.$emit('deleteMedia', this.data.id)
        this.closeDeleteDialog()
        if (data.status === 'ok') {
          
        } else {

        }
      }).catch(error => {
        console.log(error)
      })
    },
    formDate (t) {
      const timeSpan = t * 1000
      const dateTime = new Date(parseInt(timeSpan))
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const day = dateTime.getDate()
      return `${year}-${month}-${day}`
    },
    // 一键复制资源链接
    copyLink (id) {
      this.__REPORT('view_media_cloud_copy_link')
      Bus.$emit('copyLink')
      this.$refs.videoShareUrl.select()
      document.execCommand('copy')
      this.linkState = 1
    },
    getVideoSrc () {
      return new Promise((resolve, reject) => {
        const url = '/pc/refresh_media/'
        const options = {
          params: {
            'heybox_id': this.$store.state.accountInfo.uid,
            'os_type': 'pc',
            'id': this.data.id
          }
        }
        this.$ajax(url, options).then(res => {
          const data = res.data
          if (data.status === 'ok') {
            resolve(data.result.url)
          } else {

          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    
  },
  created () {
    Bus.$on('toggleManageBar', data => {
      if (this.formDate(data[0]) === this.formDate(this.data.createTimeStamp)) {
        this.manageBarOpen = !this.manageBarOpen
      }
    })
    Bus.$on('copyLink', data => {
      this.linkState = 0
    })
    
  },
  mounted () {
    // console.log(this.data)
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-media-item-cloud {
  position: relative;
  &.list {
    width: 100%;
  }
  &.grid {
    width: 16.666667%;
    padding-right: 20px;
    // .common-transition;
    // transition-delay: .3s;
    @media (max-width: 1600px) {
      width: 20%;
    }
    @media (max-width: 1280px) {
      width: 25%;
    }
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
      margin-bottom: 20px;
      cursor: pointer;
      .media-item-wrap {
        > .row-1 {
          position: relative;
          padding-top: 56.25%;
          border-radius: 2px;
          // overflow: hidden;
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
            flex-direction: column;
            background: fade(#14191e, 80%);
            padding: 0 8px;
            opacity: 0;
            // .common-transition;
            &.hover {
              opacity: 1;
            }
            .name {
              font-size: 14px;
              line-height: 20px;
              padding: 5px 0;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .upload-status {
              flex: 1;
              min-height: 0;
              display: flex;
              font-size: 14px;
              .icon-fail {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: @dangerColor;
                font-size: 0;
                font-weight: 300;
              }
              .msg {
                line-height: 16px;
                height: 16px;
                padding-left: 8px;
              }
            }
            .progress-bar {
              height: 2px;
              border-radius: 2px;
              background-color: fade(#fff, 20%);
              margin-bottom: 8px;
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
            .size {
              color: fade(@textColor, 60%);
              font-size: 12px;
              line-height: 12px;
              height: 12px;
              text-align: right;
              .upload-size {
                color: @textColor;
              }
            }
            .btn-group {
              display: flex;
              align-items: center;
              height: 32px;
              padding: 8px 0;
              .btn {
                position: relative;
                // width: 14px;
                // height: 14px;
                margin-right: 6px;
                color: @lightIconColor;
                &.disabled {
                  color: fade(@textColor, 10%);
                  cursor: not-allowed;
                }
              }
            }
          }
          .duration {
            position: absolute;
            z-index: 3;
            right: 0;
            bottom: 0;
            font-size: 12px;
            font-weight: 400;
            line-height: 32px;
            text-align: right;
            padding: 0 8px;
            span {
              position: relative;
              &:before {
                content: '';
                position: absolute;
                top: 3px;
                left: -14px;
                border-left: 8px solid fade(@textColor, 60%);
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
              }
            }
          }
          .bottom-mask {
            position: absolute;
            z-index: 1;
            left: 0;
            right: 0;
            bottom: 0;
            height: 58px;
            background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.6));
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
    z-index: 1;
    right: 31px;
    bottom: 54px;
    width: 400px;
    height: 56px;
    &.hide {
      display: none !important;
    }
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
      .never {
        text-decoration: underline;
        cursor: pointer;
        margin-left: 10px;
        &:hover {
          opacity: .6;
        }
      }
    }
    .cpt-icon-button {
      color: fade(@textColor, 60%);
      &:hover, &:active {
        color: #fff;
      }
    }
  }
}

.video-share-url {
  position: absolute;
  left: -9999px;
}
</style>