<template>
  <div class="cpt-set-switch setting-row">
    <div class="label-wrap">
      <div class="label">{{ label }}</div>
      <div class="desc">
        <slot name="desc"></slot>
      </div>
    </div>
    <div class="text-field-wrap">
      <cpt-switch label="" v-model="toggle" labelLeft class="demo-switch" @input="input" />
    </div>
  </div>
</template>

<script>
import cptTextField from '@/components/text-field'
import cptSwitch from '@/components/switch'


export default {
  name: "cpt-set-switch",
  components: {
    'cpt-text-field': cptTextField,
    'cpt-switch': cptSwitch
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    data: {
      type: Object
    },
    switch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      toggle: this.switch
    }
  },
  computed: {
  
  },
  watch: {
    switch (val) {
      this.toggle = val
    },
    toggle (val) {
      if (this.data) {
        const data = this.data
        this.$emit('input', [val, data.gameId, data.clientPath])
      } else {
        this.$emit('input', val)        
      }
      
    }
  },
  methods: {
    input (val) {
      this.toggle = val
    }
  },
  mounted () {
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-set-switch {
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
  .text-field-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 150px;
    .text-field {
      position: relative;
      width: 100%;
      height: 30px;
      line-height: 18px;
      font-size: 12px;
      color: fade(@textColor, 50%);
      background-color: @textFieldBackgroundColor;
      border: solid 1px @textFieldBorderColor;
      border-radius: 2px;
      text-align: center;
      padding: 5px 6px;
      margin-bottom: -2px;
      box-sizing: border-box;
    }
  }
}
</style>