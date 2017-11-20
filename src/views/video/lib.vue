<template>
  <div class="view-video-lib">
    <media-file-man @updateVideoList="updateVideoList"></media-file-man>
    <div class="media-list">
      <transition name="fade" mode="out-in">
        <div v-if="loading" key="loading" class="progress">
          <cpt-circular-progress :size="40" />
        </div>
        <div v-if="!loading && mediaList.length <= 0" key="notice" class="notice">暂无媒体文件</div>
        <div v-if="!loading && mediaList.length > 0" key="list" class="list">
          <cpt-media-item v-for="(i, index) of mediaList" :data="i" :key="i.localId" mediaItemStyle="line" :manageBar="hasManageBar(mediaList, index)" @firstUpload="firstUpload"></cpt-media-item>
        </div>
      </transition>
    </div>
    <!-- S first upload notice dialog -->
    <cpt-dialog :open="firstUploadNoticeDialog" title="" @close="closeFirstUploadNoticeDialog" @hide="closeFirstUploadNoticeDialog" dialogClass="msg-dialog" :overlayOpacity="0.8" cornerClose>
      <div class="first-upload-notice-dialog">
        <cpt-mark success large></cpt-mark>
        <div class="msg">上传成功！</div>
        <div class="desc">审核通过后将会同步至您的小黑盒账号中</div>
        <cpt-button label="知道了" @click="closeFirstUploadNoticeDialog" secondary />
      </div>
    </cpt-dialog>
    <!-- E first upload notice dialog -->
  </div>
</template>

<script>
// 获取video列表，获取image列表
// 添加两个列表到media list
// 按时间戳排序
// video image 列表更新时

import cptCircularProgress from '@/components/circularProgress'
import mediaFileMan from '@/components/media-file-man'
import cptMediaItem from '@/components/media-item'
import videoFile from '@/components/videoFile'
import imageFile from '@/components/imageFile'

export default {
  name: "view-video-lib",
  mixins: [videoFile, imageFile],
  components: {
    'cpt-circular-progress': cptCircularProgress,
    'media-file-man': mediaFileMan,
    'cpt-media-item': cptMediaItem
  },
  data () {
    return {
      loading: true,
      mediaList: [],
      firstUploadNoticeDialog: false
    }
  },
  computed: {
    
  },
  methods: {
    getMediaList () {
      Promise.all([
        this.getVideoList(),
        this.getImageList()
      ]).then(array => {
        this.mergeMediaList(array[0], array[1])
        // this.videoList = null
        // this.imageList = null
      })
    },
    mergeMediaList (videoList, imageList) {
      console.log('merge media list')
      for (let i = 0, len = videoList.length; i < len; i++) {
        videoList[i].fileType = 'video'
      }
      for (let i = 0, len = imageList.length; i < len; i++) {
        imageList[i].fileType = 'image'
      }
      this.mediaList = videoList.concat(imageList)
      this.sortMediaList()
      this.loading = false
    },
    sortMediaList () {
      this.mediaList.sort(sortBy('createTimeStamp'))
      function sortBy (name) {
        return function(o, p) {
          let a, b
          if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name]
            b = p[name]
            if (a === b) {
              return 0
            }
            if (typeof a === typeof b) {
              return a < b ? 1 : -1
            }
            return typeof a < typeof b ? 1 : -1
          } else {
            throw ("error")
          }
        }
      }
    },
    updateVideoList (data) {
      this.videoList = data
    },
    // 给媒体列表添加时间分类
    hasManageBar (list, index) {
      // console.log(index)
      // console.log(list[index])
      if (list[index - 1]) {
        const t1 = this.formDate(list[index - 1].createTimeStamp)
        const t2 = this.formDate(list[index].createTimeStamp)
        if (t1 === t2) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    formDate (t) {
      const timeSpan = t * 1000
      const dateTime = new Date(parseInt(timeSpan))
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const day = dateTime.getDate()
      return `${year}-${month}-${day}`
    },
    firstUpload () {
      console.log('firstUpload')
      this.openFirstUploadNoticeDialog()
    },
    openFirstUploadNoticeDialog () {
      this.firstUploadNoticeDialog = true
    },
    closeFirstUploadNoticeDialog () {
      this.firstUploadNoticeDialog = false
    }
  },
  mounted () {
    this.getMediaList()
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-video-lib {
  .media-list {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    // max-width: 1072px;
    margin: auto;
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .notice {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      text-align: center;
      font-size: 14px;
      color: @secondaryTextColor;
    }
    .list {
      width: 100%;
    }
  }
}

.first-upload-notice-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: @dialogHeight;
  line-height: 22px;
  .msg {
    font-size: 16px;
    color: @textColor;
    margin-top: 12px;
  }
  .desc {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 12px;
  }
}
</style>