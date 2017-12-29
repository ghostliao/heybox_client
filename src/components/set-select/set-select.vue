<template>
  <div class="cpt-set-select setting-row">
    <div class="label-wrap">
      <div class="label">{{ label }}</div>
      <div class="desc">
        <slot name="desc"></slot>
      </div>
    </div>
    <div class="select-wrap">
      <cpt-select-field :select="currentSelect.label" fullWidth>
        <cpt-menu :autoWidth="false" :width="148">
          <cpt-menu-item v-for="(key, value) in selectList" :key="key" :title="key" :selectActive="currentSelect.value === value" @click="selectChanged(key, value)" />
        </cpt-menu>
      </cpt-select-field>
    </div>
  </div>
</template>

<script>
import {menu, menuItem} from '@/components/menu'
import Bus from '@/components/bus'

export default {
  name: "cpt-set-select",
  components: {
    'cpt-menu': menu,
    'cpt-menu-item': menuItem
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    settingType: {
      type: String,
      default: ''
    },
    selectList: {
      type: Object
    },
    currentSelectValue: {
      type: String
    }
  },
  data () {
    return {
      currentSelect: {
        label: '隐藏',
        value: this.currentSelectValue
      }
    }
  },
  watch: {
    currentSelectValue (value) {
      this.currentSelect.value = value
      this.currentSelect.label = this.selectList[value]
    }
  },
  methods: {
    selectChanged (key, value) {
      this.currentSelect.label = key
      this.currentSelect.value = value
      Bus.$emit('closeMenu')
      this.$emit('change', value)
      if (this.settingType === 'videoQuality') {
        this.__REPORT(`view_settings_video_quality_${value}`)
      }
    }
  },
  mounted () {
    
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-set-select {
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
  .select-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 150px;
  }
}
</style>