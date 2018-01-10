<template>
  <div class="view-game" ref="scroller">
    <div class="content">
      <div v-if="false" class="toolbar">
        <div class="wrap">
          <cpt-block-button v-show="hostState !== 1" :text="hostBtnText" :buttonClass="hostBtnClass" tooltipLabel="网页版Steam社区无法打开解决方案" @click="addHost">
            <div slot="icon" class="icon">
              <img src="//cdn.max-c.com/@/heybox/imgs/940a59ca62065cec6d86281e9d6d78dc">
            </div>
          </cpt-block-button>
          <cpt-block-button v-show="hostState === 1" text="打开Steam社区" buttonClass="host" @click="openSteamCommunity">
            <div slot="icon" class="icon">
              <img src="//cdn.max-c.com/@/heybox/imgs/940a59ca62065cec6d86281e9d6d78dc">
            </div>
          </cpt-block-button>
          
          <template v-if="$store.state.config.dev">
          <!-- <cpt-block-button text="移除host" @click="removeHost">
            <div slot="icon" class="icon">
              <img src="max-file:\C:\Users\max\AppData\Local\Qingfeng\Heybox\game\icon\10400000.png">
            </div>
          </cpt-block-button> -->
          
          <!-- <cpt-block-button :text="'亚洲服务器'" ref="acceleratorMenuButton" @click="acceleratorMenuToggle">
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
          <cpt-block-button buttonClass="set" icon="set-fill" @click="$router.push({ name: 'settings-accelerator' })"></cpt-block-button> -->
          </template>

        </div>
      </div>
      <div class="title-bar">
        <div class="title">游戏库</div>
        <cpt-button icon="add-fill" label="添加游戏" secondary small @click="selectAddCustomGame"></cpt-button>
      </div>
      <div class="games-list">
        <cpt-game-item v-for="i in installedGames" v-if="!i.removed" :data="i" :key="i.gameId"></cpt-game-item>
      </div>
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
      gameIds: '',
      hostList: [],
      hostState: 3 // 0 -> 未加速 1 -> 已加速 2 -> 加速中 3 -> 检查host更新中
    }
  },
  computed: {
    hostBtnText () {
      if (this.hostState === 0) return '修复Steam社区连接'
      if (this.hostState === 1) return 'Steam社区连接已修复'
      if (this.hostState === 2) return '修复处理中...'
      if (this.hostState === 3) return '正在检查host文件'
    },
    hostBtnClass () {
      if (this.hostState !== 0) {
        return ['disabled', 'host']
      } else {
        return ['host']
      }
    }
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
    // 添加自定义游戏
    selectAddCustomGame () {
      maxjia.store.games.selectAddCustomGame(res => {
        console.log(res)
        // if (res.result === 'canceled') {
        //   this.$store.state.msgDialogOptions.markType = 'fail'
        //   this.$store.state.msgDialogOptions.msg = '未选择游戏'
        //   this.$store.state.msgDialogOptions.desc = ''
        //   this.$store.state.msgDialog = true
        // }
        if (res.result === 'added') {
          if (res.gameId === 0) {
            this.$store.state.msgDialogOptions.markType = 'fail'
            this.$store.state.msgDialogOptions.msg = '添加失败'
            this.$store.state.msgDialogOptions.desc = '请选择.exe格式的文件'
            this.$store.state.msgDialog = true
          } else {
            this.$store.state.msgDialogOptions.markType = 'success'
            this.$store.state.msgDialogOptions.msg = '添加成功'
            this.$store.state.msgDialogOptions.desc = ''
            this.$store.state.msgDialog = true
          }
        }
      })
    },
    getGamesInfoList (ids) {
      const url = '/tools/games/pc/games/optimize'
      const options = {
        params: {
          game_ids: ids,
          heybox_id: this.$store.state.accountInfo.uid
        }
      }
      this.$ajax(url, options).then(res => {
        if (res.data.status === 'ok') {
          // console.log(res.data.result)
          const data = res.data.result
          // 检查游戏配置文件
          for (let i = 0, len = this.installedGames.length; i < len; i++) {
            let item = this.installedGames[i]
            
            // 设置推荐config level
            if (data[item.gameId].recommand_level) {
              this.$set(item, 'recommand_level', data[item.gameId].recommand_level)
            }

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
    },
    addHost () {
      if (this.hostState !== 0) return
      this.__REPORT('fn_add_host')
      for (let i in this.hostList) {
        this.hostState = 2
        let domain = i
        let ip = this.hostList[i]
        maxjia.maxtool.addHostRecord(domain, ip, res => {
          console.log(res)
          if (res.result) {
            // success
            this.hostState = 1
            this.__REPORT('fn_add_host_success')
          } else {
            // fail
            this.hostState = 0
          }
        })
      }
      // const domain = 'steamcommunity.com'
      // const ip = '23.52.74.146'
    },
    getHost () {
      return new Promise((resolve, reject) => {
        const url = '/pc/get_host_map/'
        const options = {
          params: {
            'heybox_id': this.$store.state.accountInfo.uid,
            'os_type': 'pc'
          }
        }
        this.$ajax(url, options).then(res => {
          const map = res.data.result.host
          this.hostList = map
          resolve(map)
        }, res => {
          reject()
        })
      })
    },
    checkHostUpdate () {
      return new Promise((resolve, reject) => {
        this.getHost().then(map => {
          let domain, ip
          for (let i in map) {
            domain = i
            ip = map[i]
            if (domain === 'steamcommunity.com') break
          }
          maxjia.maxtool.getHostRecords(data => {
            for (let i = 0, len = data.records.length; i < len; i++) {
              const record = data.records[i]
              if (record.domain === domain && record.ip === ip) {
                reject()
              }
            }
            resolve()
          })
        })
      })
    },
    removeHost () {
      let domain = 'steamcommunity.com'
      maxjia.maxtool.removeHostRecord(domain, res => {
        console.log(res)
      })
    },
    openSteamCommunity () {
      maxjia.maxapi.openUrlInSystemBrowser('https://steamcommunity.com')
    }
  },
  created () {
    this.initConnect()
    this.getInstalledGames().then(() => {
      this.getGamesInfoList(this.gameIds)
    })
    this.checkHostUpdate().then(res => {
      // 有更新
      console.log('发现host更新')
      this.hostState = 0
    }, res => {
      // 没更新
      this.hostState = 1
    })
  },
  mounted () {
    this.__REPORT('view_game')
    // if (this.$store.state.config.dev) { // dev !!!!!!!!!!!!!!!
    //   this.acceleratorMenuTrigger = this.$refs.acceleratorMenuButton.$el
    // }
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-game {
  .view-scroller;
  > .content {
    padding: 6px 40px 24px;
    .toolbar {
      margin-bottom: 12px;
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
    }
  }
}


</style>