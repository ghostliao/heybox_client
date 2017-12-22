
export default {
  data () {
    return {
      itemList: [],
      statusUpdateLock: false, // 视图更新锁
      statusUpdateFrequency: 500 // 更新频率（ms）
    }
  },
  methods: {
    wallpaperInitConnect () {
      maxjia.wallpaper.newWallPaperAdded.addListener((data) => {
        this.onWallpaperFileAdded(data)
      })
      maxjia.wallpaper.wallPaperDeleted.addListener((data) => {
        this.onWallpaperFileDeleted(data)
      })
      maxjia.wallpaper.wallPaperFileStatusChanged.addListener((data) => {
        if (data.downloadAborted || data.downloadFailed || (!data.downloading && data.downloadFinished)) {
          this.onWallpaperFileStatusChanged(data)
        } else {
          if (!this.statusUpdateLock) {
            this.onWallpaperFileStatusChanged(data)
            this.statusUpdateLock = true
            setTimeout(() => {
              this.statusUpdateLock = false
            }, this.statusUpdateFrequency)
          }
        }
      })
      maxjia.wallpaper.wallPaperChanged.addListener((data) => {
        this.onWallpaperChanged(data)
      })
    },
    onWallpaperFileAdded (wallpaperItem) {
      // console.log('wallpaper file added')
      if (this.page === 'local') {
        this.addWallpaperItem(wallpaperItem)
      }
    },
    onWallpaperFileDeleted (wallpaperItem) {
      // console.log('wallpaper file deleted')
      if (this.page === 'local') {
        this.wallpaperControler = false
        this.getLocalWallpaperList().then(data => {
          this.wallpaperList = data
        })
      }
      if (this.page === 'store') {
        for (let i = 0, len = this.wallpaperList.length; i < len; i++) {
          let item = this.wallpaperList[i]
          if (item.ID === wallpaperItem.ID) {
            this.$set(item, 'downloadFinished', false)
            console.log(item)
            break
          }
        }
      }
    },
    onWallpaperFileStatusChanged (wallpaperItem) {
      console.log('onWallpaperFileStatusChanged')
      // let list = this.wallpaperList
      // if (from === 'local') {
      //   list = this.itemList
      // } else {
      //   list = this.wallpaperList
      // }
      if (this.page === 'store') {
        for (let i = 0, len = this.wallpaperList.length; i < len; i++) {
          let item = this.wallpaperList[i]
          if (item.ID === wallpaperItem.ID) {
            this.$set(item, 'downloadAborted', wallpaperItem.downloadAborted)
            this.$set(item, 'downloadFailed', wallpaperItem.downloadFailed)
            this.$set(item, 'downloadFinished', wallpaperItem.downloadFinished)
            this.$set(item, 'downloadProgress', wallpaperItem.downloadProgress)
            this.$set(item, 'downloading', wallpaperItem.downloading)
            break
          }
        }

        // if (this.fileData.ID === wallpaperItem.ID) {
        //   this.fileData = wallpaperItem
        // }
      }
      // console.log(wallpaperItem)
      // if (from === 'local') this.wallpaperList = list
      if (this.page === 'local') {
        if (wallpaperItem.downloadProgress === 1 && wallpaperItem.downloadFinished) {
          this.getLocalWallpaperList().then(data => {
            this.wallpaperList = data
          })
        }
      }
    },
    onWallpaperChanged (wallpaperItem) {
      // console.log('wallpaper changed', wallpaperItem)
      if (this.page === 'local') {
        this.playing = true
        this.wallpaperControler = !(wallpaperItem.ID === '')
        for (let i = 0, len = this.wallpaperList.length; i < len; i++) {
          let item = this.wallpaperList[i]
          if (item.ID === wallpaperItem.ID) {
            this.$set(item, 'isCurrent', true)
          } else {
            this.$set(item, 'isCurrent', false)
          }
        }
      }
    },
    addWallpaperItem (wallpaperItem) {
      this.itemList.unshift(wallpaperItem)
      // console.log(wallpaperItem.createTimeStamp)
    },
    getLocalWallpaperList () {
      console.log('get wallpaper list')
      return new Promise((resolve, reject) => {
        maxjia.wallpaper.getWallPaperList((data) => {
          // console.log(data)
          if (data && data['wallPapers']) {
            this.itemList = []
            for (let wallpaperItem of data['wallPapers']) {
              if (this.page === 'local' && wallpaperItem.isCurrent) {
                this.wallpaperControler = true
              }
              this.addWallpaperItem(wallpaperItem)
            }
            resolve(this.itemList)
          } else {
            //should not happen
          }
  
        })
      })
    },
    downloadWallpaper (config) {
      console.log('download wallpaper')
      // console.log(config)
      const id = config.id
      const url = config.url
      const name = config.name
      const size = config.size
      const duration = config.duration
      const thumb = config.thumb
      const width = config.width
      const height = config.height
      const type = config.type || 1
      maxjia.wallpaper.downloadWallPaper(id, url, name, size, duration, thumb, width, height, type)
    },
    deleteWallpaper (id) {
      maxjia.wallpaper.deleteWallPaper(id)
    },
    setWallpaper (id) {
      maxjia.wallpaper.setWallPaper(id)
    },
    removeWallpaper () {
      maxjia.wallpaper.setWallPaper('')
    },
    wallpaperPlayerSwitch (val) {
      if (val === 0) {
        maxjia.wallpaper.pauseVideoWallPaper()
      } else if (val === 1) {
        maxjia.wallpaper.startVideoWallPaper()
      }
    },
    setVideoVolumeSize (val) {
      maxjia.wallpaper.setVideoVolumeSize(Number(val / 100))
      console.log('volume size: ' + val)
    }
  },
  created () {
    // this.wallpaperInitConnect()
  },
  mounted () {
    // this.getLocalWallpaperList()
  }
}