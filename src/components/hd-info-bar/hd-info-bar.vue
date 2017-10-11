<template>
  <div class="cpt-hd-info-bar setting-row">
    <div class="row row-1">
      <div class="col col-1">
        {{ label }}
      </div>
      <div class="col col-2">
        <slot name="desc"></slot>
      </div>
      <div class="col col-3">
        <span>{{point}}分，超越</span>
        <span class="percent wf-din">{{pointPercent}}%</span>
        <span>的电脑</span>
      </div>
      <div class="col col-4">
        <div class="switch" @click="dropRowSwitch">
          <span class="label">详情</span>
          <icon value="select-thin" v-if="!dropRowShow"></icon>
          <icon value="select-collapsing-th" v-else></icon>
        </div>
      </div>
    </div>
    <div class="drop-row" v-show="dropRowShow">
      <div class="box">
        <div class="unit" v-for="i in dropRowData" :key="i.k">
          <div class="v">{{i.v}}</div>
          <div class="k">{{i.k}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from '@/components/icon'
import cptTextField from '@/components/text-field'


export default {
  name: "cpt-hd-info-bar",
  components: {
    'icon': icon,
    'cpt-text-field': cptTextField
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    point: {
      type: Number,
      default: 0
    },
    pointPercent: {
      type: Number,
      default: 0
    },
    dropRowData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      dropRowShow: false
    }
  },
  computed: {
    
  },
  methods: {
    dropRowSwitch () {
      this.dropRowShow = !this.dropRowShow
    }
  },
  mounted () {

  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-hd-info-bar {
  color: @labelColor;
  font-size: 12px;
  padding: 14px 0 !important;
  @colUnitWidth: 114px;
  > .row-1 {
    display: flex;
    min-height: 20px;
    padding-right: 12px;
    > .col {
      display: flex;
      align-items: center;
    }
    > .col-1 {
      width: @colUnitWidth;
    }
    > .col-2 {
      flex: 1;
      min-width: 0;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      > div {
        line-height: 20px;
      }
    }
    > .col-3 {
      width: @colUnitWidth * 2;
      align-items: baseline;
      .percent {
        font-size: 18px;
        margin: 0 4px;
      }
    }
    > .col-4 {
      color: @descColor;
      width: @colUnitWidth;
      justify-content: flex-end;
      .switch {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .drop-row {
    padding: 10px 12px 0 @colUnitWidth;
    .box {
      display: flex;
      flex-wrap: wrap;
      background: fade(@fullBlack, 10%);
      padding: 4px 0;
      .unit {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 25%;
        height: 66px;
        line-height: 1;
        .v {
          font-size: 14px;
          color: fade(@textColor, 50%);
          margin-bottom: 8px;
        }
        .k {
          font-size: 12px;
          color: fade(@textColor, 20%);
        }
      }
    }
  }
}
</style>