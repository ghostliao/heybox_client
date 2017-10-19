<template>
  
</template>

<script>
import keycode from 'keycode'

export default {
  data () {
    return {
      shortcut: '',
      hotkeysList: [
        { name: 'Video.CaptureVideo', app: 'Video', key: 'captureVideo' },
        { name: 'Video.Save30Moment', app: 'Video', key: 'save30Moment' },
        { name: 'Video.CaptureImage', app: 'Video', key: 'captureImage' },
        { name: 'Dock.Show', app: 'Dock', key: 'dockShow' },
        { name: 'Overlay.ShowHide', app: 'Overlay', key: 'overlayShowHide' }
      ],
      hotKeys: [],
      modifiers: [
        {
          k: 'Ctrl',
          v: 0x04000000,
          c: 17,
          e: false
        },
        {
          k: 'Shift',
          v: 0x02000000,
          c: 16,
          e: false
        },
        {
          k: 'Alt',
          v: 0x08000000,
          c: 18,
          e: false
        }
      ],
      virtualKey: {
        k: '',
        c: undefined,
        e: false
      }
    }
  },
  computed: {
    
  },
  methods: {
    getHotkeys () {
      maxjia.settings.getHotkeys((data) => {
        this.hotKeys = data.hotkeys
        console.log(this.hotKeys)
        // document.getElementById('getHotkeys').innerHTML = JSON.stringify(data);
      })
    },
    getHotkey (name, app, key) {
      maxjia.settings.getHotkey(name, app, (data) => {
        const virtualKey = keycode(data.hotkey.virtualKeyCode)
        const modifiers = data.hotkey.modifiers
        const hotkey = this.displayHotKey(modifiers, virtualKey)
        this.$store.state.hotkeys[key] = hotkey
      })
    },
    displayHotKey (modifiers, virtualKey) {
      let array = []
      for (let i of this.modifiers) {
        modifiers & i.v && array.push(i.k)
      }
      if (array.length > 0) {
        const shortcut = array.join(' + ')
        return shortcut + ' + ' + virtualKey
      } else {
        return virtualKey
      }
    }
  },
  created () {
    for (let i of this.hotkeysList) {
      this.getHotkey(i.name, i.app, i.key)
    }
    // this.getHotkeys()
  }
}

</script>