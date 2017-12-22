<template>
  <div class="app-header">
    <div class="app-header-wrap">
      <div class="logo-wrap">
        <div class="logo" ref="mainMenuButton" @click="mainMenuToggle"></div>
        <cpt-popover :trigger="mainMenuTrigger" :popoverClass="[ 'left', 'main-popover' ]" :open="mainMenuOpen" @close="mainMenuHandleClose">
          <cpt-menu width="160" :autoWidth="menuAutoWidth">
            <div class="menu-account-wrap">
              <div class="col col-1">
                <img :src="$store.state.accountInfo.avatarUrl" alt="">
              </div>
              <div class="col col-2">
                <div class="name">{{$store.state.accountInfo.userName}}</div>
                <div class="id">ID: {{$store.state.accountInfo.uid}}</div>
              </div>
            </div>
            <cpt-divider light />
            <cpt-menu-item title="设置" @click="mainGoToPage({ name: 'settings'})" />
            <cpt-menu-item title="召唤浮窗" @click="showDock" />
            <!-- <cpt-menu-item title="关于小黑盒" /> -->
            <cpt-divider light />
            <cpt-menu-item title="切换用户" @click="switchUser" />
            <cpt-menu-item title="退出" @click="quit" />
          </cpt-menu>
        </cpt-popover>
      </div>

      <div class="navigation">
        <div class="tabs-wrap">
          <ul class="tabs">
            <router-link v-for="(i, index) in navTabs" :to="{ name: i.name }" tag="li" :key="i.name">
              <span :ref="`tab${index}`">{{i.label}}</span>
            </router-link>
            <span class="tab-link-highlight" ref="highlight"></span>
          </ul>
          <div class="drag" ref="drag"></div>
        </div>

        <div class="tab-btn">
          <div class="tab-btn-wrap">
            <div class="notify" v-show="$store.state.newMessage"></div>
            <cpt-icon-button icon="message-fill" :iconSize="20" @click="pageToMessage"></cpt-icon-button>
          </div>
        </div>
        <template v-if="$store.state.config.env === 'test'">
          <!-- <div class="tab-btn">
            <cpt-icon-button icon="previous-thin" :iconSize="20" @click="$router.go(-1)"></cpt-icon-button>
          </div> -->
          <div class="tab-btn" v-if="$store.state.config.dev">
            <cpt-icon-button icon="reload-thin" :iconSize="20" @click="routeReload"></cpt-icon-button>
          </div>
          <!-- <div class="tab-btn">
            <cpt-icon-button icon="fullscreen-thin" :iconSize="20" @click="fullscreen"></cpt-icon-button>
          </div> -->
        </template>
        <!-- <div class="account">
          <div class="avatar" ref="accountMenuButton" @click="accountMenuToggle">
            <img :src="$store.state.accountInfo.avatarUrl" alt="">
          </div>
          <cpt-popover :trigger="accountMenuTrigger" :popoverClass="[ 'right', 'account-popover' ]" :open="accountMenuOpen" @close="accountMenuHandleClose" :anchorOrigin="accountMenuAnchorOrigin" :targetOrigin="accountMenuTargetOrigin">
            <cpt-menu width="160" :autoWidth="menuAutoWidth">
              <div class="menu-account-wrap">
                <div class="col col-1">
                  <img :src="$store.state.accountInfo.avatarUrl" alt="">
                </div>
                <div class="col col-2">
                  <div class="name">{{$store.state.accountInfo.userName}}</div>
                  <div class="id">ID: {{$store.state.accountInfo.uid}}</div>
                </div>
              </div>
              <cpt-menu-item title="个人设置" @click="accountGoToPage({ name: 'settings-account'})" />
              <cpt-divider shallow-inset light />
              <cpt-menu-item title="切换用户" @click="switchUser" />
            </cpt-menu>
          </cpt-popover>
        </div> -->
      </div>

    </div>
    <!-- <div class="progress">
      <cpt-linear-progress></cpt-linear-progress>
    </div> -->
  </div>
  
</template>

<script>
import cptPopover from '@/components/popover'
import {menu, menuItem} from '@/components/menu'
import cptDivider from '@/components/divider'
import cptLinearProgress from '@/components/linearProgress'
import tabHighlight from '@/components/tab-highlight'

