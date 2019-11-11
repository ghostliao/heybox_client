<template>
  <cpt-dialog :open="$store.state.momentDialog" title="" @hide="closeMomentDialog" dialogClass="moment-dialog" :overlayOpacity="0.8" cornerClose>
    <div class="moment-dialog-wrap">
      <div class="moment-dialog-head">
        <div class="title">本次游戏精彩时刻</div>
        <div class="data">
          <span class="time">上次游戏：{{$store.state.momentData.lastGameTime}}</span>
          <span class="label">游戏时长</span>
          <span class="value">{{$store.state.momentData.duration}}</span>
          <span class="label">游戏局数</span>
          <span class="value">{{$store.state.momentData.round}} 局</span>
          <span class="label">击杀数</span>
          <span class="value">{{$store.state.momentData.kill}} 次</span>
          <span class="label">平均FPS</span>
          <span class="value">{{$store.state.momentData.fpsAvg}}</span>
        </div>
      </div>
      <div class="moment-dialog-body" ref="momentList">
        <div class="moment-dialog-body-container">
          <div class="moment-dialog-media-list">
            <div v-show="currentMediaIndex !== -1" class="index">{{currentMediaIndex + 1}} / {{mediaList.length}}</div>
            <div v-if="currentMediaIndex === -1" class="moment-dialog-status-window">
              <div class="chart-wrap">
                <div class="label">FPS</div>
                <cpt-chart id="momentFpsLineChart" :data="chartData.fps" :avg="chartData.fpsAvg" dataType="fps" chartType="momentLine" moment></cpt-chart>
              </div>
              <div class="chart-wrap">
                <div class="label">CPU利用率</div>
                <cpt-chart id="momentCpuLineChart" :data="chartData.cpu" :avg="chartData.cpuAvg" dataType="cpu" chartType="momentLine" moment></cpt-chart>
              </div>
              <div class="chart-wrap">
                <div class="label">GPU利用率</div>
                <cpt-chart id="momentGpuLineChart" :data="chartData.gpu" :avg="chartData.gpuAvg" dataType="gpu" chartType="momentLine" moment></cpt-chart>
              </div>
              <div class="chart-wrap">
                <div class="label">内存利用率</div>
                <cpt-chart id="momentMemoryLineChart" :data="chartData.memory" :avg="chartData.memoryAvg" dataType="memory" chartType="momentLine" moment></cpt-chart>
              </div>
            </div>
            <cpt-moment-dialog-media-item v-for="(i, index) in mediaList" :key="index" v-show="currentMediaIndex === index" :data="i" :index="index" :currentMediaIndex="currentMediaIndex"></cpt-moment-dialog-media-item>
          </div>
          <div class="moment-dialog-sidebar">
            <!-- <div class="btn up" :class="{ 'disabled': scrollMin }" @click="moveTop">
              <cpt-icon value="arrow-up"></cpt-icon>
            </div> -->
            <div class="moment-dialog-sidebar-list" ref="sidebar">
              <div class="moment-dialog-sidebar-list-wrap" ref="wrap">
                <div class="moment-dialog-sidebar-chart-item" :class="{ 'current': currentMediaIndex === -1 }" @click="previewMedia(-1);__REPORT('view_pc_performance_in_game')">
                  <cpt-icon value="my-pc-fill"></cpt-icon>
                  <span>性能概览</span>
                </div>
                <cpt-moment-dialog-sidebar-media-item v-for="(i, index) in mediaList" :key="index" :data="i" :index="index" :currentMediaIndex="currentMediaIndex" @previewMedia="previewMedia"></cpt-moment-dialog-sidebar-media-item>
              </div>
            </div>
            <div class="upload-all">
              <cpt-button label="全部上传" small primary @click="uploadAllMoment" />              
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
import cptChart from '@/components/chart'

