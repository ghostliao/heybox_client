<template>
  <div class="view-settings-video">
    <div class="wrapper">
      <cpt-set-block-head title="设置"></cpt-set-block-head>
      <div class="body">
        <cpt-set-block title="路径设置">
          <div class="setting-row path">
            <div class="label-wrap">
              <span class="label">录屏文件</span>
              <!-- <span class="desc">（可用磁盘空间5.60G）</span> -->
            </div>
            <div class="text-field-wrap">
              <cpt-text-field :value="videoDir" preIcon="search-file-fill" readonly></cpt-text-field>
              <cpt-button label="更改" secondary small @click="setVideoDir"></cpt-button>
            </div>
          </div>
          <div class="setting-row path">
            <div class="label-wrap">
              <span class="label">截屏文件</span>
              <!-- <span class="desc">（可用磁盘空间5.60G）</span> -->
            </div>
            <div class="text-field-wrap">
              <cpt-text-field :value="imageDir" preIcon="search-file-fill" readonly></cpt-text-field>
              <cpt-button label="更改" secondary small @click="setImageDir"></cpt-button>
            </div>
          </div>
        </cpt-set-block>

        <cpt-set-block title="热键设置">
          <cpt-set-shortcut label="开始/停止视频录制" name="Video.CaptureVideo" app="Video" hotkeyKey="captureVideo"></cpt-set-shortcut>
          <cpt-set-shortcut label="保存精彩时刻" name="Video.Save30Moment" app="Video" hotkeyKey="save30Moment"></cpt-set-shortcut>
          <cpt-set-shortcut label="截屏" name="Video.CaptureImage" app="Video" hotkeyKey="captureImage"></cpt-set-shortcut>
          <cpt-set-shortcut label="召唤浮窗" name="Dock.Show" app="Dock" hotkeyKey="dockShow">
            <!-- <span slot="desc">是否在打开任何游戏时都启动精彩时刻？</span> -->
          </cpt-set-shortcut>
          <cpt-set-shortcut label="游戏内浮窗控制" name="Overlay.Control" app="Overlay" hotkeyKey="overlayControl"></cpt-set-shortcut>
          <cpt-set-shortcut label="游戏内浮窗显示/隐藏" name="Overlay.ShowHide" app="Overlay" hotkeyKey="overlayShowHide"></cpt-set-shortcut>
        </cpt-set-block>

        <!-- <cpt-set-block title="启动设置">
          <cpt-set-switch label="录制精彩镜头" :switch="isVideoCaptureForMoment" @input="setIsVideoCaptureForMoment">
            <span slot="desc">desc</span>
          </cpt-set-switch>
          <cpt-set-switch label="自动录屏" :switch="isAutoStartCaptureInGame" @input="setIsAutoStartCaptureInGame">
            <span slot="desc">desc</span>
          </cpt-set-switch>
        </cpt-set-block>  -->

        <cpt-set-block v-if="gameOverlaySettings.length > 0" title="游戏内浮窗开关">
          <cpt-set-switch :label="i.gameName" v-for="i in gameOverlaySettings" :key="i.gameId" :data="i" :switch="i.overlayEnabled" @input="setGameOverlaySwitch">
            <!-- <span slot="desc">desc</span> -->
          </cpt-set-switch>
        </cpt-set-block>

        <cpt-set-block title="关于小黑盒">
          <div class="setting-row info">
            <div class="label-wrap">
              <span class="label">当前版本：Heybox v{{clientVersion}}</span>
            </div>
          </div>
          <div class="setting-row info" v-if="$store.state.config.env === 'test'">
            <div class="label-wrap">
              <span class="label">WEB测试版本：{{ $store.state.config.ver }}</span>
            </div>
          </div>
        </cpt-set-block>
      </div>
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
      imageDir: '',
      isVideoCaptureForMoment: false,
      isAutoStartCaptureInGame: false,
      gameOverlaySettings: [],
      clientVersion: '999.0.0'
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
    getImageDir () {
      maxjia.settings.getImageDir((data) => {
        this.imageDir = data.imageDir
      })
    },
    setImageDir () {
      maxjia.store.selectDirectory('选择文件夹', (data) => {
        if (data.result === 'selected') {
          const path = data.path
          maxjia.settings.setImageDir(path)
          this.imageDir = path
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
        console.log(data)
        this.gameOverlaySettings = data.gameOverlaySettings
      })
    },
    setGameOverlaySwitch (params) {
      console.log(params)
      maxjia.settings.setGameOverlaySwitch(params[1], params[2], params[0])
    },
    settingsInit () {
      this.getVideoDir()
      this.getImageDir()
      // this.getIsVideoCaptureForMoment()
      this.getIsAutoStartCaptureInGame()
      this.getGameOverlaySettings()
    },
    getClientInfo () {
      this.clientVersion = maxjia.maxapi.version
    }
  },
  created () {
    this.getClientInfo()
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
  // padding: 16px 36px 16px 236px;
  padding: 16px 36px;
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
  min-height: 46px;
  &.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
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
