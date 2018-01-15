import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import mid from '@/views/mid'
import viewGame from '@/views/game'
import viewVideo from '@/views/video'
import viewVideoLocal from '@/views/video/local'
import viewVideoCloud from '@/views/video/cloud'
import viewVideoScreenshot from '@/views/video/screenshot'
import viewHardware from '@/views/hardware'
import viewHardwareInfo from '@/views/hardware/info'
import viewHardwareStatus from '@/views/hardware/status'
import viewWallpaper from '@/views/wallpaper'
import viewWallpaperStore from '@/views/wallpaper/store'
import viewWallpaperLocal from '@/views/wallpaper/local'
import viewSettings from '@/views/settings'
import viewSettingsAccount from '@/views/settings/account'
import viewSettingsVideo from '@/views/settings/video'
import viewSettingsAccelerator from '@/views/settings/accelerator'
import viewMessage from '@/views/message'

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
          path: 'local',
          name: 'video-local',
          component: viewVideoLocal,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'cloud',
          name: 'video-cloud',
          component: viewVideoCloud,
          meta: {
            keepAlive: true
          },
          // beforeEnter: (to, from, next) => {
          //   store.state.routerVideoName = to.name
          //   next()
          // }
        }
      ],
      redirect: to => {
        let name = store.state.routerVideoName
        if (!name) name = 'video-local'
        return {
          name: name
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
      path: '/wallpaper',
      name: 'wallpaper',
      component: viewWallpaper,
      children: [
        {
          path: 'store',
          name: 'wallpaper-store',
          component: viewWallpaperStore,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'local',
          name: 'wallpaper-local',
          component: viewWallpaperLocal,
          meta: {
            keepAlive: true
          }
        }
      ],
      redirect: to => {
        let name = store.state.routerWallpaperName
        if (!name) name = 'wallpaper-store'
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
        },
        {
          path: 'accelerator',
          name: 'settings-accelerator',
          component: viewSettingsAccelerator,
          meta: {
            keepAlive: true
          }
        }
      ],
      redirect: to => {
        let name = store.state.routerSettingsName
        if (!name) name = 'settings-video'
        return {
          name: name
        }
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/message',
      name: 'message',
      component: viewMessage,
      meta: {
        keepAlive: true
      }
    }
  ]
})
