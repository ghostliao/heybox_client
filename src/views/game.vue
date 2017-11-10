<template>
  <div class="view-game">
    <div class="toolbar">
      <div class="wrap">
        <cpt-block-button :text="'亚洲服务器'" ref="acceleratorMenuButton" @click="acceleratorMenuToggle">
          <div slot="icon" class="icon">
            <img src="max-file:\C:\Users\max\AppData\Local\Qingfeng\Heybox\game\icon\10400000.png" alt="">
          </div>
        </cpt-block-button>
        <cpt-popover :trigger="acceleratorMenuTrigger" :popoverClass="[ 'left', 'main-popover' ]" :open="acceleratorMenuOpen" @close="acceleratorMenuClose">
          <cpt-menu width="160" :autoWidth="menuAutoWidth">
            <cpt-menu-item v-for="(i, index) in 3" :key="index" title="Steam" leftIcon="img" rightIcon="arrow-right">
              <img slot="leftIcon" src="max-file:\C:\Users\max\AppData\Local\Qingfeng\Heybox\game\icon\10400000.png" alt="">
              <cpt-menu-item title="AS亚洲" />
              <cpt-menu-item title="NA北美" />
              <cpt-menu-item title="EU欧洲" />
              <cpt-menu-item title="KR/JR日韩" />
            </cpt-menu-item>
          </cpt-menu>
        </cpt-popover>

        <cpt-block-button icon="accelerator-fill" text="一键加速"></cpt-block-button>

      </div>
    </div>
    <div class="title-bar">
      <div class="title">游戏库</div>
      <!-- <cpt-button icon="add-fill" label="添加游戏" secondary small @click="manuallySelectGameDir"></cpt-button> -->
    </div>
    <div class="games-list">
      <!-- <div class="add-game">
        <div class="game-item add-game" @click="manuallySelectGameDir">
          <div class="layer add-game">
            <cpt-icon value="add-thin" :size="42"></cpt-icon>
            <span>添加游戏</span>
          </div>
        </div>
      </div> -->
      <cpt-game-item v-for="i in installedGames" :data="i" :key="i.gameId"></cpt-game-item>
      
    </div>
    
  </div>
</template>
<script>
import cptBlockButton from '@/components/blockButton'
import cptPopover from '@/components/popover'
import {menu, menuItem} from '@/components/menu'
import { mapActions } from 'vuex'
import cptGameItem from '@/components/game-item'
import readFile from '@/components/readFile'

