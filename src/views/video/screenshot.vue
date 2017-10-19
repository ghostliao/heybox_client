<template>
  <div class="view-video-screenshot">
    <div class="screenshot-list">
      <cpt-screenshot-item v-for="i of imageList" :data="i" :key="i.localId"></cpt-screenshot-item>
    </div>
  </div>
</template>

<script>
import cptScreenshotItem from '@/components/screenshot-item'

export default {
  name: "view-video-screenshot",
  components: {
    'cpt-screenshot-item': cptScreenshotItem
  },
  data () {
    return {
      imageList: []
    }
  },
  methods: {
    initConnect () {
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
      this.imageList.unshift(imageItem)
      console.log(imageItem.createTimeStamp)
      this.updateImageList()
    },
    onImageFileAdded (imageItem) {
      // console.log('onImageFileAdded')
      this._addImageItem(imageItem)
    },
    onImageFileDeleted () {
      // console.log('onImageFileDeleted')
      this.getImageList()
    },
    onImageFileStatusChanged (imageItem) {
      // console.log('onImageFileStatusChanged')
      // todo
      this.getImageList()
    },
    getImageList () {
      // console.log('getImageList')
      maxjia.media.file.getImageList((data) => {
        // console.log(data)
        if (data && data['images']) {
          this.imageList = []
          for (let imageItem of data['images']) {
            this._addImageItem(imageItem)
          }
        } else {
          //should not happen
        }

        // if (this.getParameterByName('image')) {
        //   playVideo(videofile)
        // }

      })
    },
    uploadImage (localId) {
      maxjia.media.file.uploadImage(localId);
    },
    updateImageList () {
      this.imageList = this.imageList.sort(sortBy('createTimeStamp'))
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
      // this.$nextTick(() => {
      //   this.$emit('updateImageList', this.imageList)
      // })
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
    this.initConnect()
    this.getImageList()
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-video-screenshot {
  .screenshot-list {
    display: flex;
    flex-wrap: wrap;
    // max-width: 1072px;
    margin: auto;
    
  }
}
</style>