<template>
  <div class="view-wallpaper-local" ref="scroller">
    <div class="content">
      <cpt-set-block-head title="本地桌面"></cpt-set-block-head>
      <div class="body" ref="body">
        <!-- <transition name="fade" mode="out-in"> -->
          <div v-if="loading" key="loading" class="loading">
            <cpt-circular-progress :size="40" />
          </div>
          <div v-if="!loading && wallpaperList.length <= 0" key="notice" class="notice">暂无桌面文件</div>
          <div v-if="!loading && wallpaperList.length > 0" key="list" class="wp-list">
            <cpt-local-wallpaper-item v-for="(i, index) in wallpaperList" :key="index" :index="index" :data="i" :current="current" :margin="previewHeight"></cpt-local-wallpaper-item>
          </div>
        <!-- </transition> -->
        <cpt-wallpaper-preview v-if="wallpaperPreview" :from="page" :previewStyle="previewStyle" :data="wallpaperList[current]" @close="closePreview" @delete="closePreview" @setWallpaper="_setWallpaper"></cpt-wallpaper-preview>
      </div>
    </div>

    
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'

import {cptLocalWallpaperItem} from '@/components/wallpaper-item'
import cptWallpaperPreview from '@/components/wallpaper-preview'
import Bus from '@/components/bus'
import wallpaperApi from '@/components/wallpaperFile'

export default {
  name: "view-wallpaper-local",
  mixins: [wallpaperApi],
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-local-wallpaper-item': cptLocalWallpaperItem,
    'cpt-wallpaper-preview': cptWallpaperPreview
  },
  data () {
    return {
      page: 'local',
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
    _setWallpaper () {
      if (this.current !== -1) {
        // this.wallpaperList[this.current].isCurrent = false
        this.$set(this.wallpaperList[this.current], 'isCurrent', false)
      }
    }
  },
  created () {
    this.wallpaperInitConnect()

    Bus.$on('wallpaperPreview', data => {
      if (data.from !== 'local') return
      if (!data.fileData.isCurrent) {
        this.setWallpaper(data.fileData.ID)
      }
      this.current = data.index
      this.previewStyle = {
        top: data.position.top + data.itemHeight + 10 + 'px',
        height: this.previewHeight + 'px'
      }
      this.wallpaperPreview = true
      this.$nextTick(() => {
        this.$refs.scroller.scrollTop = data.position.top
      })
    })
    
  },
  mounted () {
    this.getLocalWallpaperList().then(data => {
      console.log(data)
      this.wallpaperList = data
      this.loading = false
    })
    this.bodyWidthDetect()

    window.addEventListener('resize', () => {
      this.bodyWidthDetect()
      this.closePreview()
    })
  },
  activated () {
    this.__REPORT('view_wallpaper_local')
  },
  deactivated () {
    this.closePreview()
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.view-wallpaper-local {
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