<template>
  <div class="cpt-media-list-manage-bar">
    <div class="cpt-media-list-manage-bar-wrap">
      <div class="time-list-switch" @click="toggleManageBar">
        <div class="date label">{{ data.createTimeStamp | formDate(5) }}</div>
        <cpt-icon :value="arrowIcon"></cpt-icon>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/components/bus'

export default {
  name: 'cpt-manage-bar',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      manageBarOpen: true
    }
  },
  computed: {
    arrowIcon () {
      return this.manageBarOpen ? 'arrow-up' : 'arrow-down'
    }
  },
  methods: {
    toggleManageBar () {
      this.manageBarOpen = !this.manageBarOpen
      Bus.$emit('toggleManageBar', [this.data.createTimeStamp])
    }
  },
  created () {
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-media-list-manage-bar {
  width: 100%;
  padding-top: 12px;
}
.cpt-media-list-manage-bar-wrap {
  display: flex;
  height: 40px;
  .time-list-switch {
    display: flex;
    align-items: center;
    cursor: pointer;
    .date {
      // font-family: 'DIN';
      // font-size: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .iconfont {
      position: relative;
      top: 1px;
      color: fade(@textColor, 60%);
    }
  }
}

</style>