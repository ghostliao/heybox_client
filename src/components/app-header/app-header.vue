<template>
  <div class="app-header">
    <div class="app-header-wrap">
      <div class="logo-wrap">
        <div class="logo" ref="mainMenuButton" @click="mainMenuToggle"></div>
        <cpt-popover :trigger="mainMenuTrigger" popoverClass="left" :open="mainMenuOpen" @close="mainMenuHandleClose">
          <cpt-menu width="200" :autoWidth="menuAutoWidth">
            <cpt-menu-item title="设置" @click="mainGoToPage({ name: 'settings'})" />
            <cpt-menu-item title="打开Dock浮窗" @click="showDock" />
            <!-- <cpt-menu-item title="关于小黑盒" /> -->
            <cpt-divider shallow-inset light />
            <cpt-menu-item title="退出" @click="quit" />
          </cpt-menu>
        </cpt-popover>
      </div>

      <div class="navigation">
        <div class="tab-btn">
          <cpt-icon-button icon="previous-thin" :iconSize="20" @click="$router.go(-1)"></cpt-icon-button>
        </div>
        <div class="tab-btn">
          <cpt-icon-button icon="reload-thin" :iconSize="20" @click="routeReload"></cpt-icon-button>
        </div>
        <div class="tabs-wrap">
          <ul class="tabs">
            <router-link v-for="(i, index) in navTabs" :to="{ name: i.name }" tag="li" :key="i.name">
              <span :ref="`tab${index}`">{{i.label}}</span>
            </router-link>
            <span class="tab-link-highlight" ref="highlight"></span>
          </ul>
        </div>
        <div class="account">
          <div class="avatar" ref="accountMenuButton" @click="accountMenuToggle">
            <img src="../../assets/avatar.jpeg" alt="">
          </div>
          <cpt-popover :trigger="accountMenuTrigger" :popoverClass="[ 'right', 'mt' ]" :open="accountMenuOpen" @close="accountMenuHandleClose" :anchorOrigin="accountMenuAnchorOrigin" :targetOrigin="accountMenuTargetOrigin">
            <cpt-menu width="200" :autoWidth="menuAutoWidth">
              <cpt-menu-item title="个人设置" @click="accountGoToPage({ name: 'settings-account'})" />
              <cpt-divider shallow-inset light />
              <cpt-menu-item title="切换用户" @click="switchUser" />
            </cpt-menu>
          </cpt-popover>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import cptPopover from '@/components/popover'
import {menu, menuItem} from '@/components/menu'
import cptDivider from '@/components/divider'

export default {
  name: "cpt-app-header",
  components: {
    'cpt-popover': cptPopover,
    'cpt-menu': menu,
    'cpt-menu-item': menuItem,
    'cpt-divider': cptDivider
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      menuAutoWidth: false,
      mainMenuOpen: false,
      mainMenuTrigger: null,
      accountMenuOpen: false,
      accountMenuTrigger: null,
      accountMenuAnchorOrigin: {
        "vertical": "bottom",
        "horizontal": "right"
      },
      accountMenuTargetOrigin: {
        "vertical": "top",
        "horizontal": "right"
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
    getActiveIndex () {
      let activeIndex = -4
      this.navTabs.forEach((tab, i) => {
        const pathName = this.$route.path.split('/')[1]
        if (tab.name === pathName) {
          activeIndex = i
          return false
        }
      })
      return activeIndex
    },
    setTabLightStyle () {
      // console.log('set tab:' + this.getActiveIndex())
      // console.log(this.$refs.tab2)
      
      // const x = this.getActiveIndex() * 100
      // const len = this.navTabs.length
      const index = this.getActiveIndex()
      const el = this.$refs.highlight
      if (index === -4) {
        el.style.left = '-100px'
        el.style.width = 0
        el.style.opacity = 0
      } else {
        const tab = this.$refs['tab' + index]
        // el.style.width = len > 0 ? (100 / len).toFixed(4) + '%' : '100%'
        // el.style.transform = 'translate3d(' + x + '%, 0, 0)'
        el.style.left = tab[0].offsetParent.offsetLeft + tab[0].offsetLeft + 'px'
        el.style.width = tab[0].clientWidth + 'px'
        el.style.opacity = 1        
      }
      
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
    }
  },
  mounted () {
    this.mainMenuTrigger = this.$refs.mainMenuButton
    this.accountMenuTrigger = this.$refs.accountMenuButton

    this.setTabLightStyle()
    this.$router.afterEach(route => {
      this.setTabLightStyle()
    })
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
    height: 56px;
    color: fade(@textColor, 60%);
    border-bottom: 1px solid @layoutBorderColor;
    // background-color: #7e57c2;
    .logo-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 136px;
      .logo {
        width: 36px;
        height: 36px;
        background: url(../../assets/heybox_logo.png) no-repeat center;
        background-size: 136px 112px;
        background-position: center -10px;
        cursor: pointer;
        &:hover {
          background-position: center -66px;
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
            cursor: pointer;
            .common-transition;
            &.active {
              color: @textColor;
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
}
</style>