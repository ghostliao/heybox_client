<template>
  <div class="view-hardware">
    <div class="sidebar">
      <cpt-side-menu>
        <cpt-side-menu-item label="电脑概览" icon="client-fill" :to="{ name: 'hardware-info' }"></cpt-side-menu-item>
        <cpt-side-menu-item label="实时状态" icon="scan-fill" :to="{ name: 'hardware-status' }"></cpt-side-menu-item>
      </cpt-side-menu>
    </div>
    <div class="content">
      <keep-alive>
        <!-- <router-view></router-view> -->
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import {sideMenu, sideMenuItem} from "@/components/side-menu"

export default {
  name: "view-settings",
  components: {
    'cpt-side-menu': sideMenu,
    'cpt-side-menu-item': sideMenuItem

  },
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  mounted () {
    // console.log(this.$route)
  }
}
</script>

<style lang="less">
@import "../styles/import.less";
@sideBarWidth: 160px;
@sideBarOffset: 0;
.view-hardware {
  display: flex;
  height: 100%;
  .sidebar {
    position: fixed;
    top: @navHeight + 1px;
    left: @sideBarOffset;
    width: @sideBarWidth;
    height: 100%;
    background: rgba(0, 0, 0, .2);
    border-right: 1px solid fade(@textColor, 10%);
  }
  > .content {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding-left: @sideBarWidth + @sideBarOffset;
  }
}
</style>
