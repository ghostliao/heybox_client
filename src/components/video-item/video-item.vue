<template>
  <div class="cpt-video-item">
    <div class="video-item" @click="playVideo(data.file)">
      <div class="col col-1">
        <!-- <div class="thumbnail" v-lazy:background-image="thumbnail"> -->
        <div class="thumbnail">
          <img v-lazy="thumbnail" alt="">
          <!-- <img :src="thumbnail" alt=""> -->
          <!-- <div class="thumbnail" :style="{ backgroundImage: 'url(\'max-file://video/' + data.thumbnail + '\')' }"> -->
        </div>
        <div class="layer">
          <div class="play">
            <cpt-icon value="start-fill" :size="24"></cpt-icon>
          </div>
        </div>
      </div>
      <div class="col col-2">
        <span class="name">{{ data.file | fileName }}</span>
        <span class="duration">{{ data.duration | duration }}</span>        
      </div>
      <div class="col col-3">
        <span class="time">{{ data.createTimeStamp | formDate(1) }}</span>
      </div>
      <div class="col col-4">
        <div class="size">
          <span class="upload-size" v-show="data.uploading">{{ data.fileSize * data.uploadProgress | fileSize }}</span>
          <span v-show="data.uploading">/</span>
          <span class="full-size">{{ data.fileSize | fileSize }}</span>
        </div>
        <div class="progress-bar" v-show="data.uploading">
          <div class="value" :style="{ width: data.uploadProgress * 100 + '%' }"></div>
        </div>
        <div class="progress-msg" v-show="data.uploadFinished">已上传</div>
        <div class="progress-msg" v-show="data.uploadFailed">上传失败</div>
      </div>
      <div class="col col-5">
        <div class="btn-group">              
          <div class="btn">
            <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteVideo" danger></cpt-icon-button>
          </div>
          <div class="btn">
            <cpt-icon-button icon="upload-fill" :disabled="!(data.isMomentCapture && !data.uploadFinished && !data.uploading)" @click.stop="uploadVideo(data.localId)"></cpt-icon-button>              
          </div>
          <div class="btn">
            <cpt-icon-button icon="search-file-fill" @click.stop="locateFileInExplorer({ url: data.file })"></cpt-icon-button>
          </div>
        </div>
      </div>
    </div>
    <!-- S delete confirm dialog -->
    <cpt-dialog :open="deleteDialog" title="" @close="closeDeleteDialog" @hide="closeDeleteDialog" dialogClass="delete-dialog" :overlayOpacity="0.8" cornerClose>
      <div slot="title" class="title">删除</div>
      <div class="content">确认删除所选文件/分组吗？</div>
      <cpt-button slot="actions" label="取消" @click="closeDeleteDialog" secondary narrow />
      <cpt-button slot="actions" label="确认" @click="_deleteVideo" :param1="data.localId" primary narrow />
    </cpt-dialog>
    <!-- E delete confirm dialog -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "cpt-video-item",
  components: {
  },
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      deleteDialog: false
    }
  },
  computed: {
    thumbnail () {
      return 'max-file://' + this.data.thumbnail.replace(':', '')
    }
  },
  methods: {
    ...mapActions([
      'playVideoFile',
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
        'local': true,
        'file': videoSource
      })

      // var video = document.getElementById('single-play')
      // video.load()

      // video.addEventListener('load', () => {
      //   this.play()
      // })
    },
    // 上传视频
    uploadVideo (localId) {
      // console.log('upload')
      maxjia.media.file.uploadVideo(localId)
    },
    deleteVideo () {
      this.openDeleteDialog()
    },
    _deleteVideo (localId) {
      console.log('delete ' + localId)
      maxjia.media.file.deleteVideo(localId)
      this.closeDeleteDialog()
    }
  },
  mounted () {
    // console.log('thumb url: ')
    // console.log(this.data.thumbnail)
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-video-item {
  width: 100%;
  margin-bottom: 2px;
  .video-item {
    position: relative;
    display: flex;
    height: 64px;
    // border: 1px solid #151A20;
    border-radius: 2px;
    background: @blockBackgroundColor;
    // background-image: linear-gradient(to bottom, #2a2e34, #30343a);
    // box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
    // box-shadow: inset 0 0 0 1px #151A20;
    cursor: pointer;
    overflow: hidden;
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
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
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
          // background: fade(#000, 90%);
          // border-radius: 2px;
          
          // padding-left: 18px;
          // &:before {
          //   content: '';
          //   position: absolute;
          //   top: 4px;
          //   left: 6px;
          //   border-left: 6px solid fade(@textColor, 60%);
          //   border-top: 4px solid transparent;
          //   border-bottom: 4px solid transparent;
          // }
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
}
</style>