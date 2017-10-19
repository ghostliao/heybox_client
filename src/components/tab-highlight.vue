<template>
  
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getActiveIndex () {
      let activeIndex = -4
      this.navTabs.forEach((tab, i) => {
        const pathArray = this.$route.path.split('/')
        let pathName

        if (this.routeDepth === 1) {
          pathName = pathArray[1]
        } else if (this.routeDepth === 2) {
          pathName = pathArray[1] + '-' + pathArray[2]
        }
        // console.log(pathName)
        
        if (tab.name === pathName) {
          activeIndex = i
          return false
        }
      })
      return activeIndex
    },
    setTabLightStyle (msg) {
      // console.log('set tab:' + this.getActiveIndex())
      // console.log(this.$refs.tab2)
      
      // const x = this.getActiveIndex() * 100
      // const len = this.navTabs.length
      const index = this.getActiveIndex()
      const el = this.$refs.highlight
      if (index === -4) {
        el.style.left = '-100px'
        el.style.width = 0
        el.style.opacity = 0
      } else {
        const tab = this.$refs['tab' + index]
        // el.style.width = len > 0 ? (100 / len).toFixed(4) + '%' : '100%'
        // el.style.transform = 'translate3d(' + x + '%, 0, 0)'
        el.style.left = tab[0].offsetParent.offsetLeft + tab[0].offsetLeft + 'px'
        el.style.width = tab[0].clientWidth + 'px'
        el.style.opacity = 1
      }
    }
  },
  mounted () {
    this.setTabLightStyle()
    this.$router.afterEach(route => {
      // console.log(route)
      this.setTabLightStyle()
    })
  }
}
</script>

