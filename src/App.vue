<template>
  <div id="app">
    <app-header></app-header>
    <div class="app-content">
      <keep-alive>
        <!-- <router-view></router-view> -->
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <!-- S video player -->
    <!-- <div id="video-close-button" class="video-close-button">
      <cpt-icon value="close" :size="24"></cpt-icon>
    </div> -->
    <cpt-dialog :open="videoPlayer" title="" @close="closeVideoPlayer" @hide="closeVideoPlayer" dialogClass="video-player" :overlayOpacity="0.8" cornerClose :escPressClose="false">
      <div class="video-player-body">
        <div class="video-wrap">
          <!-- <video-player v-if="$store.state.videoPlayerOptions.src" -->
          <video-player
            class="vjs-custom-skin"
            ref="videoPlayer"
            :options="$store.state.videoPlayerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @canplay="onPlayerCanplay($event)"
            @canplaythrough="onPlayerCanplaythrough($event)"
            @ready="playerReadied"
            @statechanged="playerStateChanged($event)">
          </video-player>
        </div>
        <div class="options"></div>
      </div>
    </cpt-dialog>
    <!-- <cpt-video-player v-show="videoPlayer" :videoSource="videoSource"></cpt-video-player> -->
    <!-- E video player -->

    <!-- S image checker -->
    <cpt-dialog :open="imageChecker" title="" @close="closeImageChecker" @hide="closeImageChecker" dialogClass="image-checker" :overlayOpacity="0.8" cornerClose>
      <cpt-image-checker></cpt-image-checker>
    </cpt-dialog>
    <!-- E image checker -->

    <!-- S msg dialog -->
    <cpt-dialog :open="msgDialog" title="" @close="closeMsgDialog" @hide="closeMsgDialog" dialogClass="msg-dialog" :overlayOpacity="0.8" cornerClose>
      <cpt-msg-dialog :markType="$store.state.msgDialogOptions.markType" :msg="$store.state.msgDialogOptions.msg" :desc="$store.state.msgDialogOptions.desc" @close="closeMsgDialog">
        
      </cpt-msg-dialog>
    </cpt-dialog>
    <!-- E msg dialog -->

    <!-- S moment dialog -->
    <cpt-moment-dialog></cpt-moment-dialog>
    <!-- E moment dialog -->
    
    <cpt-feedback></cpt-feedback>

    <div class="font-preload">1</div>
  </div>
</template>

<script>
import invokeHBJsGlobal from './js/global'
import { mapState, mapActions } from 'vuex'
import appHeader from '@/components/app-header'
import cptVideoPlayer from '@/components/video-player'
import { videoPlayer } from 'vue-video-player'
import hotkeys from '@/components/hotkeys'
import cptImageChecker from '@/components/image-checker'
import cptFeedback from '@/components/feedback'
import Bus from '@/components/bus'
import cptMomentDialog from '@/components/moment-dialog'

