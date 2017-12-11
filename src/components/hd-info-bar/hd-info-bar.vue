<template>
  <div class="cpt-hd-info-bar setting-row">
    <div class="row row-1">
      <div class="col col-1">
        <div class="label">{{ label }}</div>
      </div>
      <div class="col col-2">
        <div v-if="level" class="level wf-din wc-light grd">
          <div>{{ level_ }}</div>
        </div>
      </div>
      <div class="col col-center">
        <div class="row">
          <div class="col col-2">
            <!-- <div class="desc">{{ i.desc }}</div> -->
            <slot name="desc"></slot>
          </div>
        </div>
      </div>
      <div class="col col-3">
        <!-- <div class="score">
          <span v-if="score !== 0">{{score}}</span>
        </div> -->
        <div class="rate">
          <cpt-linear-progress v-if="percentage" mode="determinate" :value="percentage"/>
        </div>
        <!-- <span>{{score}}分，超越</span>
        <span class="percent wf-din">{{percentage}}%</span>
        <span>的电脑</span> -->
      </div>
      <div class="col col-4">
        <div class="switch" v-if="dropRow" v-show="percentage" @click="dropRowSwitch">
          <span class="label" v-if="rankList">排名</span>
          <span class="label" v-if="!rankList">详情</span>
          <icon value="arrow-down" v-if="!dropRowShow"></icon>
          <icon value="arrow-up" v-else></icon>
        </div>
      </div>
    </div>
    <div class="drop-row-rank" v-if="rankList" v-show="dropRowShow">
      <div class="box">
        <div class="unit" v-for="(i, index) of dropRowData" :key="index" v-show="showAll || index < 5">
          <div class="col col-1">
            <div>{{ index + 1 }}</div>
          </div>
          <div class="col col-2">
            <span class="desc">{{i.name}}</span>
          </div>
          <div class="col col-3">
            <!-- <div class="score">
              <span>{{i.score}}</span>
            </div> -->
            <div class="rate">
              <cpt-linear-progress mode="determinate" :value="i.percentage" light/>
            </div>
          </div>
          <div class="col col-4"></div>
        </div>
        <div class="more" v-show="!showAll" @click="showAllRank">
          查看完整排行
        </div>
      </div>
    </div>
    <div class="drop-row-detail" v-if="!rankList" v-show="dropRowShow">
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
    level: {
      type: String,
      default: ''
    },
    data: {
      type: [Object, Array]
    },
    score: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    rankList: {
      type: Boolean,
      default: false
    },
    dropRow: {
      type: Boolean,
      default: false
    },
    dropRowData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      level_: '',
      dropRowShow: false,
      showAll: false
    }
  },
  computed: {
    dataList () {
      if (typeof this.data === 'object') {
        // console.log('dataList: object')
        return [this.data]
      } else if (typeof this.data === 'array') {
        // console.log('dataList: array')
        return this.data
      } else {
        // console.log(typeof this.data)
        return 'dataList: undefined'
      }
    }
  },
  watch: {
    level (value) {
      this.level_ = value
    }
  },
  methods: {
    dropRowSwitch () {
      this.dropRowShow && (this.showAll = false)
      this.dropRowShow = !this.dropRowShow
    },
    showAllRank () {
      this.showAll = true
    }
  },
  mounted () {

  }
}

</script>
<style lang="less">
@import "../../styles/import.less";

.cpt-hd-info-bar {
  color: fade(@textColor, 80%);
  font-size: 13px;
  padding: 14px 0 !important;
  user-select: text;
  @colUnitWidth: 114px;
  .row-col-2-style {
    flex: 1;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .row-col-3-style {
    // width: @colUnitWidth * 2;
    flex: 1;
    min-width: 0;
    padding-left: 20px;
  }
  > .row-1 {
    display: flex;
    min-height: 20px;
    padding-right: 12px;
    > .col {
      display: flex;
      align-items: center;
      &.col-1 {
        width: @colUnitWidth - 50px;
        display: flex;
        .label {
          flex: 1;
          min-width: 0;
          line-height: 16px;
        }
      }
      &.col-2 {
        width: 50px;
        font-size: 24px;
        > div {
          display: flex;
          justify-content: center;
          // width: 12px;
        }
      }
      &.col-3 {
        .row-col-3-style;
        display: flex;
        .score {
          width: 30px;
          text-align: right;
        }
        .rate {
          flex: 1;
          min-width: 0;
          padding-left: 12px;
        }
        .percent {
          font-size: 18px;
          margin: 0 4px;
        }
      }
      &.col-4 {
        color: fade(@textColor, 40%);
        width: @colUnitWidth;
        justify-content: flex-end;
        .switch {
          display: flex;
          align-items: center;
          font-weight: 400;
          line-height: 16px;
          cursor: pointer;
          .iconfont {
            color: fade(@textColor, 60%);
          }
        }
      }
    }
    

    > .col-center {
      flex: 1;
      min-width: 0;
      flex-direction: column;
      > .row {
        display: flex;
        width: 100%;
        padding: 4px 0;
        > .col {
          display: flex;
          align-items: center;
          &.col-2 {
            .row-col-2-style;
            > .desc {
              line-height: 20px;
              margin-bottom: 10px;
              &:last-of-type {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
  .drop-row-rank {
    padding-top: 12px;
    .box {
      border-top: 1px solid @blockDividerColor;
      padding-top: 12px;
      .unit {
        display: flex;
        padding: 0 12px 0 64px;
        min-height: 35px;
        color: fade(@textColor, 40%);
        &:last-of-type {
          border-color: transparent;
        }
        > .col {
          display: flex;
          align-items: center;
          &.col-1 {
            width: 50px;
            > div {
              display: flex;
              justify-content: center;
              width: 12px;
            }
          }
          &.col-2 {
            .row-col-2-style;
            .desc {
              line-height: 20px;
            }
          }
          &.col-3 {
            .row-col-3-style;
            display: flex;
            .score {
              width: 30px;
              text-align: right;
            }
            .rate {
              flex: 1;
              min-width: 0;
              padding-left: 12px;
            }
          }
          &.col-4 {
            width: @colUnitWidth;
          }
        }
      }
      .more {
        color: fade(@textColor, 40%);
        font-size: 12px;
        font-weight: 400;
        width: 120px;
        line-height: 28px;
        border-radius: 2px;
        margin: auto;
        text-align: center;
        cursor: pointer;
        &:hover {
          background: fade(#000, 40%);
        }
      }
    }
  }
  .drop-row-detail {
    padding: 10px 12px 0 @colUnitWidth;
    .box {
      display: flex;
      flex-wrap: wrap;
      background: fade(@fullBlack, 20%);
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
          font-size: 16px;
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