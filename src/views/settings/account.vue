<template>
  <div class="view-settings-account">
    <div class="wrapper">
      <cpt-set-block-head title="个人设置"></cpt-set-block-head>
      <div class="body">
        <cpt-set-block title="test">
          <div class="setting-row">
            <cpt-switch label="开关" class="demo-switch" /><br/>
            <cpt-switch label="默认为 true" v-model="switch1" class="demo-switch" /><br/>
            <!-- <cpt-switch label="不可用" disabled class="demo-switch" /><br/> -->
            <cpt-switch label="文字在左边" labelLeft class="demo-switch" />
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
  name: "view-settings-account",
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
.view-settings-account {
  flex: 1;
  min-width: 0;
  padding: 16px 36px 16px 236px;
  .wrapper {
    max-width: 500px;
    margin: auto;
  }
}
</style>
