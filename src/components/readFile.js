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

      value.ignore = {}

      lines.forEach(function (line) {

        if (regex.comment.test(line)) {
          return
        } else if (regex.param.test(line)) {
          var match = line.match(regex.param)
          if (section) {
            // section: Core.System
            // match[1]: Paths
            // match[2]: ../../../Engine...
            if (!value[section][match[1]]) {
              value[section][match[1]] = []
            }
            value[section][match[1]].push({
              k: match[1],
              v: match[2]
            })
            // value[section][match[1]] = match[2]
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
      const fileName = config.fileName
      const filePath = config.filePath
      const gameId = config.gameId // required
      const level = config.level // required

      this._getAllSpecialFolderLocation().then(data => {
        Promise.all([
          _this.readXML(localStorage.getItem(gameId)),
          // _this.readXML(data.Desktop + '/optimization/G410005_4.xml'),
          _this.readINI(filePath),
          _this.pathPasser(data)
        ]).then(array => {
          console.log('promise all resolved')
          // console.log(array)
          _this.diffFiles({
            file: fileName,
            filePath: filePath,
            gameId: gameId,
            level: level,
            pathObj: array[2],
            iniJSON: array[1],
            xmlDoc: array[0]
          })
        })
      })

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
    pathPasser (data) {
      return new Promise((resolve, reject) => {
        // console.log(data)
        resolve(data)
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
    // readXML (path) {
    //   const _this = this
    //   return new Promise((resolve, reject) => {
    //     this._readFile(path).then(function (data) {
    //       if (data.result) {
    //         const xmlDoc = _this.parseXML(data.content)
    //         console.log('read xml done')            
    //         resolve(xmlDoc)
    //       } else {
    //         console.log('read failed')
    //       }
    //     })
    //   })
    // },
    readXML (str) {
      const _this = this
      const string = JSON.parse(str).content
      return new Promise((resolve, reject) => {
        const xmlDoc = _this.parseXML(string)
        console.log('read local xml done')
        console.log(xmlDoc)
        resolve(xmlDoc)
      })
    },
    readINI (path) {
      console.log(path)
      const _this = this
      return new Promise((resolve, reject) => {        
        this._readFile(path).then(function (data) {
          console.log(data)
          if (data.result) {
            let iniJSON = _this.parseINIString(data.content)
            const pathArray = data.path.split('/')
            const fileName = pathArray[pathArray.length - 1]
            // if (fileName === 'GameUserSettings.ini') {

            // } else if (fileName === 'Engine.ini') {
            //   // 保留ini部分字符串
            //   const ignoreStr = '[Core.System]' + data.content.split('[Core.System]')[1].split('\r\n\r\n')[0]
            //   iniJSON.ignore['Core.System'] = ignoreStr
            // }
            console.log('read ini done')
            console.log(`${fileName} iniJSON:`)
            console.log(iniJSON)
            resolve(iniJSON)
          } else {
            console.log('read failed')
          }
        })
      })
    },
    diffFiles (config) {
      const iniFile = config.file
      const filePath = config.filePath
      const gameId = config.gameId
      const level = config.level
      const pathObj = config.pathObj
      const d = config.xmlDoc // .xml doc
      const o = config.iniJSON // .ini json
      // console.log(d)
      const optimizes = d.getElementsByTagName('Optimize')
      // console.log(optimizes)
      for (let i = 0, len1 = optimizes.length; i < len1; i++) {
        // console.log(optimizes[i])
        let el = optimizes[i]
        if (Number(el.getAttribute('GameId')) === Number(gameId) && Number(el.getAttribute('Level')) === Number(level)) {
          let items
          if (iniFile === 'engine') {
            items = el.getElementsByTagName('File')[0].getElementsByTagName('Item')
          } else if (iniFile === 'gameUserSettings') {
            items = el.getElementsByTagName('File')[1].getElementsByTagName('Item')
          }
          let changesCounter = 0, newOptionsCounter = 0 // 更改项&新增项计数
          for (let j = 0, len2 = items.length; j < len2; j++) {
            const keyStr = items[j].getElementsByTagName('Key')[0].innerHTML // --> /script/engine.renderersettings:r.SSR
            const keyStrArray = keyStr.split(':')
            const section = keyStrArray[0] // --> /script/engine.renderersettings
            const key = keyStrArray[1] // --> r.SSR
            const value = items[j].getElementsByTagName('Value')[0].innerHTML // --> 0

            // 判断section是否存在
            let sectionExist = false
            let iniSection
            for (let i in o) {
              const oSection = i.toLocaleLowerCase()
              if (oSection === section.toLocaleLowerCase()) {
                sectionExist = true
                iniSection = i
              }
            }
            if (!sectionExist) { // 不存在该section
              o[section] = {}
              iniSection = section
            }
            // let oValue
            // try {
            //   oValue = o[iniSection][key][0].v
            // } catch (error) {
            //   console.log(iniSection)
            //   console.log(key)
            // }
            // console.log(oValue)
            if (o[iniSection][key]) {
              const oValue = o[iniSection][key][0].v
              if (oValue === value) { // param值相同
                
              } else { // param值不同
                o[iniSection][key][0].v = value
                changesCounter++
              }
            } else { // 不存在该param
              o[iniSection][key] = []
              o[iniSection][key].push({
                k: key,
                v: value
              })
              // o[iniSection][key][0].v = value
              newOptionsCounter++
            }
          }
          console.log(`--------------------\noptions changed: ${changesCounter}\noptions add: ${newOptionsCounter}\n--------------------`)
          console.log(`write ${iniFile} iniJSON:`)
          console.log(o)
          this._writeFile(o, filePath)
        }
      }
    },
    _writeFile (o, filePath) {
      let iniStr = ''
      // if (o.ignore['Core.System']) {
      //   iniStr = o.ignore['Core.System'].replace(/^\s|\s+$/, '') // 去掉首尾换行
      //   iniStr += '\r\n'
      // }
      for (let i in o) {
        if (!i.match(/ignore|proconfig.moedaze.com/)) {
          // console.log(i)
          iniStr += `\r\n[${i}]\r\n`
          for (let j in o[i]) {
            // console.log(j)
            // iniStr += `${j}=${o[i][j][0].v}\r\n`
            for (let k of o[i][j]) {
              iniStr += `${k.k}=${k.v}\r\n`
            }
          }
        }
      }
      // console.log(iniStr)
      
      const writeFilePath = filePath
      this.writeFile({
        path: writeFilePath,
        mode: 'w+', // w -> 部分替换, w+ -> 全覆盖, a -> 追加
        content: iniStr,
        callback: (res) => {
          console.log('write finished')
        }
      })
        
    }
  },
  mounted () {
    // this.getAllSpecialFolderLocation(res => {
    //   console.log(res)
    // })

  }
}
