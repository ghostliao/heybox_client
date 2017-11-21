export const navigateToPage = ({ commit }, obj) => {
  commit('NAVIGATE_TO_PAGE', obj)
}

export const playVideoFile = ({ commit }, obj) => {
  commit('DIALOG_INIT', obj)
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
  commit('DIALOG_INIT', obj)
  commit('CHECK_IMAGE_FILE', obj)
}

export const closeImageChecker = ({ commit }, obj) => {
  commit('CLOSE_IMAGE_CHECKER', obj)
}

export const locateFileInExplorer = ({ commit }, obj) => {
  commit('LOCATE_FILE_IN_EXPLORER', obj)
}

export const openMsgDialog = ({ commit }, obj) => {
  commit('DIALOG_INIT', obj)
  commit('OPEN_MSG_DIALOG', obj)
}

export const closeMsgDialog = ({ commit }, obj) => {
  commit('CLOSE_MSG_DIALOG', obj)
}

// export const dialogInit = ({ commit }, obj) => {
//   commit('DIALOG_INIT', obj)
// }

export const getAllSpecialFolderLocation = ({ commit }, obj) => {
  commit('GET_ALL_SPECIAL_FOLDER_LOCATION', obj)
}

export const readFile = ({ commit }, obj) => {
  commit('READ_FILE', obj)
}

export const writeFile = ({ commit }, obj) => {
  commit('WRITE_FILE', obj)
}