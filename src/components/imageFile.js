
export default {
  data () {
    return {
      imageList: []
    }
  },
  methods: {
    imageInitConnect (isMoment = false) {
      maxjia.media.file.newImageAdded.addListener((data) => {
        if (isMoment) { // 精彩时刻总结
          if (data.gameId === this.currentOverlayGameId) {
            this.onImageFileAdded(data, true)
          } 
        } else {
          this.onImageFileAdded(data)
        }
      })
      maxjia.media.file.imageDeleted.addListener(() => {
        !isMoment && this.onImageFileDeleted()
      })
      maxjia.media.file.imageFileStatusChanged.addListener((data) => {
        this.onImageFileStatusChanged(data)
      })
    },
    addImageItem (imageItem) {
      this.$set(imageItem, 'fileType', 'image')
      this.imageList.unshift(imageItem)
      // console.log(imageItem.createTimeStamp)
    },
    addImageItemToMomentList (imageItem) {
      this.$set(imageItem, 'fileType', 'image')
      this.mediaList.push(imageItem)
    },
    onImageFileAdded (imageItem, isMoment = false) {
      // console.log('onImageFileAdded')
      if (isMoment) {
        this.addImageItemToMomentList(imageItem)
      } else {
        this.addImageItem(imageItem)
        this.mergeMediaList(this.videoList, this.imageList)
      }
    },
    onImageFileDeleted () {
      // console.log('onImageFileDeleted')
      this.getImageList().then(data => {
        this.mergeMediaList(this.videoList, data)
      })
    },
    onImageFileStatusChanged (imageItem) {
      // console.log('onImageFileStatusChanged')
      const list = this.mediaList
      for (let i = 0, len = list.length; i < len; i++) {
        let mediaItem = list[i]
        if (mediaItem.fileType === 'image' && mediaItem.localId === imageItem.localId) {
          this.$set(mediaItem, 'uploadFailed', imageItem.uploadFailed)
          this.$set(mediaItem, 'uploadFinished', imageItem.uploadFinished)
          this.$set(mediaItem, 'uploadProgress', imageItem.uploadProgress)
          this.$set(mediaItem, 'uploading', imageItem.uploading)
          break
        }
      }

      // this.getImageList().then(data => {
      //   this.mergeMediaList(this.videoList, data)
      // })
    },
    getImageList () {
      console.log('get image list')
      return new Promise((resolve, reject) => {
        maxjia.media.file.getImageList((data) => {
          // console.log(data)
          if (data && data['images']) {
            this.imageList = []
            for (let imageItem of data['images']) {
              this.addImageItem(imageItem)
            }
            resolve(this.imageList)
          } else {
            //should not happen
          }
  
          // if (this.getParameterByName('image')) {
          //   this.checkImage(imagefile)
          // }
  
        })
      })
    },
    uploadImage (localId) {
      maxjia.media.file.uploadImage(localId);
    },
    getImageItem (id) {
      for (let i of this.imageList) {
        if (i.localId === id) {
          this.imageFile = i.file
        }
      }
      return this.imageFile
      // return this.imageList.get(id)
    }
  },
  mounted () {
    // this.imageInitConnect()
    // this.getImageList()
  }
}