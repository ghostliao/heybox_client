<template>
  <cpt-dialog :open="$store.state.momentDialog" title="" @hide="closeMomentDialog" dialogClass="moment-dialog" :overlayOpacity="0.8" cornerClose>
    <div class="moment-dialog-wrap">
      <div class="moment-dialog-head">
        <div class="title">本次游戏精彩时刻</div>
        <cpt-button label="全部上传" icon="upload-fill" small primary @click="uploadAllMoment" />
      </div>
      <div class="moment-dialog-body" ref="momentList">
        <div class="moment-dialog-body-container">
          <div class="moment-dialog-media-list">
            <div class="index">{{currentMediaIndex + 1}} / {{mediaList.length}}</div>
            <cpt-moment-dialog-media-item v-for="(i, index) in mediaList" :key="index" v-show="currentMediaIndex === index" :data="i" :index="index" :currentMediaIndex="currentMediaIndex"></cpt-moment-dialog-media-item>
          </div>
          <div class="moment-dialog-sidebar">
            <!-- <div class="btn up" :class="{ 'disabled': scrollMin }" @click="moveTop">
              <cpt-icon value="arrow-up"></cpt-icon>
            </div> -->
            <div class="moment-dialog-sidebar-list" ref="sidebar">
              <div class="moment-dialog-sidebar-list-wrap" ref="wrap">
                <cpt-moment-dialog-sidebar-media-item v-for="(i, index) in mediaList" :key="index" :data="i" :index="index" :currentMediaIndex="currentMediaIndex" @previewMedia="previewMedia"></cpt-moment-dialog-sidebar-media-item>
              </div>
            </div>
            <!-- <div class="btn down" :class="{ 'disabled': scrollMax }" @click="moveBottom">
              <cpt-icon value="arrow-down"></cpt-icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </cpt-dialog>
</template>

<script>
import cptMomentDialogMediaItem from './moment-dialog-media-item'
import cptMomentDialogSidebarMediaItem from './moment-dialog-sidebar-media-item'
import Bus from '@/components/bus'
import videoFile from '@/components/videoFile'
import imageFile from '@/components/imageFile'

