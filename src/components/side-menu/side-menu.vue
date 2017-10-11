<template>
  <div class="cpt-side-menu">
    <ul class="menu-list">
      <slot></slot>
    </ul>
  </div>
</template>

<script>

export default {
  name: "cpt-side-menu",
  components: {
    
  },
  data () {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-side-menu {
  .nav-list {
    width: 100%;
  }
}
</style>