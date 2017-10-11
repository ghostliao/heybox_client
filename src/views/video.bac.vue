<template>
  <div class="view-video">
    <!-- <cpt-sidebar></cpt-sidebar> -->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import cptSidebar from "@/components/sidebar"

export default {
  name: "view-video",
  components: {
    'cpt-sidebar': cptSidebar
  },
  data () {
    return {
      
    }
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-video {
  display: flex;
  height: 100%;
  .main {
    flex: 1;
  }
}
</style>
