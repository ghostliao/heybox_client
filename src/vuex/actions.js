export const setGameType = ({ commit }, gameType) => {
  commit('SET_GAMETYPE', gameType)
}

export const navigateToPage = ({ commit }, obj) => {
  commit('NAVIGATE_TO_PAGE', obj)
}

export const playVideoFile = ({ commit }, obj) => {
  commit('PLAY_VIDEO_FILE', obj)
}

export const closeVideoPlayer = ({ commit }, obj) => {
  commit('CLOSE_VIDEO_PLAYER', obj)
}

export const easyStartVideoCapture = ({ commit }, obj) => {
  commit('EASY_START_VIDEO_CAPTURE', obj)
}

export const stopVideoCapture = ({ commit }, obj) => {
  commit('STOP_VIDEO_CAPTURE', obj)
}

export const startImageCapture = ({ commit }, obj) => {
  commit('START_IMAGE_CAPTURE', obj)
}

export const checkImageFile = ({ commit }, obj) => {
  commit('CHECK_IMAGE_FILE', obj)
}

export const closeImageChecker = ({ commit }, obj) => {
  commit('CLOSE_IMAGE_CHECKER', obj)
}

export const locateFileInExplorer = ({ commit }, obj) => {
  commit('LOCATE_FILE_IN_EXPLORER', obj)
}