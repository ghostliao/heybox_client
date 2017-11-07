<template>
  <div class="view-video-lib">
    <media-file-man @updateVideoList="updateVideoList"></media-file-man>
    <div class="media-list">
      <div v-show="mediaList.length <= 0" class="notice">暂无媒体文件</div>
      <cpt-media-item v-for="(i, index) of mediaList" :data="i" :key="i.localId" :manageBar="hasManageBar(mediaList, index)"></cpt-media-item>
    </div>
  </div>
</template>

<script>
// 获取video列表，获取image列表
// 添加两个列表到media list
// 按时间戳排序
// video image 列表更新时

import mediaFileMan from '@/components/media-file-man'
import cptMediaItem from '@/components/media-item'
import videoFile from '@/components/videoFile'
import imageFile from '@/components/imageFile'

export default {
  name: "view-video-lib",
  mixins: [videoFile, imageFile],
  components: {
    'media-file-man': mediaFileMan,
    'cpt-media-item': cptMediaItem
  },
  data () {
    return {
      mediaList: []
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
      for (let i = 0, len = videoList.length; i < len; i++) {
        videoList[i].fileType = 'video'
      }
      for (let i = 0, len = imageList.length; i < len; i++) {
        imageList[i].fileType = 'image'
      }
      this.mediaList = videoList.concat(imageList)
      this.sortMediaList()
    },
    sortMediaList () {
      this.mediaList = this.mediaList.sort(sortBy('createTimeStamp'))
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
        return false
      }
    },
    formDate (t) {
      const timeSpan = t * 1000
      const dateTime = new Date(parseInt(timeSpan))
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const day = dateTime.getDate()
      return `${year}-${month}-${day}`
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
    display: flex;
    flex-wrap: wrap;
    // max-width: 1072px;
    margin: auto;
    .notice {
      width: 100%;
      text-align: center;
      font-size: 14px;
      line-height: 60px;
      color: @secondaryTextColor;
    }
  }
}
</style>