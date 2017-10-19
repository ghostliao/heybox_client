<template>
  <div class="cpt-video-file-man">
    <!-- <div class="json">{{videoList}}</div> -->
  </div>
</template>

<script>
export default {
  name: "video-file-man",
  components: {},
  data () {
    return {
      // videoList: new Map(),
      videoList: [],
      videoFile: false
    }
  },
  methods: {
    initConnect () {
      maxjia.media.file.newVideoAdded.addListener((data) => {
        this.onVideoFileAdded(data)
      })
      maxjia.media.file.videoDeleted.addListener(() => {
        this.onVideoFileDeleted()
      })
      maxjia.media.file.videoFileStatusChanged.addListener((data) => {
        this.onVideoFileStatusChanged(data)
      })
    },
    _addVideoItem (videoItem) {
      this.videoList.unshift(videoItem)
      this.updateVideoList()
      // console.log(videoItem.createTimeStamp)
    },
    onVideoFileAdded (videoItem) {
      // console.log('onVideoFileAdded')
      this._addVideoItem(videoItem)
    },
    onVideoFileDeleted () {
      // console.log('onVideoFileDeleted')
      this.getVideoList()
    },
    onVideoFileStatusChanged (videoItem) {
      // console.log('onVideoFileStatusChanged')
      //todo
      this.getVideoList()
    },
    getVideoList () {
      // console.log('getVideoList')
      maxjia.media.file.getVideoList((data) => {
        if (data && data['videos']) {
          this.videoList = []
          for (let videoItem of data['videos']) {
            this._addVideoItem(videoItem)
          }
        } else {
          //should not happen
        }

        if (this.getParameterByName('video')) {
          playVideo(videofile)
        }

      })
    },
    uploadVideo (localId) {
      maxjia.media.file.uploadVideo(localId);
    },
    updateVideoList () {
      this.videoList = this.videoList.sort(sortBy('createTimeStamp'))
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
      this.$nextTick(() => {
        this.$emit('updateVideoList', this.videoList)
      })
    },
    getVideoItem (id) {
      for (let i of this.videoList) {
        if (i.localId === id) {
          this.videoFile = i.file
        }
      }
      return this.videoFile
      // return this.videoList.get(id)
    },
    setCurrentVideo (id) {
      if (this.getVideoItem(id)) {
        var video = document.getElementById('single-play')

        this.videoSource = 'max-file://video/' + this.videoFile
        video.load()
        return true
      } else {
        return false
      }
    },
    playVideo (file) {
      if (setCurrentVideo(file)) {
        var video = document.getElementById('single-play')
        video.play()
      }
    }
  },
  mounted () {
    this.initConnect()
    // console.log('video file man')
    this.getVideoList()
  }
}

</script>
<style lang="less">

</style>