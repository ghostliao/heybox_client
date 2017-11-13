<template>
  <div class="cpt-annular">
    <canvas ref="canvas" width="126" height="126"></canvas>
    <div class="info">
      <p class="label">{{label}}</p>
      <p class="value wf-din grd" :class="{ 'wc-primary': value <= 60, 'wc-danger': value > 60 }">{{value}}%</p>
      <p class="status">{{status}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "cpt-annular",
  components: {
    
  },
  props: {
    label: {
      type: String
    },
    value: {
      type: Number,
      default: 0
    },
    status: {
      type: String
    }
  },
  data () {
    return {
      
    }
  },
  computed: {
    
  },
  watch: {
    value () {
      this.annularInit(this.value)
    }
  },
  methods: {
    annularInit (percent) {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')

      ctx.lineWidth = 4
      const x = canvas.width / 2
      const y = canvas.height / 2
      const r = canvas.width / 2 - ctx.lineWidth / 2

      let angle = 0
      function draw () {
        // let timer = requestAnimationFrame(draw)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // 底部深色圆环
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, .1)'
        ctx.arc(x, y, r, 0, Math.PI * 2, false)
        ctx.stroke()
        // 顶部彩色圆环 
        ctx.beginPath()
        ctx.lineCap = 'round'
        ctx.strokeStyle = percent <= 60 ? '#008ee8' : '#D0021B'

        ctx.arc(x, y, r, -Math.PI / 2, Math.PI * 2 * percent / 100 - Math.PI / 2, false)
        // angle++
        // if (angle > (percent * 360)) {
        //   window.cancelAnimationFrame(timer)
        // }
        ctx.stroke()
      }
      draw()
      
    }
  },
  mounted () {
    this.annularInit(this.value)
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";

.cpt-annular {
  position: relative;
  canvas {
    
  }
  .info {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 126px;
    height: 126px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .label {
      font-size: 12px;
      color: @secondaryTextColor;
    }
    .value {
      font-size: 40px;
      // letter-spacing: -2px;
    }
    .status {
      font-size: 12px;
      color: fade(@textColor, 50%);
    }
  }
}
</style>