
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
      // todo
      this.getImageList().then(data => {
        this.mergeMediaList(this.videoList, data)
      })
    },
    getImageList () {
      console.log('getImageList')
      return new Promise((resolve, reject) => {
        maxjia.media.file.getImageList((data) => {
          // console.log(data)
          if (data && data['images']) {
            this.imageList = []
            for (let imageItem of data['images']) {
              this.$set(imageItem, 'fileType', 'image')
              this._addImageItem(imageItem)
            }
            resolve(this.imageList)
          } else {
            //should not happen
          }
  
          // if (this.getParameterByName('image')) {
          //   playVideo(videofile)
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