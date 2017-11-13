<template>
  <div class="cpt-chart">
    <div class="chart-container" :id="id"></div>
    <div class="x-label" :class="{ 'line': chartType === 'line' }">
      <span>-60s</span>
      <span>0</span>
    </div>
  </div>
</template>

<script>
import HighCharts from 'highcharts'
// import chartOptions from '../../chart/options'

export default {
  name: "cpt-chart",
  components: {
    
  },
  props: {
    id: {
      type: String
    },
    data: {
      type: Object
    },
    dataType: { // 数据类型 eg. cpu
      type: String
    },
    chartType: { // 图表类型 eg. line
      type: String
    },
    option: {
      type: Object
    },
    callback: {
      type: Function
    }
  },
  data () {
    return {
      chartData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      chartData2: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
    }
  },
  computed: {
    chartOptions () {
      return {
        line: {
          chart: {
            backgroundColor: 'transparent',
            plotBackgroundColor: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, 'rgba(0,0,0,0.1)'],
                [0.25, 'rgba(0,0,0,0.1)'],
                [0.25, 'rgba(0,0,0,0.16)'],
                [0.5, 'rgba(0,0,0,0.16)'],
                [0.5, 'rgba(0,0,0,0.1)'],
                [0.75, 'rgba(0,0,0,0.1)'],
                [0.75, 'rgba(0,0,0,0.16)'],
                [1, 'rgba(0,0,0,0.16)']
              ]
            },
            spacing: [24, 0, 24, 0],
            height: 200
          },
          exporting: {
            enabled: false
          },
          title: {
            text: '',
            x: -20
          },
          xAxis: {
            tickmarkPlacement: 'on', 
            categories: [
              // '60秒', '', '', '', '', '', '', '', '', '0',
            ],
            labels: {
              enabled: false,              
              x: 10,
              autoRotation: false,
              style: {
                'font-family': 'microsoft yahei',
                'font-weight': '400'
              }
            },
            tickLength: 0,
            lineWidth: 0
          },
          yAxis: {
            title: {
              enabled: false,
              text: '100%利用率',
              style: {
                'font-family': 'microsoft yahei',
                'font-weight': '400'
              },
              align: 'high',
              rotation: 0,
              margin: 0,
              offset: -68,
              y: -10
            },
            labels: {
              // enabled: false,
              formatter: function () {
                if (this.value <= 0) {
                  return 0
                } else {
                  return this.value + '%'
                }
              },
              style: {
                'font-family': 'microsoft yahei',
                'color': 'rgba(241, 242, 243, 0.2)'
              },
              // align: 'right',
              // reserveSpace: false,
              // x: 0,
              // y: -10,
              step: 2
            },
            opposite: true,
            gridLineColor: 'rgba(255, 255, 255, 0.04)',
            max: 100,
            min: 0,
            tickAmount: 5,
            // showFirstLabel: false
          },
          tooltip: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          series: [
            {
              name: 'CPU',
              data: this.chartData,
              pointPlacement: 'on',          
              color: 'rgba(8, 95, 151, 0.6)',
              lineWidth: 1.5,
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              },
              animation: false
            }
          ],
          credits: {
            enabled: false
          }
        },
        // net chart option
        net: {
          chart: {
            backgroundColor: 'transparent',
            plotBackgroundColor: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, 'rgba(0,0,0,0.1)'],
                [0.1, 'rgba(0,0,0,0.1)'],
                [0.1, 'rgba(0,0,0,0.16)'],
                [0.2, 'rgba(0,0,0,0.16)'],
                [0.2, 'rgba(0,0,0,0.1)'],
                [0.3, 'rgba(0,0,0,0.1)'],
                [0.3, 'rgba(0,0,0,0.16)'],
                [0.4, 'rgba(0,0,0,0.16)'],
                [0.4, 'rgba(0,0,0,0.1)'],
                [0.5, 'rgba(0,0,0,0.1)'],
                [0.5, 'rgba(0,0,0,0.16)'],
                [0.6, 'rgba(0,0,0,0.16)'],
                [0.6, 'rgba(0,0,0,0.1)'],
                [0.7, 'rgba(0,0,0,0.1)'],
                [0.7, 'rgba(0,0,0,0.16)'],
                [0.8, 'rgba(0,0,0,0.16)'],
                [0.8, 'rgba(0,0,0,0.1)'],
                [0.9, 'rgba(0,0,0,0.1)'],
                [0.9, 'rgba(0,0,0,0.16)'],
                [1, 'rgba(0,0,0,0.16)']
              ]
            },
            spacing: [24, 0, 24, 0],
            height: 200
          },
          exporting: {
            enabled: false
          },
          title: {
            enabled: false,            
            text: '',
            x: -20
          },
          xAxis: {
            tickmarkPlacement: 'on', 
            categories: [
              // '60秒', '', '', '', '', '', '', '', '', '0',
            ],
            labels: {
              enabled: false,
              x: 10,
              autoRotation: false,
              style: {
                'font-family': 'microsoft yahei',
                'font-weight': '400'
              }
            },
            tickLength: 0,
            lineWidth: 0
          },
          yAxis: {
            title: {
              enabled: false,
              text: '吞吐量（Mbps）',
              style: {
                'font-size': '10px',
                'font-family': 'microsoft yahei',
                'font-weight': '400'
              },
              align: 'high',
              rotation: 0,
              margin: 0,
              offset: -86,
              y: -10
            },
            labels: {
              // enabled: false，
              formatter: function () {
                let str
                const KVal = this.value * 8 / 1024
                const MVal = KVal / 1024
                if (MVal >= 1) {
                  str = Number(MVal).toFixed(1) + ' Mbps'
                } else {
                  str = Number(KVal).toFixed(0) + ' Kbps'
                }
                return str
              },
              style: {
                'font-family': 'microsoft yahei',                
                'color': 'rgba(241, 242, 243, 0.2)'
              },
              align: 'right',
              reserveSpace: false,
              x: 0,
              y: -10,
              step: 2
            },
            opposite: true,
            gridLineColor: 'rgba(255, 255, 255, 0.04)',
            // gridLineWidth: 0,
            // minorTickInterval: 1024 * 100,
            // minorGridLineColor: 'rgba(255, 255, 255, 0.04)',
            min: 0,
            tickAmount: 3,
            showFirstLabel: false
          },
          tooltip: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          series: [
            {
              name: '',
              data: this.chartData,
              pointPlacement: 'on',          
              color: 'rgba(8, 95, 151, 0.6)',
              lineWidth: 1.5,
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              },
              animation: false
            },
            {
              name: '',
              data: this.chartData2,
              pointPlacement: 'on',          
              color: 'rgba(8, 95, 151, 0.6)',
              lineWidth: 1.5,
              dashStyle: 'ShortDash',
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              },
              animation: false
            }
          ],
          credits: {
            enabled: false
          }
        }
      }
    }
  },
  watch: {
    data (val) {
      this.getChartData()
    }
  },
  methods: {
    chartInit () {
      HighCharts.chart(this.id, this.chartOptions[this.chartType], this.callback)
    },
    getChartData () {
      let newData, newData2
      if (this.dataType === 'cpu') {
        newData = Number(this.data.cpu.usage)
      } else if (this.dataType === 'memory') {
        newData = Number(this.data.memory.usage)
      } else if (this.dataType === 'gpu') {
        newData = Number(this.data.gpus[0].gpu_usage)
      } else if (this.dataType === 'net') {
        newData = Number(this.data.net.in_load)
        newData2 = Number(this.data.net.out_load)
      }
      this.updateChartData(this.chartData, newData)
      if (this.dataType === 'net') {
        this.updateChartData(this.chartData2, newData2)        
      }

      this.chartInit()
    },
    updateChartData (dataArray, newData) {
      let array = dataArray
      array.splice(0, 1)
      array.push(newData)
      dataArray = array
    }
  },
  mounted () {
    this.chartInit()
    // this.getChartData()
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";

.cpt-chart {
  position: relative;
  .chart-container {

  }
  .x-label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: @secondaryTextColor;
    &.line {
      padding-right: 42px;
    }
  }
}
</style>