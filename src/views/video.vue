<template>
  <div class="view-video">
    <div class="record">
      <!-- <div class="title">录制</div> -->
      <!-- <div class="video-setting-btn">
        <cpt-button label="录制设置" icon="set-video-thin" @click="$router.push({ name: 'settings-video' })" secondary small></cpt-button>
      </div> -->
      <div class="main">
        <div class="main-btn" ref="imageCapture" @click="startImageCapture" @mouseenter="handleHover" @mouseleave="handleHoverExit">
          <cpt-icon value="screenshot-fill" :size="24"></cpt-icon>
          <span class="txt">截屏</span>
          <cpt-tooltip :label="$store.state.hotkeys.captureImage" :show="show" :trigger="trigger" verticalPosition="bottom" horizontalPosition="center"/>
        </div>
        <div v-show="$store.state.recordingState === 'RS_Stop'" class="main-btn" ref="videoCapture" @click="easyStartVideoCapture" @mouseenter="handleHover2" @mouseleave="handleHoverExit2">
          <cpt-icon value="record-fill" :size="24"></cpt-icon>
          <span class="txt">录制</span>
          <cpt-tooltip :label="$store.state.hotkeys.captureVideo" :show="show2" :trigger="trigger2" verticalPosition="bottom" horizontalPosition="center"/>          
        </div>
        <div v-show="$store.state.recordingState !== 'RS_Stop'" class="main-btn recording" @click="stopVideoCapture">
          <cpt-icon value="record-stop-fill" :size="24"></cpt-icon>
          <span v-show="$store.state.recordingState === 'RS_Init'" class="txt">初始化中</span>
          <span v-show="$store.state.recordingState === 'RS_Recording'" class="txt time">{{ $store.state.recordingSeconds | duration }}</span>
        </div>
        <!-- <div v-show="isAutoStartCaptureInGame" class="main-btn auto" @click="setIsAutoStartCaptureInGame(false)">
          <cpt-icon value="capture-fill" :size="24"></cpt-icon>
          <span class="txt">精彩时刻已开启</span>
        </div>
        <div v-show="!isAutoStartCaptureInGame" class="main-btn auto close" @click="setIsAutoStartCaptureInGame(true)">
          <cpt-icon value="capture-fill" :size="24"></cpt-icon>
          <span class="txt">精彩时刻已关闭</span>
        </div> -->
        <div class="main-btn set" @click="$router.push({ name: 'settings-video' })">
          <cpt-icon value="set-fill" :size="24"></cpt-icon>
          <!-- <span class="txt">录制</span> -->
        </div>
      </div>
    </div>
    <ul class="nav-list">
      <router-link v-for="(i, index) in navTabs" :to="{ name: i.name }" tag="li" :key="i.name">
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
    <div class="main">
      <lazy :time="300">
        <keep-alive>
          <router-view></router-view>
          <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      </lazy>
    </div>

    <!-- <cpt-back-top>
      <div class="back-top">TOP</div>
    </cpt-back-top> -->
  </div>
</template>
<script>
import cptButton from '@/components/button'
import { mapState, mapActions } from 'vuex'
import cptBackTop from '@/components/backTop'
import tabHighlight from '@/components/tab-highlight'

export default {
  name: "view-video",
  // mixins: [tabHighlight],
  components: {
    'cpt-button': cptButton,
    'cpt-back-top': cptBackTop
  },
  data () {
    return {
      routeDepth: 2,
      navTabs: [
        {
          name: 'video-desktop',
          label: '录像'
        },
        {
          name: 'video-screenshot',
          label: '截屏'
        }
      ],
      show: false,
      trigger: null,
      show2: false,
      trigger2: null
    }
  },
  computed: {
    ...mapState({
      // 'recordingState'
    })
  },
  methods: {
    // S tooltip 
    handleHover () {
      this.show = true
    },
    handleHoverExit () {
      this.show = false
    },
    handleHover2 () {
      this.show2 = true
    },
    handleHoverExit2 () {
      this.show2 = false
    },
    // E tooltip
    ...mapActions([
      'startImageCapture',
      'easyStartVideoCapture',
      'stopVideoCapture'
    ]),
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
    }
  },
  mounted () {
    this.trigger = this.$refs.imageCapture
    this.trigger2 = this.$refs.videoCapture

    this.init()
  },
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-video {
  padding: 16px 36px;
  .record {
    position: relative;
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
    > .main {
      display: flex;
      margin-bottom: 16px;
      .main-btn {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 134px;
        height: 76px;
        color: @textColor;
	      border-radius: 2px;
        background-color: fade(@alternateTextColor, 80%);
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
        margin-right: 12px;
        cursor: pointer;
        .iconfont {
          color: fade(@textColor, 80%);
        }
        .txt {
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
          margin-top: 8px;
          &.time {
            font-family: 'liquidcr';
            font-size: 16px;
            margin-top: 2px;
          }
        }
        &:hover {
          background-color: fade(@textColor, 8%);
        }
        &:active {
          background-color: fade(@textColor, 8%);
        }
        &.recording {
          color: @dangerColor;
          .iconfont {
            color: @dangerColor;
          }
        }
        &.close {
          color: fade(@textColor, 40%);
          .iconfont {
            color: fade(@textColor, 40%);
          }
        }
        &.set {
          width: 76px;
          background-color: fade(@alternateTextColor, 40%);
          .iconfont {
            color: fade(@textColor, 40%);
          }
          &:hover {
            background-color: fade(@textColor, 8%);
          }
        }
      }
    }
  }
  .nav-list {
    position: relative;
    display: flex;
    height: 40px;
    border-bottom: 1px solid @layoutBorderColor;
    margin-bottom: 16px;
    > li {
      position: relative;
      top: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 300;
      color: fade(@textColor, 40%);
      border-color: transparent;
      cursor: pointer;
      margin-right: 24px;
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
}
</style>