export default {
  name: 'app',
  mixins: [hotkeys],
  components: {
    'cpt-video-player': cptVideoPlayer,
    'video-player': videoPlayer,
    'app-header': appHeader,
    'cpt-image-checker': cptImageChecker,
    'cpt-feedback': cptFeedback,
    'cpt-moment-dialog': cptMomentDialog
  },
  data () {
    return {
      activeTab: 'game',
      tabLightStyle: {
        width: '100%',
        transform: 'translate3d(0, 0, 0)'
      }
    }
  },
  computed: {
    ...mapState([
      'videoPlayer',
      'videoSource',
      'imageChecker',
      'imageCheckerOptions',
      'msgDialog',
      'msgDialogOptions'
    ]),
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    ...mapActions([
      'navigateToPage',
      'playVideoFile',
      'closeVideoPlayer',
      'checkImageFile',
      'closeImageChecker',
      'easyStartVideoCapture',
      'openMsgDialog',
      'closeMsgDialog'
    ]),
    handleTabChange (val) {
      this.$store.state.routerName = val
      this.$router.push({ name: val })
    },
    
    // listen event
    onPlayerPlay (player) {},
    onPlayerPause (player) {},
    onPlayerEnded (player) {},
    onPlayerLoadeddata (player) {},
    onPlayerWaiting (player) {},
    onPlayerPlaying (player) {},
    onPlayerTimeupdate (player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay (player) {},
    onPlayerCanplaythrough (player) {},
    // or listen state event
    playerStateChanged (playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied (player) {
      // seek to 10s
      player.currentTime(0)
      // console.log('example 01: the player is readied', player)
    },
    // 新消息推送
    notifyMessageArrived () {
      if (maxjia.user.notifyMessageArrived) {
        maxjia.user.notifyMessageArrived.addListener(data => {
          Bus.$emit('notifyMessageArrived')
          if (this.$route.name !== 'message') {
            this.$store.state.newMessage = true
          }
        })
      }
    },
    // 获取当前窗体id
    getCurrentWindow () {
      return new Promise((resolve, reject) => {
        maxjia.windows.getCurrentWindow(data => {
          resolve(data.id)
        })
      })
    },
    saveMainWindowId () {
      this.getCurrentWindow().then(id => {
        this.$store.state.mainWindowId = id
        console.log('main window id: ' + id)
      })
    },
    // 获取账号信息
    getAccountInfo () {
      return new Promise((resolve, reject) => {
        maxjia.user.getCurrentUser(data => {
          // console.log(data)
          data.avatarUrl && (this.$store.state.accountInfo.avatarUrl = data.avatarUrl)
          data.uid && (this.$store.state.accountInfo.uid = data.uid)
          data.userName && (this.$store.state.accountInfo.userName = data.userName)
          resolve()
        })
      })
    },
    // 定时上报
    reportTimerInit () {
      // if (!this.$store.state.config.dev) {
        setInterval(() => {
          if (this.$store.state.reportDataUpdate) {
            this.reportRequest()
          }
        }, 10000)
      // }
    },
    reportRequest () {
      const reportData = this.$store.state.REPORTDATA
      let reportDataPost = []
      const time = parseInt(new Date().getTime() / 1000)
      for (let i in reportData) {
        reportDataPost.push({
          'id': i,
          'count': reportData[i],
          'time': time
        })
      }
      // console.log('report data:', JSON.stringify(reportDataPost))

      const url = this.$store.state.config.env === 'prod' ? 'https://api.xiaoheihe.cn/pc/upload_user_click' : 'http://heybox.tt.maxjia.com:58888/pc/upload_user_click'
      const data = this.qs.stringify(reportDataPost)
      const options = {
        method: 'post',
        params: {
          'os_type': 'pc',
          'heybox_id': this.$store.state.accountInfo.uid
        },
        data: JSON.stringify(reportDataPost)
      }
      this.$ajax(url, options).then(res => {
        console.log('report success')
        this.$store.state.REPORTDATA = {}
      })
      this.$store.state.reportDataUpdate = false
    },
    getWallpaperFilter () {
      const url = '/pc/wallpaper_filter/'
      const options = {
        params: {
          'os_type': 'pc',
          'heybox_id': this.$store.state.accountInfo.uid
        }
      }
      this.$ajax.get(url, options).then(res => {
        if (res.data.status === 'ok') {
          this.$store.state.wallpaperFilter = res.data.result.filter
        }
      })
    },
    // preload
    getPreviewHardwareInfo () {
      maxjia.hardware.getPreviewHardwareInfo((data) => {
        this.$store.state.dataPreload.hardwareInfo = data
      })
    },
    getHardwareEvalInfo () {
      const url = '/pc/hardware_info/web/'
      const options = {
        params: {
          'heybox_id': this.$store.state.accountInfo.uid,
          'os_type': 'pc'
        }
      }
      this.$ajax.get(url, options).then(res => {
        if (res.data.status === 'ok') {
          this.$store.state.dataPreload.hardwareEvalInfo = res.data.result
        }
      }).catch(error => {})
    }
  },
  created () {
    // 客户端调用网页方法api
    const vm = this
    window.invokeHBJsGlobal = function (func, param) {
      if (typeof param === 'string') {
        eval("vm." + func + "('" + param + "')")
      } else if (typeof param === 'object') {
        eval("vm." + func + "(" + JSON.stringify(param) + ")")
      }
    }

    this.getAccountInfo().then(() => {
      this.reportTimerInit()
      this.getWallpaperFilter()
      this.getHardwareEvalInfo()
    })
    this.getPreviewHardwareInfo()


    const routeName = this.$route.name.split('-')[0]
    this.$store.state.routerName = routeName

    this.notifyMessageArrived()

    const mediaListShowType = localStorage.getItem('mediaListShowType')
    if (mediaListShowType) {
      this.$store.state.mediaListShowType = mediaListShowType
    }
    // 壁纸音量
    const wv = localStorage.getItem('wallpaperVolume')
    if (wv) {
      maxjia.wallpaper.setVideoVolumeSize(Number(wv / 100))
      this.$store.state.wallpaperControler.volumeSize = Number(wv)
    }
  },
  mounted () {
    // console.log('this is current player instance object', this.player)
    setTimeout(() => {
      // console.log('dynamic change options', this.player)
      this.player.muted(false)
    }, 2000)
    // console.log(this)

    this.saveMainWindowId()
  }
}
</script>

<style lang="less">
@import "./styles/reset.css";
@import "./styles/import.less";
@import "./styles/global.less";

#app {
  height: 100%;
  // background: url(./assets/background_img.png) no-repeat right top;
  background: url(./assets/main_bg_1.jpg) no-repeat center;
  background-size: cover;
  padding-top: @navHeight + 1px;
  // border: 1px solid #000;
  // box-shadow: 0 0 0 1px @layoutBorderColor inset;
}

.app-content {
  height: 100%;
}

// .video-close-button {
//   display: none;
//   position: fixed;
//   z-index: @videoCloseButton;
//   top: 75px;
//   right: 15px;
//   color: @lightIconColor;
//   cursor: pointer;
//   .common-transition;
//   &:hover {
//     color: @primaryColor;
//   }
// }

.video-player-body {
  .video-wrap {
    // position: relative;
    // padding-top: 56.25%;
    .video-player {
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      height: calc(~"100% - 60px");
      overflow: hidden;
    }
  }
}

.vjs-icon-play, .video-js .vjs-big-play-button .vjs-icon-placeholder:before, .video-js .vjs-play-control .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-play:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before, .video-js .vjs-play-control .vjs-icon-placeholder:before {
  content: "\e67e";
}
.vjs-icon-pause, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-pause:before, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before {
  content: "\e61b";
}
.vjs-icon-volume-mute, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-mute:before, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before {
  content: "\e682";
}
.vjs-icon-volume-low, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-low:before, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder:before {
  content: "\e67f";
}
.vjs-icon-volume-mid, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-mid:before, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder:before {
  content: "\e680";
}
.vjs-icon-volume-high, .video-js .vjs-mute-control .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-high:before, .video-js .vjs-mute-control .vjs-icon-placeholder:before {
  content: "\e681";
}
.vjs-icon-fullscreen-enter, .video-js .vjs-fullscreen-control .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before {
  content: "\e629";
}
.vjs-icon-fullscreen-exit, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-fullscreen-exit:before, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder:before {
  content: "\e628";
}
.vjs-icon-replay, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder {
  font-family: "iconfont";
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-replay:before, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder:before {
  content: "\e636";
}

.font-preload {
  position: absolute;
  left: -9999px;
  font-family: 'DIN'
}


</style>
