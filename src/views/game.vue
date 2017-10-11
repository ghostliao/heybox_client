<template>
  <div class="view-game">
    <!-- <div>{{installedGames}}</div> -->
    <div class="games-list">
      <div class="add-game">
        <div class="game-item add-game" @click="manuallySelectGameDirByGameId(400000)">
          <div class="layer add-game">
            <cpt-icon value="add-thin" :size="42"></cpt-icon>
            <span>添加游戏</span>
          </div>
        </div>
      </div>
      <cpt-game-item v-for="i in installedGames" :data="i" :key="i.gameId"></cpt-game-item>
      
    </div>
    
  </div>
</template>
<script>
import cptGameItem from '@/components/game-item'

export default {
  name: "view-game",
  components: {
    'cpt-game-item': cptGameItem
  },
  data () {
    return {
      installedGames: [{}]
    }
  },
  computed: {
     
  },
  methods: {
    initConnect () {
      maxjia.store.games.gameInstallInfoAdded.addListener((data) => {
        this.onGameInstallInfoAdded(data)
      })
    },
    onGameInstallInfoAdded (data) {
      this.installedGames.unshift(data);
    },
    getInstalledGames () {
      maxjia.store.games.getAllGameInstallInfo((data) => {
        this.installedGames = data["installedGames"]
      })
    },
    manuallySelectGameDirByGameId (gameId) {
      maxjia.store.games.manuallySelectGameDirByGameId(gameId)
    },
    manuallySelectGameDir () {
      
    }
  },
  created () {
    this.initConnect()
    this.getInstalledGames()
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-game {
  padding: 16px 64px;
  .games-list {
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    > .add-game {
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
          background-color: fade(@textColor, 20%);
        }
        &.active {
          background-color: fade(@textColor, 10%);
        }
        .layer {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
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
    }
  }
}

.opt-dialog-body {
  .preview-wrap {
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
    .intro {
      position: absolute;
      z-index: 30;
      left: 16px;
      bottom: 16px;
      width: 344px;
      height: 160px;
      border-radius: 2px;
      background-color: rgba(0, 0, 0, 0.6);
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
    }
  }
}
</style>