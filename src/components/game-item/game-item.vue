<template>
  <div class="cpt-game-item">
    <div class="game-item">
      <div class="layer" :class="{ 'launching': launching }">
        <div class="wrap progress" v-show="launching">
          <div class="msg">启动中</div>
          <cpt-linear-progress :size="2" />
        </div>
        <div class="wrap options" v-show="!launching">
          <cpt-button label="启动" icon="start-fill" @click="launchGame" :param1="data.gameId" primary />
          <cpt-button v-if="data.supportOptimize" label="优化" icon="optimization-fill" @click="openOptDialog" />
        </div>
      </div>
      <div class="game-img">
        <transition name="fade" mode="out-in">
          <img v-if="data.gameHeaderImage" :src="data.gameHeaderImage" alt="">
        </transition>
        <img v-if="!data.gameHeaderImage" :src="'max-file:\\' + data.gameIcon" alt="">
      </div>
      <div class="info-bar">
        <div class="name">
          <img :src="'max-file:\\' + data.gameIcon" alt="">
          <span>{{ data.gameName }}</span>
        </div>
        <!-- <div class="duration">已玩 2324 h</div> -->
      </div>
    </div>
    <cpt-dialog :open="optDialog" title="" @close="closeOptDialog" @hide="closeOptDialog" dialogClass="opt-dialog" :overlayOpacity="0.7" optDialog cornerClose>
      <div class="opt-dialog-body">
        <div class="opt-preview-wrap" ref="preview" @mousemove="getDiffLinePosition">
          <div class="mask"></div>
          <div class="diff-line-wrap" :style="diffLineStyle">
            <div class="point"></div>
            <div class="line"></div>
            <div class="label">
              <div class="col">原始效果</div>
              <div class="col">预览效果</div>
            </div>
          </div>
          <div class="opt-intro-box-mask"></div>
          <div class="opt-intro-box">
            <div class="layer loading" v-if="optState === 1">
              <div class="msg">优化中</div>
              <cpt-linear-progress :size="2" />
            </div>
            <div class="layer result" v-if="optState === 2">
              <cpt-mark success></cpt-mark>
              <div class="msg">优化成功</div>
              <cpt-button label="启动游戏" primary @click="launchGame" :param1="data.gameId"></cpt-button>
            </div>
            <template v-if="optState === 0">
              <div class="layer opt" v-for="(i, index) in data.supportLevels" :key="index" v-show="optLevel === Number(i.configLevel)">
                <div class="title">{{ i.levelName }}</div>
                <div class="desc">{{ i.levelDesc }}</div>
                <cpt-button v-if="currentOptLevel === Number(i.configLevel)" label="已优化" secondary disabled small></cpt-button>
                <cpt-button v-else label="开始优化" primary small @click="optimizeConfirm(Number(i.configLevel))"></cpt-button>
              </div>
              <div class="layer opt" v-if="optRecommandLevel">
                <div class="title">{{ data.supportLevels[1].levelName }}</div>
                <div class="desc">{{ data.supportLevels[1].levelDesc }}</div>
                <cpt-button v-if="currentOptRecommandLevel" label="已优化" secondary disabled small></cpt-button>
                <cpt-button v-else label="开始优化" primary small @click="optimizeConfirm(data.recommand_level)"></cpt-button>
              </div>
            </template>
          </div>
          <div class="preview after" :style="previewAfter">
            <!-- <img src="../assets/opt_after.png" alt=""> -->
          </div>
          <div class="preview before" :style="diffLineStyle">
            <div class="img-wrap" :style="previewBefore">
              <!-- <img src="../assets/opt_before.jpg" alt=""> -->
            </div>
          </div>
        </div>
        <div class="options">
          <cpt-button v-for="(i, index) in data.supportLevels"
            :key="index" 
            v-if="Number(i.configLevel) !== 2"
            :label="i.levelName" 
            :secondary="optLevel === Number(i.configLevel) ? false : true" 
            :primary="optLevel === Number(i.configLevel) ? true : false" 
            small 
            :success="currentOptLevel === Number(i.configLevel)" 
            :icon="currentOptLevel === Number(i.configLevel) ? 'check-fill' : ''"
            @click="changeOptType({ level: Number(i.configLevel) })">
          </cpt-button>
          <cpt-button v-if="data.recommand_level"
            label="推荐配置" 
            :secondary="!optRecommandLevel" 
            :primary="optRecommandLevel" 
            small 
            :success="currentOptRecommandLevel" 
            :icon="currentOptRecommandLevel ? 'check-fill' : ''"
            @click="changeOptType({ level: data.recommand_level, recommand: true })">
          </cpt-button>

          <!-- <cpt-button v-show="currentOptLevel !== 0" label="还原设置" primary small></cpt-button> -->
        </div>
      </div>
      <!-- <mu-flat-button slot="actions" @click="closeOptDialog" primary label="取消"/> -->
      <!-- <mu-flat-button slot="actions" primary @click="closeOptDialog" label="确定"/> -->
    </cpt-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import linearProgress from '@/components/linearProgress'
