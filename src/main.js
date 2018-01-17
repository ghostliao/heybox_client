// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/vuex/store'
import './assets/fonts/iconfont.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VueVideoPlayer)
import VueLazyload from 'vue-lazyload'
//Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1,
  error: '',
  loading: '',
  attempt: 1
})

import axios from 'axios'
axios.defaults.timeout = 10000
axios.defaults.baseURL = (store.state.config.env === 'test')
  ? 'http://heybox.test.maxjia.com:58888'
  : 'https://api.xiaoheihe.cn'
axios.defaults.withCredentials = true
import qs from 'qs'
Vue.prototype.$ajax = axios
Vue.prototype.qs = qs

import button from '@/components/button'
import checkbox from '@/components/checkbox'
import circularProgress from '@/components/circularProgress'
import dialog from '@/components/dialog'
import icon from '@/components/icon'
import iconButton from '@/components/iconButton'
import lazy from '@/components/lazy'
import linearProgress from '@/components/linearProgress'
import mark from '@/components/mark'
import msgDialog from '@/components/msg-dialog'
import selectField from '@/components/select-field'
import slider from '@/components/slider'
import * as table from '@/components/table'
import tooltip from '@/components/tooltip'
const components = {
  button,
  checkbox,
  circularProgress,
  dialog,
  icon,
  iconButton,
  lazy,
  linearProgress,
  mark,
  msgDialog,
  selectField,
  slider,
  ...table,
  tooltip
}
Object.keys(components).forEach((key) => {
  Vue.component(components[key].name, components[key])
})

Vue.config.productionTip = false

