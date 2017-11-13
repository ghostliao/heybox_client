<template>
  <div class="view-video-desktop">
    <video-file-man @updateVideoList="updateVideoList"></video-file-man>
    <div class="video-list">
      <div v-show="videoList.length <= 0" class="notice">暂无媒体文件</div>
      <cpt-video-item v-for="i of videoList" :data="i" :key="i.localId"></cpt-video-item>
    </div>
  </div>
</template>

<script>
import videoFileMan from '@/components/video-file-man'
import cptVideoItem from '@/components/video-item'

export default {
  name: "view-video-desktop",
  components: {
    'video-file-man': videoFileMan,
    'cpt-video-item': cptVideoItem
  },
  data () {
    return {
      videoList: [
        // { "createTimeStamp": 1505478630, "duration": 7, "file": "C:/Users/max/Videos/Desktop-2017-9-15 20-30-21-138.mp4", "fileSize": 1024134, "isMomentCapture": true, "localId": 1, "thumbnail": "C:/Users/max/Videos/thumb/Desktop-2017-9-15 20-30-21-138.png", "uploadFailed": false, "uploadFinished": false, "uploadProgress": 0, "uploading": false },
        // { "createTimeStamp": 1505478630, "duration": 7, "file": "C:/Users/max/Videos/Desktop-2017-9-15 20-30-21-138.mp4", "fileSize": 1024134, "isMomentCapture": true, "localId": 1, "thumbnail": "C:/Users/max/Videos/thumb/Desktop-2017-9-15 20-30-21-138.png", "uploadFailed": false, "uploadFinished": false, "uploadProgress": 0, "uploading": false },
        // { "createTimeStamp": 1505478630, "duration": 7, "file": "C:/Users/max/Videos/Desktop-2017-9-15 20-30-21-138.mp4", "fileSize": 1024134, "isMomentCapture": true, "localId": 1, "thumbnail": "C:/Users/max/Videos/thumb/Desktop-2017-9-15 20-30-21-138.png", "uploadFailed": false, "uploadFinished": false, "uploadProgress": 0, "uploading": false },
        // { "createTimeStamp": 1505478630, "duration": 7, "file": "C:/Users/max/Videos/Desktop-2017-9-15 20-30-21-138.mp4", "fileSize": 1024134, "isMomentCapture": true, "localId": 1, "thumbnail": "C:/Users/max/Videos/thumb/Desktop-2017-9-15 20-30-21-138.png", "uploadFailed": false, "uploadFinished": false, "uploadProgress": 0, "uploading": false },
        // { "createTimeStamp": 1505478630, "duration": 7, "file": "C:/Users/max/Videos/Desktop-2017-9-15 20-30-21-138.mp4", "fileSize": 1024134, "isMomentCapture": true, "localId": 1, "thumbnail": "C:/Users/max/Videos/thumb/Desktop-2017-9-15 20-30-21-138.png", "uploadFailed": false, "uploadFinished": false, "uploadProgress": 0, "uploading": false }
      ]
    }
  },
  methods: {
    updateVideoList (data) {
      this.videoList = data
    }
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-video-desktop {
  .video-list {
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