import readFile from '@/components/readFile'

export default {
  name: "cpt-video-item",
  mixins: [readFile],
  components: {
    'cpt-dialog': dialog,
    'cpt-linear-progress': linearProgress
  },
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      launching: false,
      launchingTime: 5000,
      optDialog: false,
      previewAfterImg: require('../../assets/opt_after.png'),
      previewBeforeImg: require('../../assets/opt_before.jpg'),
      diffLineWidth: 50,
      optLevelData: [
        {
          level: 1,
          title: '一档设置',
          desc: '关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……'
        },
        {
          level: 2,
          title: '二档设置',
          desc: '关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……'
        },
        {
          level: 3,
          title: '三档设置',
          desc: '关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……'
        },
        {
          level: 4,
          title: '四档设置',
          desc: '关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……关闭了XX进程，清理RAM……游戏更新后可能需要重新进行优化……'
        }
      ],
      optLevel: 1, // 选中的优化level
      optRecommandLevel: false, // 选中推荐的level
      currentOptLevel: 0, // 已优化的level
      currentOptRecommandLevel: false, // 已优化的是否为推荐level
      optState: 0, // opt state 0 -> 默认, 1 -> 优化中, 2 -> 优化结束
      optimizing: false
    }
  },
  computed: {
    previewAfter () {
      return {
        'background-image': 'url(' + this.previewAfterImg + ')'
      }
    },
    previewBefore () {
      return {
        'background-image': 'url(' + this.previewBeforeImg + ')'
      }
    },
    diffLineStyle () {
      return {
        'width': this.diffLineWidth + '%'
      }
    }
  },
  watch: {
    data (value) {
      this.pubgFullscreenHandler()
    }
  },
  methods: {
    launchGame (gameId) {
      this.launching = true
      setTimeout(() => {
        this.launching = false
      }, this.launchingTime)
      console.log(`launch game: ${gameId}`)
      maxjia.store.games.launchGame(gameId)
    },
    // 游戏优化对话框
    openOptDialog () {
      this.optDialog = true
      if (this.data.recommand_level) {
        this.changeOptType({
          level: this.data.recommand_level,
          recommand: true
        })
      } else {
        this.optLevel = 1
        this.changeOptType({
          level: this.optLevel
        })
      }

      // this.optLevel = this.data.recommand_level
      // if (this.optLevel < 1) {
      //   this.optLevel = 1
      // }
      // console.log(this.optLevel)
      // this.changeOptType(this.optLevel)
    },
    closeOptDialog () {
      this.optDialog = false
    },
    getDiffLinePosition (event) {
      const e = event || window.event
      const mX = e.clientX
      const p = this.$refs.preview
      const pX = p.offsetParent.offsetLeft
      const pW = p.offsetParent.clientWidth
      let percent = Number(((mX - pX) / pW) * 100).toFixed(6)
      percent = percent < 10 ? 10 : percent
      percent = percent > 90 ? 90 : percent
      this.diffLineWidth = percent
    },
    optimizeGame (gameId, optLevel) {
      this.optimizing = true
      console.log(gameId, optLevel)

      // engine
      this.gameOptimize({
        fileName: 'engine',
        filePath: this.data.enginePath,
        gameId: gameId,
        level: optLevel,
        callback: () => {
          console.log(`游戏 ${gameId} level ${optLevel} engine 配置成功`)
        }
      })

      // gameUserSettings
      this.gameOptimize({
        fileName: 'gameUserSettings',
        filePath: this.data.gameUserSettingsPath,
        gameId: gameId,
        level: optLevel,
        callback: () => {
          console.log(`游戏 ${gameId} level ${optLevel} gameUserSettings 配置成功`)
        }
      })
    
      setTimeout(() => {
        if (this.optRecommandLevel) {
          this.currentOptRecommandLevel = true
          this.currentOptLevel = 0
        } else {
          this.currentOptLevel = this.optLevel
          this.currentOptRecommandLevel = false
        }
        this.optState = 2
        this.optimizing = false
      }, 1000)

    },
    changeOptType (config) {
      // console.log(config.recommand)
      if (!this.optimizing) {
        // for (let [index, i] of this.data.supportLevels) {
        //   if (i.configLevel === level) {
        //     this.previewAfterImg = this.data.supportLevels[index].image
        //   }
        // }
        for (let i = 0; i < this.data.supportLevels.length; i++) {
          const el = this.data.supportLevels[i]
          if (Number(el.configLevel) === Number(config.level)) {
            this.previewAfterImg = this.data.supportLevels[i].image
            this.previewBeforeImg = this.data.supportLevels[i].originalImage
          }
        }

        // 记录用户上次选择的优化方案
        let gameJSON = JSON.parse(localStorage.getItem(this.data.gameId))
        if (config.recommand) {
          this.optRecommandLevel = true
          this.optLevel = 0
          gameJSON.recommend = true
        } else {
          this.optLevel = config.level
          this.optRecommandLevel = false
          gameJSON.optLevel = Number(config.level)
          gameJSON.recommend = false          
        }
        localStorage.setItem(this.data.gameId, JSON.stringify(gameJSON))
        this.optState = 0
      }
    },
    optimizeConfirm (level) {
      this.optState = 1
      this.optimizeGame(this.data.gameId, level)
    },
    // pubg强制设置全屏
    pubgFullscreenHandler () {
      if (this.data.gameId === 10410005 && this.data.gameUserSettingsPath) {
        const filePath = this.data.gameUserSettingsPath
        // this._readFile(filePath).then(data => {
        //   // console.log(data)
        //   const str = data.content
        //   console.log(str.match(/FullscreenMode=\d/))
        // })
        this.readINI(filePath).then(data => {
          data['/Script/TslGame.TslGameUserSettings']['FullscreenMode'][0].v = '1'
          this._writeFile(data, filePath)
          console.log('全屏参数设置项更改')
        })
      }
    }
  },
  created () {
    // 显示用户上次选择的优化方案
    const local = localStorage.getItem(this.data.gameId)
    if (local) {
      const gameJSON = JSON.parse(local)
      // console.log(gameJSON)
      if (gameJSON.recommend) {
        this.currentOptRecommandLevel = true
      } else if (gameJSON.optLevel) {
        this.currentOptLevel = gameJSON.optLevel
        this.currentOptRecommandLevel = false        
      }
    }

  },
  mounted () {
    // this.gameOptimize({
    //   gameId: gameId,
    //   level: optLevel,
    //   callback: () => {}
    // })
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-game-item {
  width: 25%;
  padding: 0 20px 20px 0;
  .common-transition;
  @media (max-width: 900px) {
    width: 50%;
  }
  @media (max-width: 1200px) {
    width: 33.333333%;
  }
  .game-item {
    position: relative;
    padding-top: 47%;
    border-radius: 2px;
    background-color: fade(@alternateTextColor, 80%);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    &:hover {
      .layer {
        opacity: 1;
      }
    }
    .layer {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      background: fade(@alternateTextColor, 80%);
      opacity: 0;
      // .common-transition;
      transition-property: opacity;
      &.launching {
        opacity: 1;
      }
      > .wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        &.progress {
          padding: 0 60px;
          .msg {
            font-size: 12px;
            color: fade(@textColor, 60%);
            margin-bottom: 12px;
          }
        }
        &.options {
          flex-direction: row;
        }
      }
      .cpt-button {
        margin: 0 6px;
      }
    }
    .game-img {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-height: 100%;
      }
    }
    &.add-game {
      &:hover {
        background-color: fade(@textColor, 20%);
      }
      &.active {
        background-color: fade(@textColor, 10%);
      }
      .layer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 1;
        color: fade(@textColor, 20%);
        cursor: pointer;
        &:hover {
          color: fade(@textColor, 60%);
        }
        &:active {
          color: fade(@textColor, 20%);
        }
        span {
          font-size: 12px;
          line-height: 1;
          margin-top: 8px;
        }
      }
    }
    .info-bar {
      position: absolute;
      z-index: 10;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      height: 38px;
      line-height: 38px;
      text-shadow: @textShadow;
      background-image: linear-gradient(to bottom, fade(@fullBlack, 0%) 0%, fade(@fullBlack, 60%) 100%);
      padding: 0 12px;
      .name {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        font-size: 14px;
        text-shadow: 0 1px 1px rgba(0,0,0,1);
        img {
          display: block;
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
      .duration {
        color: fade(@textColor, 60%);
        font-size: 12px;
      }
    }
  }
}

