<template>
  <div class="view-game">
    <!-- <div>{{installedGames}}</div> -->
    <div class="games-list">
      <div class="add-game">
        <div class="game-item add-game" @click="manuallySelectGameDir">
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
        // console.log(data)
        this.installedGames = data["installedGames"]
      })
    },
    manuallySelectGameDirByGameId (gameId) {
      maxjia.store.games.manuallySelectGameDirByGameId(gameId)
    },
    manuallySelectGameDir () {
      // console.log('select dir')
      maxjia.store.games.guessSelectGameDir(res => {
        console.log(res)
       
      })
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


</style>