<template>
  <div class="view-settings">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: "view-settings",
  components: {
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
@sideBarWidth: 0;
@sideBarOffset: 0;
.view-settings {
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
}
</style>
