import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import mid from '@/views/mid'
import viewGame from '@/views/game'
import viewVideo from '@/views/video'
import viewVideoDesktop from '@/views/video/desktop'
import viewVideoHighlight from '@/views/video/highlight'
import viewHardware from '@/views/hardware'
import viewHardwareInfo from '@/views/hardware/info'
import viewHardwareStatus from '@/views/hardware/status'
import viewSettings from '@/views/settings'
import viewSettingsAccount from '@/views/settings/account'
import viewSettingsVideo from '@/views/settings/video'

import store from '../vuex/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      redirect: '/game'
    },
    {
      // 刷新跳转介质
      path: '/mid',
      name: 'mid',
      component: mid,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/game',
      name: 'game',
      component: viewGame,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/video',
      name: 'video',
      component: viewVideo,
      children: [
        {
          path: 'desktop',
          name: 'video-desktop',
          component: viewVideoDesktop,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'highlight',
          name: 'video-highlight',
          component: viewVideoHighlight,
          meta: {
            keepAlive: true
          }
        }
      ],
      redirect: to => {
        return {
          name: 'video-desktop'
        }
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/hardware',
      name: 'hardware',
      component: viewHardware,
      children: [
        {
          path: 'info',
          name: 'hardware-info',
          component: viewHardwareInfo,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'status',
          name: 'hardware-status',
          component: viewHardwareStatus,
          meta: {
            keepAlive: false
          }
        }
      ],
      redirect: to => {
        let name = store.state.routerHardwareName
        if (!name) name = 'hardware-info'
        return {
          name: name
        }
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: viewSettings,
      children: [
        {
          path: 'account',
          name: 'settings-account',
          component: viewSettingsAccount,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'video',
          name: 'settings-video',
          component: viewSettingsVideo,
          meta: {
            keepAlive: true
          }
        }
      ],
      redirect: to => {
        let name = store.state.routerSettingsName
        if (!name) name = 'settings-account'
        return {
          name: name
        }
      },
      meta: {
        keepAlive: true
      }
    }
  ]
})
