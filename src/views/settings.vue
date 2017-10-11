<template>
  <div class="view-settings">
    <div class="sidebar">
      <cpt-side-menu>
        <cpt-side-menu-item label="个人设置" icon="set-mine-data-thin" :to="{ name: 'settings-account' }"></cpt-side-menu-item>
        <cpt-side-menu-item label="录制设置" icon="set-video-thin" :to="{ name: 'settings-video' }"></cpt-side-menu-item>
      </cpt-side-menu>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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
    
  }
}
</script>

<style lang="less">
@import "../styles/import.less";
@sideBarWidth: 160px;
@sideBarOffset: 1px;
.view-settings {
  display: flex;
  height: 100%;
  .sidebar {
    position: fixed;
    top: 56px;
    left: @sideBarOffset;
    width: @sideBarWidth;
    height: 100%;
    background: rgba(0, 0, 0, .2);
    border-right: 1px solid fade(@textColor, 10%);
  }
}
</style>
