<template>
  <div class="view-settings-accelerator">
    <div class="wrapper">
      <cpt-set-block-head title="加速器设置"></cpt-set-block-head>
      <div class="body">
        <cpt-set-block title="">
          <div class="accelerator-table">
            <!-- <div class="th">
              <div class="td td-1">节点选择</div>
              <div class="td td-2">延迟</div>
              <div class="td td-3">状态</div>
            </div>
            <div class="tr">
              <div class="td td-1">香港北方联通152</div>
              <div class="td td-2">7</div>
              <div class="td td-3">繁忙</div>
            </div> -->
            <mu-table ref="table">
              <mu-thead>
                <mu-tr>
                  <mu-th thClass="col-1">节点选择</mu-th>
                  <mu-th thClass="col-2">延迟</mu-th>
                  <mu-th thClass="col-3">状态</mu-th>
                </mu-tr>
              </mu-thead>
              <mu-tbody>
                <mu-tr v-for="i in 4" :key="i">
                  <mu-td>香港北方联通152</mu-td>
                  <mu-td>7</mu-td>
                  <mu-td>繁忙</mu-td>
                </mu-tr>
              </mu-tbody>
            </mu-table>
          </div>
            
        </cpt-set-block>
      </div>
    </div>
  </div>
</template>

<script>
import cptSwitch from "@/components/switch"
import {cptSetBlock, cptSetBlockHead} from "@/components/set-block"

export default {
  name: "view-settings-accelerator",
  components: {
    'cpt-switch': cptSwitch,
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead
  },
  data () {
    return {
      switch1: true
    }
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-settings-accelerator {
  flex: 1;
  min-width: 0;
  padding: 16px 36px 16px;
  .wrapper {
    max-width: 500px;
    margin: auto;
  }
}

.accelerator-table {
  .col-1 {
    width: 50%;
  }
  .col-2 {
    width: 25%;
  }
  .col-3 {
    width: 25%;
  }
}
</style>
