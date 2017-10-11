import router from '@/router'

export default {
  SET_GAMETYPE (state, gameType) {
    localStorage.setItem('ACTIVEGAME', gameType)
  },
  // S 客户端全局接口
  NAVIGATE_TO_PAGE (state, obj) {
    console.log('navigateToPage:' + obj.page)
    state.routerName = obj.page
    router.push({ name: obj.page })
  },
  PLAY_VIDEO_FILE (state, obj) {
    console.log('playVideoFile:' + obj.file)
    state.videoPlayerOptions.sources[0].src = 'max-file://' + obj.file.replace(':', '')
    // state.videoPlayerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
    state.videoPlayer = true
  },
  CLOSE_VIDEO_PLAYER (state, obj) {
    state.videoPlayer = false
    state.videoPlayerOptions.sources[0].src = ''
  },
  EASY_START_VIDEO_CAPTURE (state, obj) {
    console.log(maxjia)
    maxjia.media.easyStartVideoCapture(data => {

    })
  }
  // E 客户端全局接口
}
