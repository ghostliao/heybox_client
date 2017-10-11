<template>
  <div class="cpt-game-item">
    <div class="game-item">
      <div class="layer">
        <cpt-button label="启动" icon="start-thin" @click="launchGame" :param1="data.gameId" primary />
        <cpt-button label="优化" icon="optimization-thin" @click="openOptDialog" />
      </div>
      <div class="info-bar">
        <div class="name">{{ data.gameName }}</div>
        <!-- <div class="duration">已玩 2324 h</div> -->
      </div>
    </div>
    <cpt-dialog :open="optDialog" title="" @close="closeOptDialog" @hide="closeOptDialog" dialogClass="opt-dialog" :overlayOpacity="0.7" optDialog cornerClose>
      <div class="opt-dialog-body">
        <div class="preview-wrap" ref="preview" @mousemove="getDiffLinePosition">
          <div class="mask"></div>
          <div class="diff-line-wrap" :style="diffLineStyle">
            <div class="point"></div>
            <div class="line"></div>
            <div class="label">
              <div class="col">原始效果</div>
              <div class="col">预览效果</div>
            </div>
          </div>
          <div class="intro">

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
          <cpt-button label="最佳性能" secondary small></cpt-button>
          <cpt-button label="推荐设置" icon="optimization-thin" primary small></cpt-button>
          <cpt-button label="最佳画质" secondary small></cpt-button>
        </div>
      </div>
      <!-- <mu-flat-button slot="actions" @click="closeOptDialog" primary label="取消"/> -->
      <!-- <mu-flat-button slot="actions" primary @click="closeOptDialog" label="确定"/> -->
    </cpt-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'

export default {
  name: "cpt-video-item",
  components: {
    'cpt-dialog': dialog
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
      diffLineWidth: 50
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
      maxjia.store.games.optimizeGame(gameId)
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
    background-color: fade(@textColor, 10%);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
    &:hover {
      .layer {
        opacity: 1;
      }
    }
    .layer {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      .common-transition;
      transition-property: opacity;
      .cpt-button {
        margin: 0 6px;
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
</style>