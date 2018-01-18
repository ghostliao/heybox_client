<template>
  <div class="view-video" ref="scroller">
    <div class="content">
      <div class="toolbar">
        <!-- <div class="title">录制</div> -->
        <!-- <div class="video-setting-btn">
          <cpt-button label="录制设置" icon="set-video-thin" @click="$router.push({ name: 'settings-video' })" secondary small></cpt-button>
        </div> -->
        <div class="wrap">
          <cpt-block-button icon="screenshot-fill" :text="'截屏'" :tooltipLabel="$store.state.hotkeys.captureImage" @click="startImageCapture"></cpt-block-button>
          <cpt-block-button
            :buttonClass="recordButtonClass"
            icon="record-fill" 
            :text="recordButtonText" 
            :textClass="recordButtonTextClass" 
            :tooltipLabel="$store.state.hotkeys.captureVideo" 
            @click="recordButtonClickEvent"></cpt-block-button>
          <cpt-block-button buttonClass="set" icon="set-fill" @click="$router.push({ name: 'settings-video' })"></cpt-block-button>
          
          <!-- <div v-show="isAutoStartCaptureInGame" class="main-btn auto" @click="setIsAutoStartCaptureInGame(false)">
            <cpt-icon value="capture-fill" :size="24"></cpt-icon>
            <span class="txt">精彩时刻已开启</span>
          </div>
          <div v-show="!isAutoStartCaptureInGame" class="main-btn auto close" @click="setIsAutoStartCaptureInGame(true)">
            <cpt-icon value="capture-fill" :size="24"></cpt-icon>
            <span class="txt">精彩时刻已关闭</span>
          </div> -->

          <cpt-block-button v-if="$store.state.config.dev" :text="'start'" icon="set-fill" @click="momentStart"></cpt-block-button>
          <cpt-block-button v-if="$store.state.config.dev" :text="'stop'" icon="set-fill" @click="momentStop"></cpt-block-button>
          
        </div>
        <div v-if="$store.state.momentDialogEnter" class="record">
          <div class="recent-moment-record">
            <div class="info">
              <div class="row">
                <span class="title">总结</span>
                <span>上次游戏：{{$store.state.momentData.lastGameTime}} 绝地求生</span>
              </div>
              <div class="row">
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
            <div class="btn">
              <cpt-button label="查看详情" secondary small @click.native="showMomentDialog" />
            </div>
          </div>
        </div>
      </div>
      <div class="nav-bar">
        <ul class="nav-list">
          <router-link v-for="(i, index) in navTabs" :to="{ name: i.name }" tag="li" :key="i.name" @click.native="saveRouter(i.name)">
            <span :ref="`tab${index}`">{{i.label}}</span>
          </router-link>
          <!-- <router-link :to="{ name: 'video-desktop' }" tag="li">
            <span ref="tab0">录像</span>
          </router-link>
          <router-link :to="{ name: 'video-screenshot' }" tag="li">
            <span ref="tab1">截屏</span>
          </router-link> -->
          <span class="tab-link-highlight" ref="highlight"></span>
        </ul>
        
        <div class="show-type">
          <div class="btn" :class="{ 'active': $store.state.mediaListShowType === 'list' }" @click.stop="changeShowType('list')">
            <cpt-icon value="list-fill" :size="16"></cpt-icon>          
          </div>
          <div class="btn" :class="{ 'active': $store.state.mediaListShowType === 'grid' }" @click.stop="changeShowType('grid')">
            <cpt-icon value="card-fill" :size="16"></cpt-icon>
          </div>
        </div>
      </div>
      <div class="main">
        <lazy :time="300">
          <keep-alive>
            <router-view></router-view>
            <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
          </keep-alive>
          <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        </lazy>
      </div>

    </div>

    <!-- <cpt-back-top>
      <div class="back-top">TOP</div>
    </cpt-back-top> -->
  </div>
</template>
<script>
import cptButton from '@/components/button'
import cptBlockButton from '@/components/blockButton'
import { mapState, mapActions } from 'vuex'
import cptBackTop from '@/components/backTop'
import tabHighlight from '@/components/tab-highlight'
import cptDivider from '@/components/divider'
import Bus from '@/components/bus'

