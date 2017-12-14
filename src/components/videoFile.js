export default {
  data () {
    return {
      videoList: [],
      videoFile: false
    }
  },
  methods: {
    videoInitConnect (isMoment = false) {
      maxjia.media.file.newVideoAdded.addListener((data) => {
        if (isMoment) { // 精彩时刻总结
          if (data.gameId === this.currentOverlayGameId) {
            this.onVideoFileAdded(data, true)
          }
        } else {
          this.onVideoFileAdded(data)
        }        
      })
      maxjia.media.file.videoDeleted.addListener(() => {
        !isMoment && this.onVideoFileDeleted()
      })
      maxjia.media.file.videoFileStatusChanged.addListener((data) => {
        this.onVideoFileStatusChanged(data)
      })
    },
    addVideoItem (videoItem) {
      // console.log('addVideoItem')
      this.$set(videoItem, 'fileType', 'video')
      // console.log(this.videoList)
      this.videoList.unshift(videoItem)
      // console.log(videoItem)
    },
    addVideoItemToMomentList (videoItem) {
      this.$set(videoItem, 'fileType', 'video')
      this.mediaList.push(videoItem)
    },
    onVideoFileAdded (videoItem, isMoment = false) {
      // console.log('onVideoFileAdded')
      if (isMoment && videoItem.isMomentCapture) {
        this.addVideoItemToMomentList(videoItem)
      } else {
        this.addVideoItem(videoItem)
        // BUG: 新增文件列表显示两个
        this.getVideoList().then(data => {
          this.mergeMediaList(this.videoList, this.imageList)
        })
      }
    },
    onVideoFileDeleted () {
      // console.log('onVideoFileDeleted')
      this.getVideoList().then(data => {
        this.mergeMediaList(data, this.imageList)
      })
    },
    onVideoFileStatusChanged (videoItem) {
      // console.log('onVideoFileStatusChanged')
      const list = this.mediaList
      for (let i = 0, len = list.length; i < len; i++) {
        let mediaItem = list[i]
        if (mediaItem.fileType === 'video' && mediaItem.localId === videoItem.localId) {
          this.$set(mediaItem, 'uploadFailed', videoItem.uploadFailed)
          this.$set(mediaItem, 'uploadFinished', videoItem.uploadFinished)
          this.$set(mediaItem, 'uploadProgress', videoItem.uploadProgress)
          this.$set(mediaItem, 'uploading', videoItem.uploading)
          break
        }
      }

      // this.getVideoList().then(data => {
      //   this.mergeMediaList(data, this.imageList)
      // })
    },
    getVideoList () {
      console.log('get video list')
      return new Promise((resolve, reject) => {
        maxjia.media.file.getVideoList((data) => {
          if (data && data['videos']) {
            this.videoList = []
            // console.log('getVideoList')
            for (let videoItem of data['videos']) {
              this.addVideoItem(videoItem)
            }
            resolve(this.videoList)
          } else {
            //should not happen
          }
  
          // if (this.getParameterByName('video')) {
          //   this.playVideo(videofile)
          // }
  
        })
      })
    },
    uploadVideo (localId) {
      maxjia.media.file.uploadVideo(localId);
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
    // playVideo (file) {
    //   if (this.setCurrentVideo(file)) {
    //     const video = document.getElementById('single-play')
    //     video.play()
    //   }
    // }
  },
  mounted () {
    // this.videoInitConnect()
    // this.getVideoList()
  }
}