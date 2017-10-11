<template>
  <li class="cpt-side-menu-item">
    <router-link :to="to" @click.native="saveRouter(to.name)">
      <cpt-icon :value="icon"></cpt-icon>
      <span class="label">{{label}}</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "cpt-side-menu-item",
  components: {

  },
  props: {
    label: {
      type: String
    },
    icon: {
      type: String
    },
    to: {
      type: Object
    }
  },
  data () {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    saveRouter (name) {
      const viewType = name.split('-')[0]
      if (viewType === 'settings') {
        this.$store.state.routerSettingsName = name
      } else if (viewType === 'hardware') {
        this.$store.state.routerHardwareName = name
      }
    }
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-side-menu-item {
  a {
    display: flex;
    align-items: center;
    height: 40px;
    color: fade(@textColor, 60%);
    font-size: 12px;
    padding-left: 16px;
    cursor: pointer;
    &.active {
      background-color: fade(@textColor, 8%);
      background-image: linear-gradient(to right, rgba(241, 242, 243, 0.16) 0%, rgba(241, 242, 243, 0.0) 50%);
    }
    .label {
      margin-left: 10px;
    }
  }
}
</style>