<template>
  <cpt-dialog :open="momentDialog" title="" @hide="closeMomentDialog" dialogClass="moment-dialog" :overlayOpacity="0.8" cornerClose>
    <div class="moment-dialog-wrap">
      <div class="moment-dialog-head">
        <div class="title">本次游戏精彩时刻</div>
      </div>
      <div class="moment-dialog-body" ref="momentList">
        <div class="moment-dialog-body-container">
          <cpt-moment-dialog-media-item v-for="(i, index) in mediaList" :key="index" :data="i" :index="index" :itemCount="mediaList.length"></cpt-moment-dialog-media-item>
        </div>
        <lazy :time="300">
          <div class="moment-dialog-upload-all">
            <div class="txt">精彩的游戏！赶快分享给大家吧~</div>
            <cpt-button label="全部上传" icon="upload-fill" long primary @click="uploadAllMoment" />
          </div>
        </lazy>
      </div>
    </div>
  </cpt-dialog>
</template>

<script>
import cptMomentDialogMediaItem from './moment-dialog-media-item'
import Bus from '@/components/bus'
import videoFile from '@/components/videoFile'
import imageFile from '@/components/imageFile'

export default {
  name: 'cpt-moment-dialog',
  mixins: [videoFile, imageFile],
  components: {
    'cpt-moment-dialog-media-item': cptMomentDialogMediaItem
  },
  props: {
    
  },
  data () {
    return {
      momentDialog: false,
      loading: true,
      mediaList: [],
      currentOverlayGameId: 0
    }
  },
  computed: {
    
  },
  methods: {
    openMomentDialog () {
      this.momentDialog = true
    },
    closeMomentDialog () {
      this.momentDialog = false
    },
    // 本次游戏精彩时刻全部上传
    uploadAllMoment () {
      Bus.$emit('uploadAll')
    },
    // 监听游戏Overlay注入
    gameOverlayListener () {
      maxjia.games.overlayStart.addListener(data => {
        console.log(data)
        this.currentOverlayGameId = data.gameId
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
    },
    onOverlayStop () {
      console.log('overlay stop')
      this.mediaList.length > 0 && this.showGameMomentsList()
    },
    showGameMomentsList () {
      this.openMomentDialog()
      maxjia.windows.activeWindow(this.$store.state.mainWindowId)
      console.log('active main window')
    },
    getCurrentOverlayGame () {
      maxjia.games.getCurrentOverlayGame(data => {
        return data
      })
    },
    getLastGameFpsStats () {
      maxjia.games.getLastGameFpsStats('gameId', data => {})
    }
  },
  created () {

  },
  mounted () {
    maxjia.games.overlayStart && this.gameOverlayListener()

    Bus.$on('start', this.onOverlayStart)
    Bus.$on('stop', this.onOverlayStop)
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
  }
}
.moment-dialog-body {
  height: calc(~"100% - 50px");
  overflow-y: scroll;
}
.moment-dialog-body-container {
  padding: 8px 16px;
}
.moment-dialog-upload-all {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 120px;
  padding-bottom: 30px;
  .txt {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 20px;
  }
}

</style>