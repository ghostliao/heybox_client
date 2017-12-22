<template>
  <div class="view-wallpaper">
    <div class="view-wallpaper-sidebar">
      <cpt-side-menu>
        <cpt-side-menu-item label="桌面商城" icon="client-fill" :to="{ name: 'wallpaper-store' }"></cpt-side-menu-item>
        <cpt-side-menu-item label="本地桌面" icon="download-fill" :to="{ name: 'wallpaper-local' }"></cpt-side-menu-item>
      </cpt-side-menu>
    </div>
    <div class="view-wallpaper-content">
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
  name: "view-wallpaper",
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
.view-wallpaper {
  display: flex;
  height: 100%;
}
.view-wallpaper-sidebar {
  position: fixed;
  top: @navHeight + 1px;
  left: @sideBarOffset;
  bottom: 0;
  width: @sideBarWidth;
  background: rgba(0, 0, 0, .2);
  border-right: 1px solid fade(@textColor, 10%);
}
.view-wallpaper-content {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding-left: @sideBarWidth + @sideBarOffset;
}
</style>