.opt-dialog-body {
  .opt-preview-wrap {
    position: relative;
    padding-top: 56.25%;
    .diff-line-wrap {
      position: absolute;
      z-index: 20;
      top: 0;
      left: 0;
      height: 100%;
      width: 50%;
      .line{
        position: absolute;
        z-index: 1;
        top: 0;
        right: -1px;
        bottom: 0;
        width: 2px;
        background-color: fade(@fullWhite, 20%);
      }
      .point {
        position: absolute;
        top: -7px;
        right: -7px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #ffffff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px 0 rgba(0, 0, 0, 0.1);
      }
      .label {
        position: absolute;
        top: 0;
        right: -80px;
        display: flex;
        width: 160px;
        line-height: 40px;
        text-shadow: 0 1px 1px fade(@fullBlack, 90%);
        .col {
          flex: 1;
          min-width: 0;
          font-size: 12px;
          color: fade(@textColor, 80%);
          text-align: center;
        }
      }
    }
    .mask {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background-image: linear-gradient(to top, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8));
    }
    .preview {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      height: 100%;
      background-color: #333;
      background-size: cover;
      background-position: center;
      // overflow: hidden;
      &.before {
        width: 50%;
        .img-wrap {
          height: 100%;
          background-size: cover;
          background-position: left center;
        }
      }
      &.after {
        width: 100%;
      }
    }
  }
  .options {
    padding: 16px;
    font-size: 0;
    .cpt-button {
      margin-right: 16px;
      // &:last-of-type {
      //   margin-right: 0;
      //   float: right;
      // }
    }
  }
}

