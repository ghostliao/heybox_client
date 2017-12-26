<template>
  <div class="cpt-set-slider setting-row">
    <div class="label-wrap">
      <div class="label">{{ label }}</div>
      <div class="desc">
        <slot name="desc"></slot>
      </div>
    </div>
    <div class="slider-wrap">
      <div class="value">{{value}}{{unit}}</div>
      <cpt-slider v-model="value" :min="min" :max="max" :step="step" noZero @input="change"></cpt-slider>
    </div>
  </div>
</template>

<script>
import cptTextField from '@/components/text-field'
import cptSlider from '@/components/slider'

export default {
  name: "cpt-set-slider",
  components: {
    'cpt-text-field': cptTextField,
    'cpt-slider': cptSlider
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    initValue: {
      type: Number
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: this.initValue
    }
  },
  watch: {
    initValue (val) {
      this.value = val
    }
  },
  methods: {
    change (val) {
      this.value = val
      this.$emit('change', val)
    }
  },
  mounted () {
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-set-slider {
  display: flex;
  .label-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
    .label {
      color: @labelColor;
    }
    .desc {
      color: @descColor;
    }
  }
  .slider-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 150px;
    .value {
      width: 24px;
      color: @labelColor;
    }
    .cpt-slider {
      flex: 1;
      min-width: 0;
      margin: 0 2px 0 15px;
    }
  }
}
</style>