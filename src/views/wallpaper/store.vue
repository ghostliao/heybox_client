<template>
  <div class="view-wallpaper-store" ref="scroller">
    <div class="content">
      <cpt-set-block-head title="桌面商城"></cpt-set-block-head>
      <div class="body" ref="body">
        <transition name="fade" mode="out-in">
          <div v-if="loading" key="loading" class="loading">
            <cpt-circular-progress :size="40" />
          </div>
          <div v-if="!loading && wallpaperList.length <= 0" key="notice" class="notice">暂无媒体文件</div>
          <div v-if="!loading && wallpaperList.length > 0" key="list" class="wp-list">
            <cpt-store-wallpaper-item v-for="(i, index) in wallpaperList" :key="index" :index="index" :data="i" :current="current" :margin="previewHeight"></cpt-store-wallpaper-item>
          </div>
        </transition>
        <cpt-wallpaper-preview v-if="wallpaperPreview" :from="page" :previewStyle="previewStyle" :data="wallpaperList[current]" @close="closePreview"></cpt-wallpaper-preview>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'

import {cptStoreWallpaperItem} from '@/components/wallpaper-item'
import cptWallpaperPreview from '@/components/wallpaper-preview'
import Bus from '@/components/bus'
import wallpaperApi from '@/components/wallpaperFile'

export default {
  name: "view-wallpaper-store",
  mixins: [wallpaperApi],
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-store-wallpaper-item': cptStoreWallpaperItem,
    'cpt-wallpaper-preview': cptWallpaperPreview
  },
  data () {
    return {
      page: 'store',
      loading: true,
      singleRowItemCount: 4, // 单行壁纸展示数
      current: -1, // 当前查看的壁纸
      wallpaperPreview: false, // 壁纸预览开关
      previewStyle: {}, // wallpaper 位置信息
      previewHeight: 0, // 预览区域高度
      wallpaperList: []
    }
  },
  computed: {
    
  },
  methods: {
    ...mapActions([
      'openMsgDialog'
    ]),
    bodyWidthDetect () {
      const maxWidth = document.body.clientWidth
      if (maxWidth > 1600) {
        this.singleRowItemCount = 6
        this.previewHeight = 600
      } else if (maxWidth > 1280) {
        this.singleRowItemCount = 5
        this.previewHeight = 500
      } else {
        this.singleRowItemCount = 4
        this.previewHeight = 400
      }
    },
    closePreview () {
      this.wallpaperPreview = false
      this.current = -1
    },
    getStoreWallpaperList () {
      return new Promise((resolve, reject) => {
        const url = '/pc/wallpaper/'
        const options = {
          withCredentials: false,
          params: {
            // offset: 0,
            // limit: 9999
          }
        }
        this.$ajax(url, options).then(res => {
          const data = res.data.result
          this.wallpaperList = data.list
          this.loading = false
          resolve(data.list)
        })
      })
    }
  },
  created () {
    this.wallpaperInitConnect()

    Bus.$on('wallpaperPreview', data => {
      if (data.from !== 'store') return
      this.current = data.index
      this.previewStyle = {
        top: data.position.top + data.itemHeight + 10 + 'px',
        height: this.previewHeight + 'px'
      }
      this.wallpaperPreview = true
      this.$nextTick(() => {
        this.$refs.scroller.scrollTop = data.position.top
      })
      console.log(this.wallpaperList[this.current])
    })
    
  },
  mounted () {
    this.getStoreWallpaperList().then(list => {
      return this.getLocalWallpaperList()
    }).then(list => {
      for (let i = 0, len1 = list.length; i < len1; i++) {
        for (let j = 0, len2 = this.wallpaperList.length; j < len2; j++) {
          if (this.wallpaperList[j].ID === list[i].ID) {
            this.$set(this.wallpaperList[j], 'downloadFinished', true)
            this.$set(this.wallpaperList[j], 'downloadProgress', 1)
            if (list[i].isCurrent) {
              this.$set(this.wallpaperList[j], 'isCurrent', true)
            }
            break
          }
        }
      }
    })
    this.bodyWidthDetect()

    window.addEventListener('resize', () => {
      this.bodyWidthDetect()
      this.closePreview()
    })
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.view-wallpaper-store {
  .view-scroller;
  .content {
    width: 100%;
    padding: 6px 40px 40px;
    > .body {
      position: relative;
      .loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .notice {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        text-align: center;
        font-size: 14px;
        color: @secondaryTextColor;
      }
      .wp-list {
        display: flex;
        flex-wrap: wrap;
        margin-right: -20px;
      }
    }
  }
}
</style>