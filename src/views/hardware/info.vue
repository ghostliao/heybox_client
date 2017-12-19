<template>
  <div class="view-hardware-info">
    <div class="content">
      <!-- <cpt-set-block-head title="电脑概览"></cpt-set-block-head> -->
      <div class="overview">
        <transition name="fade" mode="out-in">
          <div v-if="loading && !loadingFailed" key="loading" class="progress">
            <cpt-circular-progress :size="40" />
          </div>
        </transition>

        <div v-if="loadingFailed && !loading" class="notice">
          获取评分信息失败，<span @click="getHardwareEvalInfo">点击重试</span>
        </div>
        
        <!-- <div class="update">
          <cpt-icon value="reload-fill"></cpt-icon>
          <span class="label">2小时前更新</span>
        </div> -->
        <template v-if="!loading && !loadingFailed">
          <div class="row row-1">
            <span class="cpu">{{hardwareEvalInfo.cpu.show_key}}</span>
            <span class="gpu">{{hardwareEvalInfo.gpus.show_key}}</span>
            <span class="board">{{hardwareInfo.board.name}}</span>
          </div>
          <div class="row row-2">
            <div class="level wc-light grd">{{hardwareEvalInfo.avg_perf_level}}</div>
          </div>
          <!-- <div class="row row-3">
            超越 <span>98%</span> 用户
          </div> -->
        </template>
      </div>

      <div class="body">
        <template v-if="hardwareInfo.system">
          <cpt-set-block title="主要硬件">
            <cpt-hd-info-bar label="CPU" :level="hardwareEvalInfo.cpu.perf_level" :score="hardwareEvalInfo.cpu.score" :percentage="hardwareEvalInfo.cpu.percentage" rankList dropRow :dropRowData="hardwareEvalInfo.cpu.rank">
              <template slot="desc">
                <div class="desc">{{hardwareInfo.cpu.name}} {{hardwareInfo.cpu.cores}}&nbsp;核</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="显卡" :level="hardwareEvalInfo.gpus.perf_level" :score="hardwareEvalInfo.gpus.score" :percentage="hardwareEvalInfo.gpus.percentage" rankList dropRow :dropRowData="hardwareEvalInfo.gpus.rank">
              <template slot="desc">
                <div class="desc" v-for="(i, index) of hardwareInfo.gpus" :key="index">
                  <span>{{i.name}}</span>
                  <span v-if="i.memory_size !== 0">（{{Math.round(i.memory_size / 1024)}} GB）</span>
                </div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="硬盘" :level="hardwareEvalInfo.disks.perf_level" :score="hardwareEvalInfo.disks.score" :percentage="hardwareEvalInfo.disks.percentage" rankList dropRow :dropRowData="hardwareEvalInfo.disks.rank">
              <template slot="desc">
                <div class="desc" v-for="(i, index) of hardwareInfo.disks" :key="index">
                  {{i.name}}（{{Math.round(i.size / 1024 / 1024 / 1024)}} GB）
                </div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="内存" :level="hardwareEvalInfo.memory.perf_level" :score="hardwareEvalInfo.memory.score" :percentage="hardwareEvalInfo.memory.percentage" rankList>
              <template slot="desc">
                <div class="desc">
                  {{Math.round(hardwareInfo.memory.memory_size / 1024)}} GB（{{hardwareInfo.memory.vendor}} {{hardwareInfo.memory.type_name}} {{hardwareInfo.memory.clock_speed}}MHz）
                </div>
              </template>
            </cpt-hd-info-bar>

          </cpt-set-block>
        </template>

        <template v-if="hardwareInfo.system">
          <cpt-set-block title="基本信息">
            <cpt-hd-info-bar label="系统" :score="0" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.system.name}}</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="主板" :score="0" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.board.name}}</div>
              </template>
            </cpt-hd-info-bar>

            <!-- <cpt-hd-info-bar label="内存" :score="0" :percentage="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{Math.round(hardwareInfo.memory.memory_size / 1024)}} GB（{{hardwareInfo.memory.vendor}} {{hardwareInfo.memory.type_name}} {{hardwareInfo.memory.clock_speed}}MHz）</div>
              </template>
            </cpt-hd-info-bar> -->

            <!-- <cpt-hd-info-bar v-for="(i, index) of hardwareInfo.disks" :key="index" label="硬盘" :score="0" :percentage="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{i.name}}（{{Math.round(i.size / 1024 / 1024 / 1024)}} GB）</div>
              </template>
            </cpt-hd-info-bar> -->

            <!-- <cpt-hd-info-bar v-for="(i, index) of hardwareInfo.gpus" :key="index" label="显卡" :score="0" :percentage="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{i.name}}（{{Math.round(i.memory_size / 1024)}} GB）</div>
              </template>
            </cpt-hd-info-bar> -->

            <cpt-hd-info-bar v-for="(i, index) of hardwareInfo.displays" :key="index" v-if="index === 0" label="显示器" :score="0" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{i.name}}</div>
              </template>
            </cpt-hd-info-bar>

          </cpt-set-block>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'
