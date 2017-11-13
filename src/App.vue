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
    <cpt-dialog :open="videoPlayer" title="" @close="closeVideoPlayer" @hide="closeVideoPlayer" dialogClass="opt-dialog" :overlayOpacity="0.8" cornerClose :escPressClose="false">
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
    <cpt-dialog :open="imageChecker" title="" @close="closeImageChecker" @hide="closeImageChecker" dialogClass="image-checker" :overlayOpacity="0.8">
      <cpt-image-checker></cpt-image-checker>
    </cpt-dialog>
    <!-- E image checker -->

    <!-- S msg dialog -->
    <cpt-dialog :open="msgDialog" title="" @close="closeMsgDialog" @hide="closeMsgDialog" dialogClass="msg-dialog" :overlayOpacity="0.8" cornerClose>
      <cpt-msg-dialog :markType="$store.state.msgDialogOptions.markType" :msg="$store.state.msgDialogOptions.msg">
        
      </cpt-msg-dialog>
    </cpt-dialog>
    <!-- E msg dialog -->

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
import cptMsgDialog from '@/components/msg-dialog'

export default {
  name: 'app',
  mixins: [hotkeys],
  components: {
    'cpt-video-player': cptVideoPlayer,
    'video-player': videoPlayer,
    'app-header': appHeader,
    'cpt-image-checker': cptImageChecker,
    'cpt-msg-dialog': cptMsgDialog
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
      'setGameType',
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
    }
  },
  created () {
    const vm = this
    window.invokeHBJsGlobal = function (func, param) {
      if (typeof param === 'string') {
        eval("vm." + func + "('" + param + "')")
      } else if (typeof param === 'object') {
        eval("vm." + func + "(" + JSON.stringify(param) + ")")
      }
    }

    const routeName = this.$route.name.split('-')[0]
    this.$store.state.routerName = routeName

    this.setGameType('aaa')
  },
  mounted () {
    // console.log('this is current player instance object', this.player)
    setTimeout(() => {
      // console.log('dynamic change options', this.player)
      this.player.muted(false)
    }, 2000)
    // console.log(this)
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
  overflow-y: scroll;
  margin-right: 2px;
}

.video-player-body {
  .video-wrap {
    position: relative;
    padding-top: 56.25%;
    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}

.font-preload {
  position: absolute;
  left: -9999px;
  font-family: 'DIN'
}


</style>
