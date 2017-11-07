export default {
  data () {
    return {
      // videoList: new Map(),
      videoList: [],
      videoFile: false
    }
  },
  methods: {
    videoInitConnect () {
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
      // console.log('addVideoItem')
      this.$set(videoItem, 'fileType', 'video')
      this.videoList.unshift(videoItem)
      // console.log(videoItem.createTimeStamp)
    },
    onVideoFileAdded (videoItem) {
      // console.log('onVideoFileAdded')
      this._addVideoItem(videoItem)
      this.mergeMediaList(this.videoList, this.imageList)
    },
    onVideoFileDeleted () {
      // console.log('onVideoFileDeleted')
      this.getVideoList().then(data => {
        this.mergeMediaList(data, this.imageList)
      })
    },
    onVideoFileStatusChanged (videoItem) {
      // console.log('onVideoFileStatusChanged')
      //todo
      this.getVideoList().then(data => {
        this.mergeMediaList(data, this.imageList)
      })
    },
    getVideoList () {
      console.log('getVideoList')
      return new Promise((resolve, reject) => {
        maxjia.media.file.getVideoList((data) => {
          if (data && data['videos']) {
            this.videoList = []
            // console.log('getVideoList')
            for (let videoItem of data['videos']) {
              this.$set(videoItem, 'fileType', 'video')
              this._addVideoItem(videoItem)
            }
            resolve(this.videoList)
          } else {
            //should not happen
          }
  
          if (this.getParameterByName('video')) {
            playVideo(videofile)
          }
  
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
    playVideo (file) {
      if (setCurrentVideo(file)) {
        var video = document.getElementById('single-play')
        video.play()
      }
    }
  },
  mounted () {
    this.videoInitConnect()
    // this.getVideoList()
  }
}