<template>
  <div class="view-settings-video">
    <div class="wrapper">
      <cpt-set-block-head title="录制设置"></cpt-set-block-head>
      <div class="body">
        <cpt-set-block title="路径设置">
          <div class="setting-row path">
            <div class="label-wrap">
              <span class="label">视频文件</span>
              <!-- <span class="desc">（可用磁盘空间5.60G）</span> -->
            </div>
            <div class="text-field-wrap">
              <cpt-text-field :value="videoDir" preIcon="add-file-thin" readonly></cpt-text-field>
              <cpt-button label="浏览" secondary small @click="setVideoDir"></cpt-button>
            </div>
          </div>
        </cpt-set-block>
        <cpt-set-block title="热键设置">
          <cpt-set-shortcut label="开始/停止视频录制" name="Video.CaptureVideo" app="Video" hotkeyKey="captureVideo"></cpt-set-shortcut>
          <cpt-set-shortcut label="保存精彩时刻" name="Video.Save30Moment" app="Video" hotkeyKey="save30Moment"></cpt-set-shortcut>
          <cpt-set-shortcut label="截屏" name="Video.CaptureImage" app="Video" hotkeyKey="captureImage"></cpt-set-shortcut>
          <cpt-set-shortcut label="Dock显示/隐藏" name="Dock.Show" app="Dock" hotkeyKey="dockShow">
            <span slot="desc">是否在打开任何游戏时都启动精彩时刻？</span>
          </cpt-set-shortcut>
          <cpt-set-shortcut label="Overlay显示/隐藏" name="Overlay.ShowHide" app="Overlay" hotkeyKey="overlayShowHide"></cpt-set-shortcut>
        </cpt-set-block>    
        <cpt-set-block title="启动设置">
          <!-- <cpt-set-switch label="录制精彩镜头" :switch="isVideoCaptureForMoment" @input="setIsVideoCaptureForMoment">
            <span slot="desc">desc</span>
          </cpt-set-switch> -->
          <cpt-set-switch label="自动录屏" :switch="isAutoStartCaptureInGame" @input="setIsAutoStartCaptureInGame">
            <span slot="desc">desc</span>
          </cpt-set-switch>
        </cpt-set-block> 
      </div>
      <template v-if="gameOverlaySettings.length > 0">
        <cpt-set-block-head title="Overlay设置"></cpt-set-block-head>
        <div class="body">
          <cpt-set-block title="">
            <cpt-set-switch :label="i.gameName" v-for="i in gameOverlaySettings" :key="i.gameId" :data="i" :switch="i.overlayEnabled" @input="setGameOverlaySwitch">
              <span slot="desc">desc</span>
            </cpt-set-switch>
          </cpt-set-block>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import cptSwitch from '@/components/switch'
import {cptSetBlock, cptSetBlockHead} from "@/components/set-block"
import cptSetShortcut from '@/components/set-shortcut'
import cptSetSwitch from '@/components/set-switch'
import cptTextField from '@/components/text-field'

export default {
  name: "view-settings-video",
  components: {
    'cpt-switch': cptSwitch,
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-set-shortcut': cptSetShortcut,
    'cpt-set-switch': cptSetSwitch,
    'cpt-text-field': cptTextField
  },
  data () {
    return {
      videoDir: '',
      isVideoCaptureForMoment: false,
      isAutoStartCaptureInGame: false,
      gameOverlaySettings: []
    }
  },
  methods: {
    getVideoDir () {
      maxjia.settings.getVideoDir((data) => {
        this.videoDir = data.videoDir
      })
    },
    setVideoDir () {
      maxjia.store.selectDirectory('选择文件夹', (data) => {
        if (data.result === 'selected') {
          const path = data.path
          maxjia.settings.setVideoDir(path)
          this.videoDir = path
        }
      })
    },
    // 是否录制精彩镜头
    getIsVideoCaptureForMoment () {
      maxjia.settings.getIsVideoCaptureForMoment((data) => {
        // console.log(data)
        this.isVideoCaptureForMoment = data.isVideoCaptureForMoment
      })
    },
    setIsVideoCaptureForMoment (bool) {
      maxjia.settings.setIsVideoCaptureForMoment(bool)
    },
    // 是否自动录屏
    getIsAutoStartCaptureInGame () {
      maxjia.settings.getIsAutoStartCaptureInGame((data) => {
        // console.log(data)
        this.isAutoStartCaptureInGame = data.isAutoStartCaptureInGame
      })
    },
    setIsAutoStartCaptureInGame (bool) {
      maxjia.settings.setIsAutoStartCaptureInGame(bool)
    },
    // 是否启动overlay
    getGameOverlaySettings () {
      maxjia.settings.getGameOverlaySettings((data) => {
        // console.log(data)
        this.gameOverlaySettings = data.gameOverlaySettings
      })
    },
    setGameOverlaySwitch (params) {
      // console.log(params)
      maxjia.settings.setGameOverlaySwitch(params[1], params[2], params[0])
    },
    settingsInit () {
      this.getVideoDir()
      // this.getIsVideoCaptureForMoment()
      this.getIsAutoStartCaptureInGame()
      this.getGameOverlaySettings()
    }
  },
  mounted () {
    this.settingsInit()
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-settings-video {
  flex: 1;
  min-width: 0;
  padding: 16px 36px 16px 236px;
  .wrapper {
    max-width: 500px;
    margin: auto;
    > .head {
      height: 46px;
      line-height: 46px;
      .title {
        font-size: 16px;
      }
      .subtitle {
        font-size: 12px;
        color: fade(@textColor, 20%);
      }
    }
    > .body {
      margin-bottom: 16px;
    }
  }
}
.setting-row {
  &.path {
    .label-wrap {
      line-height: 1;
    }
    .text-field-wrap {
      display: flex;      
      margin-top: 8px;
      .cpt-text-field {
        flex: 1;
        min-width: 0;
        padding-right: 12px;
      }
    }
  }
}

</style>
