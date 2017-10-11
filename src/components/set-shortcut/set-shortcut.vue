<template>
  <div class="cpt-shortcut setting-row">
    <div class="label-wrap">
      <div class="label">{{ label }}</div>
      <div class="desc">
        <slot name="desc"></slot>
      </div>
    </div>
    <div class="text-field-wrap">
      <input type="text" class="text-field" ref="input" v-model="comb" @keydown="handleKeydown" @keyup="handleKeyup" onkeydown="return false;">
    </div>
  </div>
</template>

<script>
import keycode from 'keycode'
import cptTextField from '@/components/text-field'


export default {
  name: "cpt-set-shortcut",
  components: {
    'cpt-text-field': cptTextField
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'name',
      require: true
    },
    app: {
      type: String,
      default: 'app'
    }
  },
  data () {
    return {
      shortcut: '',
      hotKeys: [],
      saved: false,
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
    comb () {
      if (this.shortcut) {
        return this.shortcut
      } else {
        let array = []
        for (let i of this.modifiers) {
          i.e && array.push(i.k)
        }
        let comb = ''
        for (let i of array) {
          comb += (i + ' + ')
        }
        comb += this.virtualKey.k
        return comb
      }
    }
  },
  methods: {
    getHotkeys () {
      maxjia.settings.getHotkeys((data) => {
        this.hotKeys = data.hotkeys
        console.log(this.hotKeys)
        // document.getElementById('getHotkeys').innerHTML = JSON.stringify(data);
      })
    },
    getHotkey () {
      maxjia.settings.getHotkey(this.name, this.app, (data) => {
        const virtualKey = keycode(data.hotkey.virtualKeyCode)
        const modifiers = data.hotkey.modifiers
        this.displayHotKey(modifiers, virtualKey)
      })
    },
    displayHotKey (modifiers, virtualKey) {
      let array = []
      for (let i of this.modifiers) {
        modifiers & i.v && array.push(i.k)
      }
      if (array.length > 0) {
        const shortcut = array.join(' + ')
        this.shortcut = shortcut + ' + ' + virtualKey
      } else {
        this.shortcut = virtualKey
      }
    },
    setHotkey (modifier, key, cb) {
      maxjia.settings.setHotkey(this.name, this.app, modifier, key, cb)
    },
    handleKeydown (event) {
      const key = keycode(event)
      this.shortcut = ''
      if (this.saved) {
        for (let i of this.modifiers) {
          i.e = false
        }
      }
      // 判断是否是修饰键
      if (/ctrl|shift|alt/.test(key)) {
        this.saved = false
        this.shortcut = ''
        this.virtualKey.e = false
        for (let i of this.modifiers) {
          i.c === keycode(key) && (i.e = true)
        }
      } else {
        this.virtualKey.e = true
        this.virtualKey.v = key

        this.saved = true
        this.$refs.input.blur()

        let modifiers = 0
        for (let i of this.modifiers) {
          modifiers += i.e ? i.v : 0
        }
        this.displayHotKey(modifiers, this.virtualKey.v)
        this.setHotkey(modifiers, keycode(key), function () {
          console.log('Set hotkey: ' + this.name + ' ' + this.comb)
        })
      }
      
      console.log(key)
      console.log(keycode(key))
    },
    handleKeyup (event) {
      const key = keycode(event)
      // 判断是否是修饰键
      if (/ctrl|shift|alt/.test(key)) {
        if (this.virtualKey.e) {
          
        } else {
          this.virtualKey.e = false
          // 判断是否按下了修饰键
          let modifier = false 
          for (let i of this.modifiers) {
            if (i.c === keycode(key)) {
              i.e = false
            } else {
              i.e && (modifier = true)
            }
          }
          modifier || this.$refs.input.blur()
        }
      } else {

      }
    }
  },
  created () {
    this.getHotkey()
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-shortcut {
  display: flex;
  .label-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
    .label {
      color: @labelColor;
    }
    .desc {
      color: @descColor;
    }
  }
  .text-field-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 150px;
    .text-field {
      position: relative;
      width: 100%;
      height: 30px;
      line-height: 18px;
      font-size: 12px;
      color: fade(@textColor, 50%);
      background-color: @textFieldBackgroundColor;
      border: solid 1px @textFieldBorderColor;
      border-radius: 2px;
      text-align: center;
      padding: 5px 6px;
      box-sizing: border-box;
    }
  }
}
</style>