export default {
  name: "cpt-app-header",
  mixins: [tabHighlight],
  components: {
    'cpt-popover': cptPopover,
    'cpt-menu': menu,
    'cpt-menu-item': menuItem,
    'cpt-divider': cptDivider,
    'cpt-linear-progress': cptLinearProgress
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      routeDepth: 1,
      menuAutoWidth: false,
      mainMenuOpen: false,
      mainMenuTrigger: null,
      accountMenuOpen: false,
      accountMenuTrigger: null,
      accountMenuAnchorOrigin: {
        "vertical": "bottom",
        "horizontal": "center"
      },
      accountMenuTargetOrigin: {
        "vertical": "top",
        "horizontal": "center"
      },
      navTabs: [
        {
          name: 'game',
          label: '游戏'
        },
        {
          name: 'video',
          label: '视频'
        },
        {
          name: 'hardware',
          label: '我的设备'
        }
      ]
    }
  },
  methods: {
    mainMenuToggle () {
      this.mainMenuOpen = !this.mainMenuOpen
    },
    mainMenuHandleClose (e) {
      this.mainMenuOpen = false
    },
    mainGoToPage (obj) {
      this.$router.push(obj)
      this.mainMenuToggle()
    },
    accountMenuToggle () {
      this.accountMenuOpen = !this.accountMenuOpen
    },
    accountMenuHandleClose (e) {
      this.accountMenuOpen = false
    },
    accountGoToPage (obj) {
      this.$router.push(obj)
      if (obj.name === 'settings-account') {
        this.$store.state.routerSettingsName = obj.name
      }
      this.accountMenuToggle()
    },
    routeReload () {
      this.$router.go(0)
      // this.$router.replace({
      //   path: '_empty'
      // })
      // this.$router.replace({
      //   name: this.$route.name
      // })
    },
    fullscreen () {
      console.log('fullscreen')
      document.documentElement.webkitRequestFullScreen()
    },
    showDock () {
      maxjia.store.showDock()
      this.mainMenuToggle()
    },
    quit () {
      maxjia.store.quit()
      this.mainMenuToggle()      
    },
    switchUser () {
      maxjia.store.switchUser()
      this.accountMenuToggle()
    },
    getAccountInfo () {
      return new Promise((resolve, reject) => {
        maxjia.user.getCurrentUser(data => {
          // console.log(data)
          data.avatarUrl && (this.$store.state.accountInfo.avatarUrl = data.avatarUrl)
          data.uid && (this.$store.state.accountInfo.uid = data.uid)
          data.userName && (this.$store.state.accountInfo.userName = data.userName)
          resolve()
        })
      })
    },
    getCurrentWindow () {
      return new Promise((resolve, reject) => {
        maxjia.windows.getCurrentWindow(data => {
          resolve(data.id)
        })
      })
    },
    dragWindow (id) {
      const el = this.$refs.drag
      el.onmousedown = function (e) {
        el.onmousemove = function (ev) {
          maxjia.windows.dragWindow(id)
        }
      }
    },
    pageToMessage () {
      this.$router.push({ name: 'message'})
      this.$store.state.newMessage = false
    }
  },
  created () {
    this.getAccountInfo().then(() => {})
    if (this.compareVersion(maxjia.maxapi.version, '0.1.16')) {
      this.navTabs.push({
        name: 'wallpaper',
        label: '动态桌面'
      })
    }
  },
  mounted () {
    this.getCurrentWindow().then(id => {
      this.dragWindow(id)
    })
    this.mainMenuTrigger = this.$refs.mainMenuButton
    this.accountMenuTrigger = this.$refs.accountMenuButton
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";
.app-header {
  position: fixed;
  z-index: @navigation;
  top: 0;
  left: 0;
  right: 0;
  .app-header-wrap {
    display: flex;
    height: @navHeight + 1px;
    color: fade(@textColor, 60%);
    border-bottom: 1px solid @layoutBorderColor;
    // background-color: #7e57c2;
    .logo-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 152px;
      margin-right: -16px;
      // .logo {
      //   width: 36px;
      //   height: 36px;
      //   background: url(../../assets/heybox_logo.png) no-repeat center;
      //   background-size: 136px 112px;
      //   background-position: center -10px;
      //   cursor: pointer;
      //   &:hover {
      //     background-position: center -66px;
      //   }
      // }
      .logo {
        width: 88px;
        height: 36px;
        background: url(../../assets/heybox_logo_2.png) no-repeat center;
        background-size: 160px 128px;
        background-position: center -17px;
        cursor: pointer;
        &:hover {
          background-position: center -81px;
        }
      }
    }
    .navigation {
      display: flex;
      flex: 1;
      min-width: 0;
      padding-right: 108px;
      .tab-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        margin-right: 20px;
        .tab-btn-wrap {
          position: relative;
          font-size: 0;
          .notify {
            position: absolute;
            z-index: 1;
            top: 1px;
            right: -2px;
            width: 6px;
            height: 6px;
            background: @dangerColor;
            border-radius: 50%;
          }
        }
      }
      .tabs-wrap {
        position: relative;
        display: flex;
        flex: 1;
        .tabs {
          position: relative;
          display: flex;
          // width: 300px;
          > li {
            // flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 16px;
            color: fade(@textColor, 60%);
            font-size: 16px;
            cursor: pointer;
            .common-transition;
            &:hover {
              color: @textColor;
            }
            &.active {
              color: @textColor;
              text-shadow: 0 0 12px rgba(255, 255, 255, 1);
            }
            span {
              flex: 1;
              display: flex;
              align-items: center;
            }
          }
          .tab-link-highlight {
            position: absolute;
            left: 0;
            bottom: -1px;
            height: 2px;
            background-color: @primaryColor;
            transition: all .3s;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
          }
        }
        .drag {
          flex: 1;
          min-width: 0;
        }
      }
      .account {
        display: flex;
        justify-content: center;
        align-items: center;
        .avatar {
          width: 28px;
          height: 28px;
          border: 1px solid @darkBorderColor;
          border-radius: 50%;
          background-color: @alternateTextColor;
          overflow: hidden;
          cursor: pointer;
          &:hover {
            border-color: @primaryColor;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
  }
}

.menu-account-wrap {
  display: flex;
  height: 52px;
  padding: 12px 12px 8px;
  // background: fade(@fullBlack, 5%);
  margin-top: -4px;
  user-select: text;
  > .col-1 {
    width: 32px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }
  > .col-2 {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    line-height: 1;
    .name {
      font-size: 12px;
      font-weight: 400;
      color: fade(@textColor, 50%);
      margin-bottom: 5px;
    }
    .id {
      font-size: 12px;
      color: fade(@textColor, 20%);
    }
  }
}
</style>