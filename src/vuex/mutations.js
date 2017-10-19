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
    // console.log('playVideoFile: ' + obj.file)
    state.videoPlayerOptions.sources[0].src = 'max-file://' + obj.file.replace(':', '')
    // state.videoPlayerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
    state.videoPlayer = true
  },
  CLOSE_VIDEO_PLAYER (state, obj) {
    state.videoPlayer = false
    state.videoPlayerOptions.sources[0].src = ''
  },
  EASY_START_VIDEO_CAPTURE (state, obj) {
    state.recordingState = 'RS_Init'
    maxjia.media.easyStartVideoCapture(data => {})
  },
  STOP_VIDEO_CAPTURE (state, obj) {
    maxjia.media.stopVideoCapture()
  },
  START_IMAGE_CAPTURE (state, obj) {
    maxjia.media.startImageCapture()
  },
  CHECK_IMAGE_FILE (state, obj) {
    console.log('checkImageFile: ' + obj.file)
    state.imageCheckerOptions.src = 'max-file://' + obj.file.replace(':', '')
    state.imageChecker = true
  },
  CLOSE_IMAGE_CHECKER (state, obj) {
    state.imageChecker = false
    state.imageCheckerOptions.src = ''
  },
  LOCATE_FILE_IN_EXPLORER (state, obj) {
    // console.log(maxjia.maxapi)
    maxjia.maxapi.locateFileInExplorer(obj.url)
  }
  // E 客户端全局接口
}