export default {
  name: "view-game",
  mixins: [readFile],
  components: {
    'cpt-block-button': cptBlockButton,
    'cpt-popover': cptPopover,
    'cpt-menu': menu,
    'cpt-menu-item': menuItem,
    'cpt-game-item': cptGameItem
  },
  data () {
    return {
      menuAutoWidth: false,
      acceleratorMenuOpen: false,
      acceleratorMenuTrigger: null,
      installedGames: [],
      gameIds: ''
    }
  },
  computed: {
     
  },
  methods: {
    acceleratorMenuToggle () {
      this.acceleratorMenuOpen = !this.acceleratorMenuOpen
    },
    acceleratorMenuClose (e) {
      this.acceleratorMenuOpen = false
    },
    ...mapActions([
      'openMsgDialog'
    ]),
    initConnect () {
      maxjia.store.games.gameInstallInfoAdded.addListener((data) => {
        this.onGameInstallInfoAdded(data)
      })
      // maxjia.store.games.optimizeConfigInfoChanged.addListener(data => {
      //   this.getInstalledGames()
      // })
    },
    onGameInstallInfoAdded (data) {
      this.installedGames.unshift(data);
    },
    getInstalledGames () {
      return new Promise((resolve, reject) => {
        maxjia.store.games.getAllGameInstallInfo((data) => {
          console.log(data)
          this.installedGames = data["installedGames"]
          // 构造游戏ID列表参数
          let array = []
          for (let i = 0, len = data.installedGames.length; i < len; i++) {
            const item = data.installedGames[i]
            array.push(item.gameId)
          }
          this.gameIds = array.join('_')
          this.getGamesHeaderImage()
          resolve()
        })
      })
    },
    getGamesHeaderImage () {
      const url = '/tools/games/pc/games/header'
      const options = {
        params: {
          game_ids: this.gameIds
        }
      }
      this.$ajax(url, options).then(res => {
        const data = res.data.result
        for (let i in data) {
          for (let j = 0, len = this.installedGames.length; j < len; j++) {
            const item = this.installedGames[j]
            if (Number(i) === Number(item.gameId)) {
              this.$set(item, 'gameHeaderImage', data[i])
            }
          }
        }
      })
    },
    manuallySelectGameDirByGameId (gameId) {
      maxjia.store.games.manuallySelectGameDirByGameId(gameId)
    },
    manuallySelectGameDir () {
      // console.log('select dir')
      maxjia.store.games.guessSelectGameDir(res => {
        // console.log(res)
        this.$store.state.msgDialogOptions.markType = 'loading'
        this.$store.state.msgDialogOptions.msg = '目录扫描中'
        this.$store.state.msgDialog = true

        if (res.result === 'canceled') {
          this.$store.state.msgDialog = false
        } else if (res.result === 'selected') {
          // this.$store.state.msgDialogOptions.msg = '目录扫描中'
        } else if (res.result === 'scanned') {
          if (res.found) {
            this.$store.state.msgDialogOptions.markType = 'success'
            this.$store.state.msgDialogOptions.msg = '添加成功'
          } else {
            this.$store.state.msgDialogOptions.markType = 'fail'
            this.$store.state.msgDialogOptions.msg = '未找到游戏'
          }
        }
      })
    },
    getGamesInfoList (ids) {
      const url = '/tools/games/pc/games/optimize'
      const options = {
        params: {
          game_ids: ids
        }
      }
      this.$ajax(url, options).then(res => {
        if (res.data.status === 'ok') {
          // console.log(res.data.result)
          const data = res.data.result
          // 检查游戏配置文件
          for (let i = 0, len = this.installedGames.length; i < len; i++) {
            let item = this.installedGames[i]
            const ver = data[item.gameId].file_version
            if (ver > 0) {
              const localGameInfo = JSON.parse(localStorage.getItem(item.gameId)) // 读本地游戏配置文件
              if (!localGameInfo || ver !== localGameInfo.ver) {
                // 缓存游戏配置文件
                console.log('发现配置文件版本更新')
                const url = data[item.gameId].url
                this.$ajax(url).then(res => {
                  console.log(res)

                  let newGameInfo = {
                    ver: ver,
                    content: res.data
                  }

                  localStorage.setItem(item.gameId, JSON.stringify(newGameInfo))
                  this.updateGameInfo(item, newGameInfo.content)
                })
              } else {
                this.updateGameInfo(item, localGameInfo.content)
              }
              this.$set(item, 'supportOptimize', true) // 放出优化按钮
              // item.supportOptimize = true 
            }
          }
        } else {
          this.openMsgDialog({
            msg: '更新游戏信息失败',
            markType: 'fail'
          })
        }
      })
    },
    // 通过配置文件更新游戏优化选项
    updateGameInfo (item, content) {
      // item -> 传递的数据对象
      // content -> xml string
      const d = this.parseXML(content)
      const optimize = d.getElementsByTagName('Optimize')
      let supportLevels = []
      for (let i = 0, len = optimize.length; i < len; i++) {
        const optTag = optimize[i]
        let obj = {
          configLevel: optTag.getAttribute('Level'),
          levelName: optTag.getAttribute('LevelName'),
          levelDesc: optTag.getAttribute('LevelDesc'),
          originalImage: optTag.getAttribute('OriginalImage'),
          image: optTag.getAttribute('Image')
        }
        supportLevels.push(obj)
      }
      maxjia.maxapi.getAllSpecialFolderLocation(data => {
        const file = optimize[0].getElementsByTagName('File')[0]
        const dirKey = file.getAttribute('DirKey')
        const filePath = file.getAttribute('FilePath')
        const path = data[dirKey] + '/' + filePath
        this.$set(item, 'enginePath', path)
      })
      maxjia.maxapi.getAllSpecialFolderLocation(data => {
        const file = optimize[0].getElementsByTagName('File')[1]
        const dirKey = file.getAttribute('DirKey')
        const filePath = file.getAttribute('FilePath')
        const path = data[dirKey] + '/' + filePath
        this.$set(item, 'gameUserSettingsPath', path)
      })
      this.$set(item, 'recommandConfigLevel', '1')
      this.$set(item, 'supportLevels', supportLevels)
    }
  },
  created () {
    this.initConnect()
    this.getInstalledGames().then(() => {
      this.getGamesInfoList(this.gameIds)
    })
  },
  mounted () {
    this.acceleratorMenuTrigger = this.$refs.acceleratorMenuButton.$el
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-game {
  padding: 24px 40px;
  .toolbar {
    margin-bottom: 16px;
    > .wrap {
      display: flex;
    }
  }
  .title-bar {
    display: flex;
    align-items: center;
    height: 54px;
    .title {
      font-size: 18px;
      margin-right: 16px;
    }
  }
  .games-list {
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    // > .add-game {
    //   width: 25%;
    //   padding: 0 20px 20px 0;
    //   .common-transition;
    //   @media (max-width: 900px) {
    //     width: 50%;
    //   }
    //   @media (max-width: 1200px) {
    //     width: 33.333333%;
    //   }
    //   .game-item {
    //     position: relative;
    //     padding-top: 50%;
    //     border-radius: 2px;
    //     background-color: fade(@textColor, 10%);
    //     box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
    //     &:hover {
    //       background-color: fade(@textColor, 20%);
    //     }
    //     &.active {
    //       background-color: fade(@textColor, 10%);
    //     }
    //     .layer {
    //       position: absolute;
    //       z-index: 1;
    //       top: 0;
    //       left: 0;
    //       right: 0;
    //       bottom: 0;
    //       display: flex;
    //       flex-direction: column;
    //       justify-content: center;
    //       align-items: center;
    //       opacity: 1;
    //       color: fade(@textColor, 20%);
    //       cursor: pointer;
    //       &:hover {
    //         color: fade(@textColor, 60%);
    //       }
    //       &:active {
    //         color: fade(@textColor, 20%);
    //       }
    //       span {
    //         font-size: 12px;
    //         line-height: 1;
    //         margin-top: 8px;
    //       }
    //     }
    //   }
    // }
  }
}


</style>