Vue.prototype.getParameterByName = function (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// 记录子tab选项
Vue.prototype.saveRouter = function (name) {
  const viewType = name.split('-')[0]
  if (viewType === 'settings') {
    store.state.routerSettingsName = name
  } else if (viewType === 'video') {
    store.state.routerVideoName = name
  } else if (viewType === 'hardware') {
    store.state.routerHardwareName = name
  } else if (viewType === 'wallpaper') {
    store.state.routerWallpaperName = name
  }
}

Vue.filter('fileSize', (t) => (t / 1024 /1024).toFixed(1) + 'M')
Vue.filter('fileName', (t) => {
  const array = decodeURIComponent(t).split('/')
  const fileName = array[array.length - 1]
  return fileName
})
Vue.filter('duration', (t) => {
  t = parseInt(t)
  let timeStr, mid, h = 0, m = 0, s = 0
  if (t >= 3600) {
    h = parseInt(t / 3600)
    t -= h * 3600

    m = parseInt(t / 60)
    t -= m * 60

    s = t
  } else if (t >= 60) {
    m = parseInt(t / 60)
    t -= m * 60
    
    s = t
  } else {
    s = t
  }

  h = h < 10 ? `0${h}` : h
  m = m < 10 ? `0${m}` : m
  s = s < 10 ? `0${s}` : s

  timeStr = `${h}:${m}:${s}`
  return timeStr
})
Vue.prototype.filterDuration = function (t) {
  let timeStr, mid, h = 0, m = 0, s = 0
  if (t >= 3600) {
    h = parseInt(t / 3600)
    t -= h * 3600

    m = parseInt(t / 60)
    t -= m * 60

    s = t
  } else if (t >= 60) {
    m = parseInt(t / 60)
    t -= m * 60
    
    s = t
  } else {
    s = t
  }

  h = h < 10 ? `0${h}` : h
  m = m < 10 ? `0${m}` : m
  s = s < 10 ? `0${s}` : s

  timeStr = `${h}:${m}:${s}`
  return timeStr
}
Vue.filter('formDate', function (t, type = 1) {
  // filter type
  // 1 日期带时分
  // 2 距离现在过去多久
  // 3 24小时显示内距离现在过去多久，24小时以上显示日期不带时分秒
  // 4 年月日
  // 5 年月日，当天日期显示“今天”

  const timeSpan = t * 1000
  const dateTime = new Date(parseInt(timeSpan))

  const year = dateTime.getFullYear()
  const month = dateTime.getMonth() + 1
  const day = dateTime.getDate()
  const hour = dateTime.getHours()
  let minute = dateTime.getMinutes()
  minute < 10 && (minute = '0' + minute)
  // let second = dateTime.getSeconds()

  if (type === 1) {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  } else if (type === 4) {
    return year + '-' + month + '-' + day
  } else if (type === 5) {
    const _d = new Date()
    const _year = _d.getFullYear()
    const _month = _d.getMonth() + 1
    const _day = _d.getDate()
    if (year === _year && month === _month && day === _day) {
      return '今天'
    } else {
      return year + '-' + month + '-' + day
    }
  } else {
    const now = new Date()
    const nowNew = Date.parse(now)

    const ms = nowNew - timeSpan
    let timeSpanStr

    if (ms <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚'
    } else if (1000 * 60 * 1 < ms && ms <= 1000 * 60 * 60) {
      timeSpanStr = Math.round((ms / (1000 * 60))) + '分钟前'
    } else if (1000 * 60 * 60 * 1 < ms && ms <= 1000 * 60 * 60 * 24) {
      timeSpanStr = Math.round(ms / (1000 * 60 * 60)) + '小时前'
    } else {
      if (type === 2) {
        if (1000 * 60 * 60 * 24 < ms && ms <= 1000 * 60 * 60 * 24 * 30) {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24)) + '天前'
        } else if (1000 * 60 * 60 * 24 * 30 < ms && ms <= 1000 * 60 * 60 * 24 * 365) {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24 * 30)) + '月前'
        } else {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24 * 365)) + '年前'
        }
      } else if (type === 3) {
        timeSpanStr = year + '-' + month + '-' + day
      }
    }
    return timeSpanStr
  }
})
Vue.prototype.filterFormDate = function (t, type = 1) {
  // filter type
  // 1 日期带时分
  // 2 距离现在过去多久
  // 3 24小时显示内距离现在过去多久，24小时以上显示日期不带时分秒
  // 4 年月日
  // 5 年月日，当天日期显示“今天”
  // 6 月日
  // 7 时分秒

  const timeSpan = t * 1000
  const dateTime = new Date(parseInt(timeSpan))

  const year = dateTime.getFullYear()
  const month = dateTime.getMonth() + 1
  const day = dateTime.getDate()
  const hour = dateTime.getHours()
  let minute = dateTime.getMinutes()
  minute < 10 && (minute = '0' + minute)
  let second = dateTime.getSeconds()
  second < 10 && (second = '0' + second)

  if (type === 1) {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  } else if (type === 6) {
    return month + '月' + day + '日'
  } else if (type === 7) {
    return hour + ':' + minute + ':' + second
  } else if (type === 4) {
    return year + '-' + month + '-' + day
  } else if (type === 5) {
    const _d = new Date()
    const _year = _d.getFullYear()
    const _month = _d.getMonth() + 1
    const _day = _d.getDate()
    if (year === _year && month === _month && day === _day) {
      return '今天'
    } else {
      return year + '-' + month + '-' + day
    }
  } else {
    const now = new Date()
    const nowNew = Date.parse(now)

    const ms = nowNew - timeSpan
    let timeSpanStr

    if (ms <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚'
    } else if (1000 * 60 * 1 < ms && ms <= 1000 * 60 * 60) {
      timeSpanStr = Math.round((ms / (1000 * 60))) + '分钟前'
    } else if (1000 * 60 * 60 * 1 < ms && ms <= 1000 * 60 * 60 * 24) {
      timeSpanStr = Math.round(ms / (1000 * 60 * 60)) + '小时前'
    } else {
      if (type === 2) {
        if (1000 * 60 * 60 * 24 < ms && ms <= 1000 * 60 * 60 * 24 * 30) {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24)) + '天前'
        } else if (1000 * 60 * 60 * 24 * 30 < ms && ms <= 1000 * 60 * 60 * 24 * 365) {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24 * 30)) + '月前'
        } else {
          timeSpanStr = Math.round(ms / (1000 * 60 * 60 * 24 * 365)) + '年前'
        }
      } else if (type === 3) {
        timeSpanStr = year + '-' + month + '-' + day
      }
    }
    return timeSpanStr
  }
}
Vue.prototype.compareVersion = function (currentVersion, refVersion) {
  function calc(str) {
    const a = str.split('.')
    const v = a[0] * 10000 + a[1] * 100 + a[2] * 1
    return v
  }
  return calc(currentVersion) >= calc(refVersion)
}
// 用户行为上报
Vue.prototype.__REPORT = function (reportKey) {
  // console.log(reportKey)
  const data = store.state.REPORTDATA
  if (data[reportKey]) {
    data[reportKey] += 1
  } else {
    data[reportKey] = 1
  }
  store.state.reportDataUpdate = true
}

// router.beforeEach((to, from, next) => { 
//   clearInterval(window.hardwarePerfInfoTimer)
//   clearInterval(window.hardwareHeatbeatTimer)
//   console.log(`clear interval`)
//   next()
// })

/* eslint-disable no-new */
window.v = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