export default {
  name: 'cpt-moment-dialog',
  mixins: [videoFile, imageFile],
  components: {
    'cpt-moment-dialog-media-item': cptMomentDialogMediaItem,
    'cpt-moment-dialog-sidebar-media-item': cptMomentDialogSidebarMediaItem,
    'cpt-chart': cptChart
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
      chartDataTimer: undefined,
      chartDataStore: {
        fps: [],
        cpu: [],
        gpu: [],
        memory: []
      },
      chartData: {}

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
    onOverlayStart (data) {
      console.log('overlay start')
      this.mediaList = []
      this.$store.state.momentDialogEnter = false
      // 获取游戏进程中的性能数据
      if (data.gameId === 10410005) {
        this.chartDataTimer = setInterval(() => {
          console.log('getHardwarePerfInfo')
          maxjia.hardware.getHardwarePerfInfo(data => {
            this.chartDataStore.cpu.push(Number(data.cpu.usage))
            this.chartDataStore.gpu.push(Number(data.gpus[0].gpu_usage))
            this.chartDataStore.memory.push(Number(data.memory.usage))
          })
        }, 1000)
      }
    },
    onOverlayStop () {
      console.log('overlay stop')
      if (this.$store.state.lastGameId !== 10410005) return
      clearInterval(this.chartDataTimer)

      if (this.mediaList.length > 0) {
        this.chartDataStore.cpuAvg = this.arrayAvg(this.chartDataStore.cpu)
        this.chartDataStore.gpuAvg = this.arrayAvg(this.chartDataStore.gpu)
        this.chartDataStore.memoryAvg = this.arrayAvg(this.chartDataStore.memory)

        this.showGameMomentsList()
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

          let fpsList = []
          data.fpsList.forEach(item => {
            fpsList.push(item.fps)
          })
          this.chartDataStore.fps = fpsList
          this.chartDataStore.fpsAvg = data.fpsAvg
          this.chartDataStoreReset()
        })
        this.$store.state.momentDialogEnter = true
      } else {
        this.chartDataStoreReset()
      }
    },
    chartDataStoreReset () {
      this.chartData = this.chartDataStore
      this.chartDataStore = {
        fps: [],
        cpu: [],
        gpu: [],
        memory: []
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
        if (this.currentMediaIndex < -1) {
          this.currentMediaIndex = -1
        }
      } else if (res.wheelDelta < 0) { // 下滚
        this.moveBottom()
        this.currentMediaIndex += 1
        if (this.currentMediaIndex > this.mediaList.length - 1) {
          this.currentMediaIndex = this.mediaList.length - 1
        }
      }
    },
    arrayAvg (array) {
      let sum = 0
      const len = array.length
      for (let i = 0; i < len; i++) {
        sum += array[i]
      }
      return Number(sum / len).toFixed(0)
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
  .data {
    color: #82878c;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    .time {
      margin-right: 6px;
    }
    .label {
      margin-right: 6px;
    }
    .value {
      color: @textColor;
      font-size: 14px;
      font-weight: 600;
      margin-right: 12px;

      height: 14px;
      background-image: linear-gradient(to bottom, #ffffff, #afafaf);
      font-size: 14px;
      font-weight: bold;
      line-height: 1.0;
      text-align: left;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
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
  display: flex;
  flex-direction: column;
  width: 122px;
  height: 100%;
  background: #2f323c;
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
  .upload-all {
    padding: 4px;
    .cpt-button {
      width: 100%;
    }
  }
}
.moment-dialog-sidebar-list {
  flex: 1;
  height: 100%;
  background: #2f323c;
  overflow: hidden;
}
.moment-dialog-sidebar-list-wrap {
  padding: 4px 4px;
}
.moment-dialog-sidebar-chart-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;
  background: #14191e;
  font-size: 12px;
  font-weight: 400;
  color: @textColor;
  margin-bottom: 4px;
  cursor: pointer;
  .iconfont {
    font-size: 20px;
    margin-bottom: 5px;
  }
  &.current {
    box-shadow: 0 0 0 2px @primaryColor;
  }
}
.moment-dialog-sidebar-item {
  height: 64px;
  background: #444444;
  margin-bottom: 4px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
.moment-dialog-status-window {
  width: 100%;
  height: 100%;
  padding: 12px;
  .chart-wrap {
    // display: flex;
    height: 25%;
    .label {
      font-size: 12px;
      color: @textColor;
      width: 70px;
      line-height: 12px;
    }
    .cpt-chart {
      flex: 1;
      min-width: 0;
      height: calc(~"100% - 12px");
      // padding-right: 10px;
    }
  }
}

</style>