<template>
  <div class="cpt-screenshot-item">
    <div class="screenshot-item" @click="checkImage(data.file)">
      <div class="col col-1">
        <!-- <div class="thumbnail" v-lazy:background-image="thumbnail"> -->
        <div class="thumbnail">
          <img v-lazy="thumbnail" alt="">
          <!-- <img :src="thumbnail" alt=""> -->
          <!-- <div class="thumbnail" :style="{ backgroundImage: 'url(\'max-file://video/' + data.thumbnail + '\')' }"> -->
        </div>
        <div class="layer">
          <div class="play">
            <cpt-icon value="fullscreen-fill" :size="24"></cpt-icon>
          </div>
        </div>
      </div>
      <div class="col col-2">
        <span class="name">{{ data.file | fileName }}</span>
        <!-- <span class="duration">{{ data.duration | duration }}</span> -->
      </div>
      <div class="col col-3">
        <span class="time">{{ data.createTimeStamp | formDate(1) }}</span>
      </div>
      <div class="col col-4">
        <!-- <div class="size">
          <span class="upload-size" v-show="data.uploading">{{ data.fileSize * data.uploadProgress | fileSize }}</span>
          <span v-show="data.uploading">/</span>
          <span class="full-size">{{ data.fileSize | fileSize }}</span>
        </div> -->
        <div class="progress-bar" v-show="data.uploading">
          <div class="value" :style="{ width: data.uploadProgress * 100 + '%' }"></div>
        </div>
        <div class="progress-msg" v-show="data.uploadFinished">已上传</div>
        <div class="progress-msg" v-show="data.uploadFailed">上传失败</div>
      </div>
      <div class="col col-5">
        <div class="btn-group">
          <div class="btn">
            <cpt-icon-button icon="delete-fill" :iconSize="16" @click.stop="deleteImage(data.localId)" danger></cpt-icon-button>
          </div>
          <div class="btn">
            <cpt-icon-button icon="upload-fill" :disabled="!(!data.uploadFinished && !data.uploading)" @click.stop="uploadImage(data.localId)"></cpt-icon-button>              
          </div>
          <div class="btn">
            <cpt-icon-button icon="search-file-fill" @click.stop="locateFileInExplorer({ url: data.file })"></cpt-icon-button>              
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "cpt-screenshot-item",
  components: {
  },
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    thumbnail () {
      return 'max-file://' + this.data.thumbnail.replace(':', '')
    }
  },
  methods: {
    ...mapActions([
      'checkImageFile',
      'locateFileInExplorer'
    ]),
    // 查看图片
    checkImage (url) {
      // console.log('check')
      const imageSource = url
      this.checkImageFile({
        'local': true,
        'file': imageSource
      })
    },
    // 上传图片
    uploadImage (localId) {
      // console.log(localId)
      maxjia.media.file.uploadImage(localId)
    },
    deleteImage (localId) {
      // console.log('delete')
      maxjia.media.file.deleteImage(localId)
    }
  },
  mounted () {
    // console.log('thumb url: ')
    // console.log(this.data)
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-screenshot-item {
  width: 100%;
  margin-bottom: 2px;
  .screenshot-item {
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
      .btn-group {
        display: flex;
        justify-content: flex-end;
        padding-right: 15px;
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