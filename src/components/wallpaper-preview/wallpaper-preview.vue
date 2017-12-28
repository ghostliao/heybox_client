<template>
  <div class="cpt-wallpaper-preview" :style="previewStyle">
    <div class="preview-wrap">
      <div class="close" @click="closePreview">
        <cpt-icon-button icon="close" :iconSize="24"></cpt-icon-button>
      </div>
      <div class="thumbnail">
        <div class="thumbnail-wrap">
          <img :src="data.thumbnail">
        </div>
      </div>
      <div class="sidebar">
        <div class="name">{{data.name}}</div>
        <div class="info">
          <span class="wh">{{data.width}} × {{data.height}}</span>
          <br>
          <!-- <span v-text="data.type === 1 ? '视频' : '图片'"></span> -->
          <span v-show="data.downloading" class="upload-size">{{ data.fileSize * data.downloadProgress | fileSize }}</span>
          <span v-show="data.downloading" class="upload-size">/</span>
          <span class="full-size">{{data.fileSize|fileSize}}</span>
        </div>
        <div v-show="data.downloading" class="rate">
          <cpt-linear-progress mode="determinate" :size="2" :value="data.downloadProgress * 100"/>
        </div>
        <div class="btn-group">
          <!-- <cpt-button label="删除" icon="delete-fill" small danger /> -->
          <template v-if="from === 'store'">
            <cpt-button v-show="!data.downloading && (data.downloadAborted || data.downloadFailed || !data.downloadFinished)" label="下载" icon="download-fill" small primary @click="downloadWallpaperRequest(data.ID)" />
            <cpt-button v-show="data.downloading" label="取消下载" small primary @click="stopDownloadWallpaper(data.ID)" />
            <!-- <cpt-button v-show="data.downloadFinished && data.downloadProgress === 1" label="已下载" secondary disabled small></cpt-button> -->
            <cpt-button v-show="!data.downloading && !data.downloadAborted && !data.downloadFailed && data.downloadFinished" label="设为桌面" icon="client-fill" small primary @click="_setWallpaper(data.ID)" />
          </template>
          <template v-if="from === 'local'">
            <cpt-button label="删除" icon="delete-fill" small danger @click="deleteWallpaperConfirm" />
          </template>
        </div>
      </div>
    </div>

    <!-- S delete confirm dialog -->
    <cpt-dialog :open="deleteDialog" title="" @close="closeDeleteDialog" @hide="closeDeleteDialog" dialogClass="msg-dialog" :overlayOpacity="0.8" cornerClose>
      <div slot="title" class="title">删除壁纸</div>
      <div class="content">该壁纸将被立即删除，您不能撤销此操作</div>
      <cpt-button slot="actions" label="取消" @click="closeDeleteDialog" secondary long />
      <cpt-button slot="actions" label="删除" @click="_deleteWallpaper(data.ID)" danger long />
    </cpt-dialog>
    <!-- E delete confirm dialog -->
  </div>
</template>

<script>
import wallpaperApi from '@/components/wallpaperFile'

export default {
  name: 'cpt-wallpaper-preview',
  mixins: [wallpaperApi],
  props: {
    from: {
      type: String
    },
    previewStyle: {
      type: Object
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      page: 'preview',
      deleteDialog: false
    }
  },
  computed: {
    // previewStyle () {
    //   return {
    //     top: this.position.top + 'px',
    //     height: this.position.height + 'px'
    //   }
    // }
  },
  methods: {
    openDeleteDialog () {
      this.deleteDialog = true
    },
    closeDeleteDialog () {
      this.deleteDialog = false
    },
    closePreview () {
      this.$emit('close')
    },
    downloadWallpaperRequest (id) {
      this.getDownloadUrl(id).then(data => {
        this.downloadWallpaper({
          id: this.data.ID,
          url: data.url,
          name: this.data.name,
          size: this.data.fileSize,
          duration: this.data.videoDuration,
          thumb: this.data.thumbnail,
          width: this.data.width,
          height: this.data.height,
          type: 1,
        })
      })
      this.__REPORT('view_wallpaper_download')
    },
    getDownloadUrl (id) {
      return new Promise((resolve, reject) => {
        const url = '/pc/wallpaper_download/'
        const options = {
          params: {
            'id': id,
            'heybox_id': this.$store.state.accountInfo.uid,
            'os_type': 'pc'
          }
        }
        this.$ajax(url, options).then(res => {
          if (res.data.status === 'ok') {
            const data = res.data.result
            console.log(data)
            resolve(data)
          } else {
            console.log('failed')
          }
          
        }, res => {
          console.log('failed')
          reject(res)
          this.$store.state.msgDialogOptions.markType = 'fail'
          this.$store.state.msgDialogOptions.msg = '下载失败'
          this.$store.state.msgDialog = true
        })
      })
    },
    deleteWallpaperConfirm () {
      this.openDeleteDialog()
    },
    _deleteWallpaper (id) {
      this.deleteWallpaper(id)
      this.closeDeleteDialog()
      this.$emit('delete')    
    },
    _setWallpaper (id) {
      this.setWallpaper(id)
      // this.$emit('setWallpaper')
    }
  },
  created () {
    this.wallpaperInitConnect()
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-wallpaper-preview {
  position: absolute;
  left: -40px;
  right: -38px;
  background: @darkColor;
  .preview-wrap {
    position: relative;
    display: flex;
    height: 100%;
    padding: 16px 40px;
    .close {
      position: absolute;
      top: 16px;
      right: 16px;
    }
    .thumbnail {
      flex: 1;
      min-width: 0;
      height: 100%;
      .thumbnail-wrap {
        max-width: 900px;
        height: 100%;
        margin: auto;
        box-shadow: 0 5px 35px rgba(0,0,0,.65);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .sidebar {
      width: 280px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      line-height: 1;
      .name {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .info {
        color: #969ba0;
        font-size: 12px;
        line-height: 20px;
        margin-bottom: 8px;
        font-weight: 400;
      }
      .rate {
        margin-top: 2px;
        margin-bottom: 8px;
      }
      .btn-group {
        margin-top: 2px;
        font-size: 0;
        .cpt-button {
          margin-right: 14px;
        }
      }
    }
  }
}

</style>