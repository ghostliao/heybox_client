import {merge} from './utils'
function config (options) {
  if (!options) return
  merge(config, options)
}

merge(config, {
  disableTouchRipple: true,
  disableFocusRipple: true
})

export default config