export default {
  name: "view-video",
  // mixins: [tabHighlight],
  components: {
    'cpt-button': cptButton,
    'cpt-block-button': cptBlockButton,
    'cpt-back-top': cptBackTop,
    'cpt-divider': cptDivider
  },
  data () {
    return {
      routeDepth: 2,
      navTabs: [
        {
          name: 'video-local',
          label: '本地'
        },
        {
          name: 'video-cloud',
          label: '已上传'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // 'recordingState'
    }),
    recordButtonClass () {
       return this.$store.state.recordingState !== 'RS_Stop' ? 'recording' : ''
    },
    recordButtonText () {
      if (this.$store.state.recordingState === 'RS_Init') {
        return '初始化中'
      } else if (this.$store.state.recordingState === 'RS_Recording') {
        return this.filterDuration(this.$store.state.recordingSeconds)
      } else {
        return '录制'
      }
    },
    recordButtonTextClass () {
      return this.$store.state.recordingState === 'RS_Recording' ? 'time' : ''
    }
  },
  methods: {
    ...mapActions([
      'startImageCapture',
      'easyStartVideoCapture',
      'stopVideoCapture'
    ]),
    recordButtonClickEvent () {
      this.$store.state.recordingState === 'RS_Stop' ? this.easyStartVideoCapture() : this.stopVideoCapture()
    },
    onRecordingSecondsChanged () {
      this.getRecordingSeconds()
    },
    getRecordingSeconds () {
      maxjia.media.getRecordingSeconds(data => {
        // console.log(data)
        this.$store.state.recordingState = data.recordingState
        this.$store.state.recordingSeconds = data.recordingState === 'RS_STOP' ? 0 : data.recordingSeconds
      })
    },
    init () {
      maxjia.media.getRecordingState(data => {
        this.$store.state.recordingState = data.recordingState
      })
      maxjia.media.recordingSecondsChanged.addListener(data => {
        this.onRecordingSecondsChanged()
      })
    },
    // 改变媒体列表展示方式
    changeShowType (type) {
      console.log(type)
      localStorage.setItem('mediaListShowType', type)
      this.$store.state.mediaListShowType = type
      if (type === 'list') {
        this.__REPORT('view_video_lib_show_type_list')
      } else if (type === 'grid') {
        this.__REPORT('view_video_lib_show_type_grid')
      }
    },
    momentStart () {
      Bus.$emit('start')
    },
    momentStop () {
      Bus.$emit('stop')
    },
    getLastGameMomentData () {
      if (!this.$store.state.momentDialogEnter || this.$store.state.lastGameId !== 10410005) return
      maxjia.games.getLastGameFpsStats(10410005, data => {
        this.$store.state.momentData.fpsAvg = data.fpsAvg
        const startTs = data.fpsList[0].ts
        const endTs = data.fpsList[data.fpsList.length - 1].ts
        this.$store.state.momentData.duration = this.filterDuration(endTs - startTs)
        this.$store.state.momentData.lastGameTime = this.filterFormDate(endTs, 4)
      })
    },
    showMomentDialog () {
      this.__REPORT('fn_moment_dialog_detail')
      Bus.$emit('openMomentDialog')
    }
  },
  mounted () {
    this.init()
    this.getLastGameMomentData()
  },
  activated () {
    this.getLastGameMomentData()    
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-video {
  .view-scroller;
  > .content {
    padding: 24px 40px;
    .toolbar {
      position: relative;
      display: flex;
      margin-bottom: 16px;
      .video-setting-btn {
        position: absolute;
        top: 10px;
        right: 0;
      }
      > .title {
        display: flex;
        align-items: center;
        height: 48px;
        font-size: 16px;
      }
      > .wrap {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
      }
      > .record {
        width: 560px;
      }
    }
    .nav-bar {
      display: flex;
      border-bottom: 1px solid @layoutBorderColor;
      margin-bottom: 2px;
      .nav-list {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        height: 48px;
        > li {
          position: relative;
          top: 1px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: 300;
          color: fade(@textColor, 40%);
          border-bottom: 1px solid transparent;
          cursor: pointer;
          margin-right: 20px;
          .common-transition;
          // &:after {
          //   content: '';
          //   position: absolute;
          //   top: 50%;
          //   right: -12px;
          //   width: 4px;
          //   height: 4px;
          //   background: fade(@textColor, 40%);
          //   border-radius: 50%;
          //   margin-top: -2px;
          // }
          // &:last-of-type:after {
          //   content: none;
          // }
          &:hover {
            color: @textColor;
          }
          &.active {
            color: @textColor;
            border-bottom: 1px solid @primaryColor;
          }
        }
        .tab-link-highlight {
          position: absolute;
          left: 0;
          bottom: -1px;
          height: 1px;
          background-color: @primaryColor;
          transition: all .3s;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
      }
      
      .show-type {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
          margin-left: 6px;
          cursor: pointer;
          .iconfont {
            color: @lightIconColor;
          }
          &.active {
            .iconfont {
              color: @primaryColor;
            }
          }
        }
      }
    }
  }
}

.recent-moment-record {
  display: flex;
  align-items: center;
  height: 76px;
  border-radius: 2px;
  background-image: linear-gradient(to right, rgba(20, 25, 30, 0.0), #14191e 16%, #14191e);
  padding: 0 12px;
  .info {
    flex: 1;
    min-width: 0;
    color: #82878c;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    > .row:first-child {
      margin-bottom: 12px;
    }
    > .row {
      .title {
        color: @textColor;
        font-size: 14px;
        font-style: italic;
        font-weight: 600;
        margin-right: 12px;
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
}
</style>
