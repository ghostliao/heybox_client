<template>
  <div class="cpt-game-item">
    <div class="game-item">
      <div class="layer">
        <cpt-button label="启动" icon="start-fill" @click="launchGame" :param1="data.gameId" primary />
        <cpt-button v-if="data.supportOptimize" label="优化" icon="optimization-fill" @click="openOptDialog" />
      </div>
      <div class="game-img">
        <img :src="'max-file:\\' + data.gameIcon" alt="">
      </div>
      <div class="info-bar">
        <div class="name">{{ data.gameName }}</div>
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
              <div class="layer opt" v-for="(i, index) in optLevelData" :key="index" v-show="optLevel === i.level">
                <div class="title">{{ i.title }}</div>
                <div class="desc">{{ i.desc }}</div>
                <cpt-button v-if="currentOptLevel === i.level" label="已优化" secondary disabled small></cpt-button>
                <cpt-button v-else label="开始优化" primary small @click="optimizeConfirm(i.level)"></cpt-button>
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
          <cpt-button v-for="(i, index) in 4" :key="index" :label="`${index + 1}档设置`" :secondary="optLevel === index + 1 ? false : true" :primary="optLevel === index + 1 ? true : false" small :success="currentOptLevel === index + 1" :icon="currentOptLevel === index + 1 ? 'success' : ''" @click="changeOptType(index + 1)"></cpt-button>

          <!-- <cpt-button label="二档设置" :secondary="optLevel === 2 ? false : true" :primary="optLevel === 2 ? true : false" small :success="currentOptLevel === 2" @click="changeOptType(2)"></cpt-button>
          <cpt-button label="三档设置" :secondary="optLevel === 3 ? false : true" :primary="optLevel === 3 ? true : false" small :success="currentOptLevel === 3" @click="changeOptType(3)"></cpt-button>
          <cpt-button label="四档设置" :secondary="optLevel === 4 ? false : true" :primary="optLevel === 4 ? true : false" small :success="currentOptLevel === 4" @click="changeOptType(4)"></cpt-button> -->
          <cpt-button label="还原设置" primary small></cpt-button>
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

export default {
  name: "cpt-video-item",
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
      optLevel: 1,
      currentOptLevel: 0,
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
  methods: {
    launchGame (gameId) {
      console.log(`launch game: ${gameId}`)
      maxjia.store.games.launchGame(gameId)
    },
    // 游戏优化对话框
    openOptDialog () {
      this.optDialog = true
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
    optimizeGame (gameId) {
      this.optimizing = true
      // maxjia.store.games.optimizeGame(gameId)
      setTimeout(() => {
        this.currentOptLevel = this.optLevel
        this.optState = 2
        this.optimizing = false
      }, 2000)
    },
    changeOptType (level) {
      if (!this.optimizing) {
        this.optLevel = level
        this.optState = 0
      }
    },
    optimizeConfirm () {
      this.optState = 1
      this.optimizeGame()
    }
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
    padding-top: 50%;
    border-radius: 2px;
    background-color: fade(@alternateTextColor, 80%);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
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
      display: flex;
      justify-content: center;
      align-items: center;
      background: fade(@alternateTextColor, 80%);
      opacity: 0;
      .common-transition;
      transition-property: opacity;
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
      padding: 0 12px;
      .name {
        flex: 1;
        min-width: 0;
        font-size: 14px;
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
      &:last-of-type {
        margin-right: 0;
        float: right;
      }
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
        }
        .desc {
          font-size: 14px;
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