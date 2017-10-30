import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'getAllSpecialFolderLocation',
      'readFile',
      'writeFile'
    ]),
    parseXML (str) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(str, "text/xml")
      return doc
      // const optimize = doc.getElementsByTagName('Optimize')
      // const level = optimize[0].getAttribute('LevelDesc')
      // optimize[0].setAttribute('LevelDesc', 'desc from ghost')
      // optimize[0].setAttribute('ghostAttr1', 'ghostAttr1')
      // console.log(optimize.item(0))
      // console.log(optimize.item(0).getElementsByTagName('Item').item(0).nodeName)
      // console.log(doc)
    },
    parseINIString (data) { 
      var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
      }
      var value = {}
      var lines = data.split(/\r\n|\r|\n/)
      var section = null
      lines.forEach(function (line) {
        if (regex.comment.test(line)) {
          return
        } else if (regex.param.test(line)) {
          var match = line.match(regex.param)
          if (section) {
            value[section][match[1]] = match[2]
          } else {
            value[match[1]] = match[2]
          }
        } else if (regex.section.test(line)) {
          var match = line.match(regex.section)
          value[match[1]] = {}
          section = match[1]
        } else if (line.length == 0 && section) {
          section = null
        }
      })
      return value
    },
    gameOptimize (config) {
      const _this = this

      const fileType = config.fileType ? config.fileType.toLowerCase() : ''
      const gameId = config.gameId // required
      const level = config.level // required

      this._getAllSpecialFolderLocation().then(data => {
        const desktopPath = data.Desktop
        Promise.all([
          _this.readXML(desktopPath + '/optimization/G410005_4.xml'),
          _this.readINI(desktopPath + '/optimization/Engine.ini')
        ]).then(array => {
          console.log('promise all resolved')
          console.log(array)
          _this.diffFiles({
            gameId: gameId,
            level: level,
            iniJSON: array[1],
            xmlDoc: array[0]
          })
        })
      })

      // this.writeFile({
      //   path: res.path,
      //   mode: 'w+',
      //   content: res.content,
      //   callback: (res) => {
      //     console.log(res)
      //   }
      // })
        


      config.callback()
    },
    _getAllSpecialFolderLocation () {
      const _this = this
      return new Promise((resolve, reject) => {
        _this.getAllSpecialFolderLocation(data => {
          resolve(data)
        })
      })
    },
    _readFile (path) {
      const _this = this
      return new Promise((resolve, reject) => {
        _this.readFile({
          path: path,
          callback: data => {
            resolve(data)
          }
        })
      })
    },
    readXML (path) {
      const _this = this
      return new Promise((resolve, reject) => {
        this._readFile(path).then(function (data) {
          if (data.result) {
            const xmlDoc = _this.parseXML(data.content)
            console.log('read xml done')            
            resolve(xmlDoc)
          } else {
            console.log('read failed')
          }
        })
      })
    },
    readINI (path) {
      const _this = this
      return new Promise((resolve, reject) => {        
        this._readFile(path).then(function (data) {
          if (data.result) {
            const iniJSON = _this.parseINIString(data.content)
            console.log('read ini done')
            resolve(iniJSON)
          } else {
            console.log('read failed')
          }
        })
      })
    },
    diffFiles (config) {
      const gameId = config.gameId
      const level = config.level
      const d = config.xmlDoc // .xml doc
      const o = config.iniJSON // .ini json
      // console.log(d)
      window.d = d
      const optimizes = d.getElementsByTagName('Optimize')
      console.log(optimizes)
      for (let i = 0, len1 = optimizes.length; i < len1; i++) {
        // console.log(optimizes[i])
        let el = optimizes[i]
        window['d' + i] = el
        if (Number(el.getAttribute('GameId')) === gameId && Number(el.getAttribute('Level')) === level) {
          const items = el.getElementsByTagName('Item')
          let changesCounter = 0 // 更改项计数
          for (let j = 0, len2 = items.length; j < len2; j++) {
            const keyStr = items[j].getElementsByTagName('Key')[0].innerHTML // --> /script/engine.renderersettings:r.SSR
            const keyStrArray = keyStr.split(':')
            const section = keyStrArray[0] // --> /script/engine.renderersettings
            const key = keyStrArray[1] // --> r.SSR
            const value = items[j].getElementsByTagName('Value')[0].innerHTML // --> 0

            const oValue = o[section][key]
            if (oValue) {
              if (oValue === value) { // 配置值相同
                
              } else { // 配置值不同
                o[section][key] = value
                changesCounter++
              }
            } else { // ini没有该配置项
              o[section][key] = value
            }
          }
          console.log(o)
          console.log('options changed: ' + changesCounter)
        }
      }

    }
  },
  mounted () {
    this.gameOptimize({
      gameId: 410005,
      level: 2,
      callback: () => {
        // console.log('cb')
      }
    })

  }
}