export default {
  name: 'cpt-moment-dialog',
  mixins: [videoFile, imageFile],
  components: {
    'cpt-moment-dialog-media-item': cptMomentDialogMediaItem,
    'cpt-moment-dialog-sidebar-media-item': cptMomentDialogSidebarMediaItem
  },
  props: {
    
  },
  data () {
    return {
      loading: true,
      mediaList: [],
      currentOverlayGameId: 0,
      currentMediaIndex: 0,
      scrollMin: true,
      scrollMax: false,
      // targety: 211,
      // dx: 0,

    }
  },
  computed: {
    
  },
  methods: {
    openMomentDialog () {
      this.mousewheel()
      this.$store.state.momentDialog = true
    },
    closeMomentDialog () {
      console.log('sss')
      document.removeEventListener('mousewheel', this.mousewheelHandler)
      this.$store.state.momentDialog = false
    },
    // 本次游戏精彩时刻全部上传
    uploadAllMoment () {
      Bus.$emit('uploadAll')
      this.__REPORT('view_moment_dialog_upload_all')
    },
    // 监听游戏Overlay注入
    gameOverlayListener () {
      maxjia.games.overlayStart.addListener(data => {
        console.log(data)
        this.currentOverlayGameId = data.gameId
        this.$store.state.lastGameId = data.gameId
        console.log('game id: ' + data.gameId)
        this.onOverlayStart(data)
      })
      maxjia.games.overlayStop.addListener(data => {
        console.log(data)
        this.currentOverlayGameId = 0
        this.onOverlayStop(data)
      })
      this.videoInitConnect(true)
      this.imageInitConnect(true)
    },
    onOverlayStart () {
      console.log('overlay start')
      this.mediaList = []
      this.$store.state.momentDialogEnter = false
    },
    onOverlayStop () {
      console.log('overlay stop')
      if (this.mediaList.length > 0) {
        this.showGameMomentsList()
        if (this.$store.state.lastGameId !== 10410005) return
        let kill = 0, round = 0
        for (let i = 0, len = this.mediaList.length; i < len; i++) {
          const item = this.mediaList[i]
          if (item.momentDescription) {
            item.momentDescription.match(/Kill-CN|Kill-EN/) && (kill += 1)
            item.momentDescription.match(/SoloDead-CN1/) && (round += 1)
          }
        }
        this.$store.state.momentData.kill = kill
        this.$store.state.momentData.round = round

        maxjia.games.getLastGameFpsStats(10410005, data => {
          this.$store.state.momentData.fpsAvg = data.fpsAvg
          const startTs = data.fpsList[0].ts
          const endTs = data.fpsList[data.fpsList.length - 1].ts
          this.$store.state.momentData.duration = this.filterDuration(endTs - startTs)
          this.$store.state.momentData.lastGameTime = this.filterFormDate(endTs, 4)
        })
        this.$store.state.momentDialogEnter = true
      }
    },
    showGameMomentsList () {
      this.openMomentDialog()
      maxjia.windows.activeWindow(this.$store.state.mainWindowId)
      console.log('active main window')
      this.__REPORT('view_moment_dialog')
    },
    getCurrentOverlayGame () {
      maxjia.games.getCurrentOverlayGame(data => {
        return data
      })
    },
    // sidebar scroll
    moveTop () {
      this.$refs.sidebar.scrollTop -= 68
      this.offsetCalc()
    },
    moveBottom () {
      this.$refs.sidebar.scrollTop += 68
      this.offsetCalc()
    },
    offsetCalc () {
      if (this.$refs.sidebar.scrollTop === 0) {
        this.scrollMin = true
      } else {
        this.scrollMin = false
      }
      if (this.$refs.sidebar.scrollTop >= (this.$refs.wrap.offsetHeight - this.$refs.sidebar.offsetHeight)) {
        this.scrollMax = true
      } else {
        this.scrollMax = false
      }
    },
    // moveTop () {
    //   const le = parseInt(this.$refs.sidebar.scrollTop)
    //   if (le > 211) {
    //     this.targety = parseInt(this.$refs.sidebar.scrollTop) - 211
    //   } else {
    //     this.targety = parseInt(this.$refs.sidebar.scrollTop) - le - 1
    //   }
    //   this.scTop()
    // },
    // scTop () {
    //   this.dx = parseInt(this.$refs.sidebar.scrollTop) - this.targety
    //   this.$refs.sidebar.scrollTop -= this.dx * .3
    //   const clearScroll = setTimeout(this.scTop, 50)
    //   if (this.dx * .3 < 1) {
    //     clearTimeout(clearScroll)
    //   }
    // },
    // moveBottom () {
    //   const le = parseInt(this.$refs.sidebar.scrollTop) + 211
    //   const maxHeight = 10 * 105
    //   const maxL = maxHeight - 600
    //   if (le < maxL) {
    //     this.targety = parseInt(this.$refs.sidebar.scrollTop) + 211
    //   } else {
    //     this.targety = maxL
    //   }
    //   this.scBottom()
    // },
    // scBottom () {
    //   this.dx = this.targety - parseInt(this.$refs.sidebar.scrollTop)
    //   this.$refs.sidebar.scrollTop += this.dx * .3
    //   const clearScroll = setTimeout(this.scBottom, 50)
    //   if (this.dx * .3 < 1) {
    //     clearTimeout(clearScroll)
    //   }
    // },
    previewMedia (index) {
      this.currentMediaIndex = index
    },
    mousewheel () {
      document.addEventListener('mousewheel', this.mousewheelHandler)
    },
    mousewheelHandler (res) {
      // console.log(res)
      Bus.$emit('mousewheel')
      if (res.wheelDelta > 0) { // 上滚
        this.moveTop()
        this.currentMediaIndex -= 1
        if (this.currentMediaIndex < 0) {
          this.currentMediaIndex = 0
        }
      } else if (res.wheelDelta < 0) { // 下滚
        this.moveBottom()
        this.currentMediaIndex += 1
        if (this.currentMediaIndex > this.mediaList.length - 1) {
          this.currentMediaIndex = this.mediaList.length - 1
        }
      }
    }
  },
  created () {

  },
  mounted () {
    maxjia.games.overlayStart && this.gameOverlayListener()

    Bus.$on('start', this.onOverlayStart)
    Bus.$on('stop', this.onOverlayStop)
    Bus.$on('openMomentDialog', this.openMomentDialog)
    // this.$nextTick(() => {
    //   this.offsetCalc()
    // })
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.moment-dialog-wrap {
  height: 100%;
}
.moment-dialog-head {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid @layoutBorderColor;
  .title {
    font-size: 16px;
    color: @textColor;
    margin-right: 20px;
  }
}
.moment-dialog-body {
  position: relative;
  height: calc(~"100% - 50px");
  background: rgba(0, 0, 0, 0.2);
  // overflow-y: scroll;
}
.moment-dialog-body-container {
  display: flex;
  height: 100%;
  // padding: 8px 16px 48px;
}
.moment-dialog-media-list {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  .index {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #bec3c8;
  }
}
.moment-dialog-sidebar {
  position: relative;
  width: 122px;
  height: 100%;
  background: #14191e;
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    height: 32px;
    background: #14191e;
    cursor: pointer;
    .common-transition;
    &:hover {
      color: @primaryColor;
      // background: rgba(0,0,0,.4);
    }
    &.up {
      top: 0;
	    // background-image: linear-gradient(to top, rgba(20, 25, 30, 0.0), #14191e 54%, #14191e);
    }
    &.down {
      bottom: 0;
	    // background-image: linear-gradient(to bottom, rgba(20, 25, 30, 0.0), #14191e 54%, #14191e);
    }
    &.disabled {
      color: #555a5f !important;
      background: #14191e !important;
    }
  }
}
.moment-dialog-sidebar-list {
  height: 100%;
  background: #14191e;
  overflow: hidden;
}
.moment-dialog-sidebar-list-wrap {
  padding: 4px 4px;
}
.moment-dialog-sidebar-item {
  height: 64px;
  background: #444444;
  margin-bottom: 4px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

</style>