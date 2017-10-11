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