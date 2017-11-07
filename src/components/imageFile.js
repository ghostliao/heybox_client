
export default {
  data () {
    return {
      imageList: []
    }
  },
  methods: {
    imageInitConnect () {
      maxjia.media.file.newImageAdded.addListener((data) => {
        this.onImageFileAdded(data)
      })
      maxjia.media.file.imageDeleted.addListener(() => {
        this.onImageFileDeleted()
      })
      maxjia.media.file.imageFileStatusChanged.addListener((data) => {
        this.onImageFileStatusChanged(data)
      })
    },
    _addImageItem (imageItem) {
      this.$set(imageItem, 'fileType', 'image')
      this.imageList.unshift(imageItem)
      // console.log(imageItem.createTimeStamp)
    },
    onImageFileAdded (imageItem) {
      // console.log('onImageFileAdded')
      this._addImageItem(imageItem)
      this.mergeMediaList(this.videoList, this.imageList)
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
      console.log('getImageList')
      return new Promise((resolve, reject) => {
        maxjia.media.file.getImageList((data) => {
          // console.log(data)
          if (data && data['images']) {
            this.imageList = []
            for (let imageItem of data['images']) {
              this._addImageItem(imageItem)
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
    this.imageInitConnect()
    // this.getImageList()
  }
}