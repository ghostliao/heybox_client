import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as actions from './actions'
import mutations from './mutations'

const v = Vue.prototype

const state = {
  config: {
    ver: 'Alpha 1.0.2',
    env: 'test', // test | prod
    dev: true
  },
  origin: {
    test: 'http://heybox.test.maxjia.com:58888',
    prod: 'https://api.xiaoheihe.cn'
  },

  mainWindowId: -1, // 主窗体id
  routerName: 'game',
  routerVideoName: '',
  routerSettingsName: '',
  routerHardwareName: '',
  routerWallpaperName: '',
  recordingState: 'RS_Stop',
  recordingSeconds: 0,
  videoPlayer: false,
  // videojs options
  videoPlayerOptions: {
    muted: false,
    language: 'en',
    playbackRates: [0.5, 1.0, 2.0, 4.0],
    sources: [{
      type: "video/mp4",
      src: ""
      // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
    }],
    // poster: "/static/images/author.jpg",
  },
  imageChecker: false,
  imageCheckerOptions: {
    src: ''
  },
  msgDialog: false,
  msgDialogOptions: {
    markType: 'success',
    msg: 'msg'
  },
  hotkeys: {
    
  },
  hotkeysModifiers: [],
  xmlDoc: {},
  accountInfo: {
    uid: 999999,
    userName: '匿名',
    avatarUrl: '../../assets/default_avatar.png'
  },
  newMessage: false,
  mediaListShowType: 'list',
  REPORTDATA: {},
  reportDataUpdate: false,
  wallpaperFilter: [] // 壁纸过滤器数据
}

const getters = {
  
}

// const mutations = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