import cptHdInfoBar from '@/components/hd-info-bar'
import cptCircularProgress from '@/components/circularProgress'

export default {
  name: "view-hardware-info",
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-hd-info-bar': cptHdInfoBar,
    'cpt-circular-progress': cptCircularProgress
  },
  data () {
    return {
      loading: true,
      loadingFailed: false,
      hardwareInfo: {},
      hardwareEvalInfo: {
        cpu: {
          perf_level: '-'
        },
        gpus: {
          perf_level: '-'
        },
        memory: {
          perf_level: '-'
        },
        disks: {
          perf_level: '-'
        }
      },
      cpuDetail: [
        {'k': 'CPU厂商', 'v': 'GenuineIntel'}
      ]
    }
  },
  computed: {
    cpuData () {
      return [
        {
          level: '-',
          percentage: 50,
          desc: `${this.hardwareInfo.cpu.name} ${this.hardwareInfo.cpu.cores} 核`
        }
      ]
    },
    gpuData () {
      let array = []
      for (let i in hardwareEvalInfo.gpus) {

      }
    }
  },
  methods: {
    ...mapActions([
      'openMsgDialog'
    ]),
    getPreviewHardwareInfo () {
      maxjia.hardware.getPreviewHardwareInfo((data) => {
        // console.table(data)
        this.hardwareInfo = data
      })
    },
    getHardwareEvalInfo () {
      this.loadingFailed = false
      this.loading = true
      const url = '/pc/hardware_info/web/'
      const options = {
        params: {
          'heybox_id': this.$store.state.accountInfo.uid,
          'os_type': 'pc'
        }
      }
      this.$ajax.get(url, options).then(res => {
        this.loading = false
        if (res.data.status === 'ok') {
          this.hardwareEvalInfo = res.data.result
          console.log(this.hardwareEvalInfo)
        } else {
          this.getEvalInfoFailed()
        }
      }, res => {
        this.getEvalInfoFailed()
      })
    },
    getEvalInfoFailed () {
      // this.openMsgDialog({
      //   msg: '获取评分信息失败',
      //   markType: 'fail'
      // })
      this.loadingFailed = true
      this.loading = false
    }
  },
  created () {
    this.getPreviewHardwareInfo()
    
  },
  mounted () {
    let count = 0
    let interval = setInterval(() => {
      if (count <= 50) {
        if (this.$store.state.accountInfo.uid !== 999999) {
          this.getHardwareEvalInfo()
          clearInterval(interval)
        } else {
          count ++
        }
      } else {
        this.openMsgDialog({
          msg: '请求账号信息失败',
          markType: 'fail'
        })
      }
    }, 100)
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.view-hardware-info {
  .view-scroller;
  .content {
    max-width: 1040px;
    // width: 808px;
    // margin: auto;
    padding: 6px 40px 40px;
    .overview {
      position: relative;
      padding: 20px 0;
      min-height: 121px;
      .notice {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        color: fade(@textColor, 60%);
        span {
          color: @primaryColor;
          // text-decoration: underline;
          cursor: pointer;
        }
      }
      .progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .update {
        position: absolute;
        top: 20px;
        right: 0;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: fade(@textColor, 60%);
      }
      > .row {
        display: flex;
        justify-content: center;
        &.row-1 {
          font-weight: 600;
          span {
            padding: 0 4px;
          }
          .board {
            color: fade(@textColor, 60%);
            font-weight: 400;
          }
        }
        &.row-2 {
          font-size: 54px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
        }
        &.row-3 {
          font-size: 14px;
          color: fade(@textColor, 60%);
          span {
            color: @primaryColor;
            padding: 0 4px;
          }
        }
      }
    }
    > .body {
      
    }
  }
}
</style>