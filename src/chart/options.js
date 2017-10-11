import Highcharts from 'highcharts'

export default {
  line: {
    option: {
      chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: 'rgba(0, 0, 0, 0.1)',
        spacing: [24, 0, 15, 0],
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
        categories: ['60秒', '', '', '', '', '', '', '', '', '0'],
        labels: {
          x: 10,
          autoRotation: false,
          style: {
            'font-family': 'microsoft yahei',
            'font-weight': '400'
          }
        },
        tickLength: 0,
        lineWidth: 0,
        gridLineWidth: 0,
        gridLineColor: 'rgba(0, 0, 0, 0.06)',
        alternateGridColor: 'rgba(0, 0, 0, 0.06)'
      },
      yAxis: {
        title: {
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
          enabled: false
        },
        gridLineColor: 'rgba(255, 255, 255, 0.04)',
        max: 100,
        min: 0,
        tickAmount: 6
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
          data: [0, 6.9, 9.5, 14.5, 18.2, 100, 25.2, 26.5, 23.3, 18.3],
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
    callback: function () {

    }
  },
  doughnut: {
    option: {},
    callback: function (c) {
      
    }
  }
}