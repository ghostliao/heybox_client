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
    <div v-show="$store.state.wallpaperControler.enabled" class="wallpaper-controler">
      <div class="wallpaper-controler-wrap">
        <cpt-button label="还原壁纸" small primary @click="removeWallpaper" />
        <cpt-button v-show="!$store.state.wallpaperControler.playing" label="播放" icon="start-fill" small primary @click="_wallpaperPlayerSwitch(1)" />
        <cpt-button v-show="$store.state.wallpaperControler.playing" label="暂停" icon="pause-fill" small primary @click="_wallpaperPlayerSwitch(0)" />

        <div class="wallpaper-volume">
          <cpt-icon-button v-show="$store.state.wallpaperControler.volumeSize !== 0" :icon="'volume'" @click="volumeMuted"></cpt-icon-button>
          <cpt-icon-button v-show="$store.state.wallpaperControler.volumeSize === 0" :icon="'volume-mute'" @click="resetVolumeSize"></cpt-icon-button>
          <cpt-slider v-model="$store.state.wallpaperControler.volumeSize" :step="1" @input="setVideoVolumeSize"></cpt-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {sideMenu, sideMenuItem} from "@/components/side-menu"
import wallpaperApi from '@/components/wallpaperFile'

export default {
  name: "view-wallpaper",
  mixins: [wallpaperApi],
  components: {
    'cpt-side-menu': sideMenu,
    'cpt-side-menu-item': sideMenuItem

  },
  data () {
    return {
      // wallpaperControler: false,
      // volumeSize: 100,
      // volumeSizeStore: 0,
      // playing: true // 播放、暂停
    }
  },
  methods: {
    _wallpaperPlayerSwitch (val) {
      this.wallpaperPlayerSwitch(val)
      this.$store.state.wallpaperControler.playing = !this.$store.state.wallpaperControler.playing
    },
    volumeMuted () {
      this.$store.state.wallpaperControler.volumeSizeStore = this.$store.state.wallpaperControler.volumeSize
      this.$store.state.wallpaperControler.volumeSize = 0
    },
    resetVolumeSize () {
      this.$store.state.wallpaperControler.volumeSize = this.$store.state.wallpaperControler.volumeSizeStore
    }
    
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

.wallpaper-controler {
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: 15px;
  width: 340px;
  margin: auto;
}
.wallpaper-controler-wrap {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,.75);
  padding: 0 15px;
  border-radius: 2px;
  .cpt-button {
    margin-right: 15px;
  }
}
.wallpaper-volume {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  width: 150px;
  padding: 15px 15px 15px 0;
  .cpt-slider {
    margin-left: 10px;
  }
}
</style>