.opt-preview-wrap {
  // background: url(../../assets/opt_before.jpg) no-repeat;
  // background-size: cover;
  // .opt-intro-box-mask {
  //   position: absolute;
  //   z-index: 30;
  //   left: 16px;
  //   bottom: 16px;
  //   width: 344px;
  //   height: 160px;
  //   border-radius: 2px;
  //   background: inherit;
  //   background-attachment: fixed;
  //   filter: blur(5px);
  // }
  .opt-intro-box {
    position: absolute;
    z-index: 40;
    left: 16px;
    bottom: 16px;
    width: 344px;
    height: 160px;
    border-radius: 2px;
    background-color: fade(@fullBlack, 90%);
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 16px;
      &.opt {
        .cpt-button {
          position: absolute;
          top: 16px;
          right: 16px;
        }
        .title {
          font-size: 16px;
          color: @textColor;
          line-height: 30px;
          margin-bottom: 10px;
        }
        .desc {
          font-size: 12px;
          color: fade(@textColor, 50%);
          line-height: 24px;
        }
      }
      &.result {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .msg {
          font-size: 12px;
          line-height: 1;
          color: fade(@textColor, 50%);
          margin: 12px 0 22px;
        }
        .cpt-button {
          width: 224px;
        }
      }
      &.loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .msg {
          font-size: 12px;
          line-height: 1;
          color: fade(@textColor, 50%);
        }
        .mu-linear-progress {
          width: 224px;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>