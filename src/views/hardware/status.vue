<template>
  <div class="view-hardware-status">
    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="progress">
        <cpt-circular-progress :size="40" />
      </div>
      <div v-if="!loading" key="content" class="content">
        <div class="wrap">
          <cpt-set-block-head title="实时状态"></cpt-set-block-head>
          <div class="body">
            <template v-if="hardwareData.cpu">
              <cpt-set-block title="CPU" :setBlockStyle="setBlockStyle">
                <div class="chart-wrap">
                  <cpt-annular label="CPU利用率" :value="Number(hardwareData.cpu.usage)"></cpt-annular>
                  <cpt-chart id="cpulineChart" :data="hardwareData" dataType="cpu" chartType="line"></cpt-chart>
                </div>
              </cpt-set-block>

              <cpt-set-block title="内存" :setBlockStyle="setBlockStyle">
                <div class="chart-wrap">
                  <cpt-annular label="内存利用率" :value="Number(hardwareData.memory.usage)" :status="memoryStatus"></cpt-annular>
                  <cpt-chart id="memorylineChart" :data="hardwareData" dataType="memory" chartType="line"></cpt-chart>
                </div>
              </cpt-set-block>

              <cpt-set-block title="GPU" :setBlockStyle="setBlockStyle">
                <div class="chart-wrap">
                  <cpt-annular label="核心利用率" :value="Number(hardwareData.gpus[0].gpu_usage)" :status="gpuStatus"></cpt-annular>
                  <cpt-chart id="gpulineChart" :data="hardwareData" dataType="gpu" chartType="line"></cpt-chart>
                </div>
              </cpt-set-block>

              <cpt-set-block title="网络" :setBlockStyle="setBlockStyle">
                <div class="chart-wrap">
                  <div class="in-out-wrap">
                    <div class="legend out">
                      <div class="v">{{netOutLoad}}</div>
                      <div class="k">发送</div>
                    </div>
                    <div class="legend in">
                      <div class="v">{{netInLoad}}</div>
                      <div class="k">接收</div>
                    </div>
                  </div>
                  <cpt-chart id="netlineChart" :data="hardwareData" dataType="net" chartType="net"></cpt-chart>
                </div>
              </cpt-set-block>
            </template>
          </div>
        </div>
      </div>
    </transition>      
  </div>
</template>

<script>
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'
import cptAnnular from '@/components/annular'
import cptChart from '@/components/chart'
// import chartOptions from '../../chart/options'
import cptCircularProgress from '@/components/circularProgress'

export default {
  name: "view-hardware-status",
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-annular': cptAnnular,
    'cpt-chart': cptChart,
    'cpt-circular-progress': cptCircularProgress
  },
  data () {
    return {
      loading: true,
      setBlockStyle: {
        'width': '388px',
        'margin': '0 8px 8px 0'
      },
      hardwareData: {},
      hardwarePrefInfoReady: false,
      hardwarePerfInfoTimer: undefined,
      hardwareHeatbeatTimer: undefined
    }
  },
  computed: {
    gpuStatus () {
      return this.getStatus(this.hardwareData.gpus[0].memory_size, this.hardwareData.gpus[0].memory_usage)
    },
    memoryStatus () {
      return this.getStatus(this.hardwareData.memory.memory_size, this.hardwareData.memory.usage)
    },
    netOutLoad () {
      return this.netLoadFormat(this.hardwareData.net.out_load)
    },
    netInLoad () {
      return this.netLoadFormat(this.hardwareData.net.in_load)
    }
  },
  methods: {
    getStatus (size, usage) {
      let a
      if (size < 1024) {
        a = size + ' MB'
      } else {
        a = Math.round(size / 1024) + ' GB'
      }
      let c = Math.round(size * (usage / 100))
      if (c > 1024) {
        c = Number(c / 1024).toFixed(1) + ' GB'
      } else {
        c = c + ' MB'
      }
      return c + ' / ' + a
    },
    netLoadFormat (val) {
      let str
      const KVal = val * 8 / 1024
      const MVal = KVal / 1024
      if (MVal >= 1) {
        str = Number(MVal).toFixed(1) + ' Mbps'
      } else {
        str = Number(KVal).toFixed(1) + ' Kbps'
      }
      return str
    },
    init () {
      console.log('init')
      maxjia.hardware.hardwarePerfInfoReady.addListener(() => {
        if (!this.hardwarePrefInfoReady) {
          this.hardwarePrefInfoReady = true
          
          console.log('hardwarePrefInfoReady')
        
          this.getHardwarePerfInfo()
          this.hardwarePerfInfoTimer = setInterval(() => {
            if (this.$route.name === 'hardware-status') {
              console.log('hardwarePerfInfoTimer')
              this.getHardwarePerfInfo()
            }
          }, 1000)

          this.hardwareHeatbeatTimer = setInterval(() => {
            if (this.$route.name === 'hardware-status') {
              maxjia.hardware.heartbeat()
            }
          }, 9000)
        }
      })

      // maxjia.hardware.hardwarePerfRefreshed.addListener(() => {
      //   console.log('refreshed')
      // })

      maxjia.hardware.startRefreshHardwarePerf()

      // this.getHardwarePerfInfo()
      // setInterval(() => {
      //   this.getHardwarePerfInfo()
      // }, 1000)
    },
    getHardwarePerfInfo () {
      // console.log('data')
      maxjia.hardware.getHardwarePerfInfo((data) => {
        // console.log(data.gpus[0])
        // console.log('clock speed: ' + data.gpus[0].clock_speed)
        // console.log('memory speed: ' + data.gpus[0].memory_speed)
        this.hardwareData = data
        this.loading = false
      })
    }
  },
  mounted () {
    this.init()
    this.__REPORT('view_hardware_status')    
  },
  activated () {
    // this.init()
    this.__REPORT('view_hardware_status')
  },
  // deactivated () {
  //   console.log('deactivated')
  //   clearInterval(this.hardwarePerfInfoTimer)
  //   clearInterval(this.hardwareHeatbeatTimer)
  // },
  beforeDestroy () {
    clearInterval(this.hardwarePerfInfoTimer)
    clearInterval(this.hardwareHeatbeatTimer)
    // console.log(`clear interval`)
  }

}

</script>

<style lang="less">
@import "../../styles/import.less";
.view-hardware-status {
  position: relative;
  height: 100%;
  .progress {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  > .content {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 6px 40px;
    > .wrap {
      width: 784px;
      margin: auto;
      > .body {
        display: flex;
        flex-wrap: wrap;
        margin-right: -8px;
        .chart-wrap {
          display: flex;
          align-items: center;
          .cpt-annular {
            width: 126px;
            margin-right: 12px;
          }
          .in-out-wrap {
            width: 80px;
            margin-right: 12px;
            .legend {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 34px;
              line-height: 1;
              padding-left: 8px;
              &:first-of-type {
                margin-bottom: 30px;
              }
              &.out {
                border-left: 1px dashed fade(@primaryColor, 60%);
              }
              &.in {
                border-left: 1px solid fade(@primaryColor, 60%);
              }
              .v {
                font-size: 14px;
                color: fade(@textColor, 50%);
              }
              .k {
                font-size: 12px;
                color: @secondaryTextColor;
              }
            }
          }
          .cpt-chart {
            flex: 1;
            min-width: 0;
          }
        }
      }
    }
  }
}

</style>