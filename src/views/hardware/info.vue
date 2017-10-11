<template>
  <div class="view-hardware-info">
    <!-- {{hardwareInfo}} -->
    <div class="content">
      <cpt-set-block-head title="电脑概览"></cpt-set-block-head>
      <div class="body">
        <template v-if="hardwareInfo.system">
          <cpt-set-block title="基本信息">
            <cpt-hd-info-bar label="系统" :point="14232" :pointPercent="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.system.name}}</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="主板" :point="14232" :pointPercent="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.board.name}}</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="处理器" :point="14232" :pointPercent="1234567890" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.cpu.name}} {{hardwareInfo.cpu.cores}}核</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="内存" :point="14232" :pointPercent="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{Math.round(hardwareInfo.memory.memory_size / 1024)}} GB（{{hardwareInfo.memory.vendor}} {{hardwareInfo.memory.type_name}} {{hardwareInfo.memory.clock_speed}}MHz）</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="主硬盘" :point="14232" :pointPercent="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.disks[0].name}}</div>
              </template>
            </cpt-hd-info-bar>

            <cpt-hd-info-bar label="显卡" :point="14232" :pointPercent="88" :dropRowData="cpuDetail">
              <template slot="desc">
                <div class="label">{{hardwareInfo.gpus[0].name}}（{{Math.round(hardwareInfo.gpus[0].memory_size / 1024)}} GB）</div>
              </template>
            </cpt-hd-info-bar>

          </cpt-set-block>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'
import cptHdInfoBar from '@/components/hd-info-bar'

export default {
  name: "view-hardware-info",
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-hd-info-bar': cptHdInfoBar
  },
  data () {
    return {
      hardwareInfo: {},
      cpuDetail: [
        {'k': 'CPU厂商', 'v': 'GenuineIntel'}
      ]
    }
  },
  methods: {
    getPreviewHardwareInfo () {
      maxjia.hardware.getPreviewHardwareInfo((data) => {
        // console.log(data)
        this.hardwareInfo = data
      })
    }
  },
  created () {
    this.getPreviewHardwareInfo()
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.view-hardware-info {
  .content {
    width: 784px;
    margin: auto;
    padding: 16px 0;
    > .body {
      
    }
  }
}
</style>