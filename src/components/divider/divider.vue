<template>
  <hr class="mu-divider" :class="{'inset': inset, 'shallow-inset': shallowInset, 'light': light}"/>
</template>

<script>
export default {
  name: 'mu-divider',
  props: {
    inset: {
      type: Boolean,
      default: false
    },
    shallowInset: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.mu-divider {
  margin: 0;
  height: 1px;
  border: none;
  background-color: fade(@fullBlack, 40%);
  // width: 100%;
  &.inset{
    margin-left: 72px;
  }
  &.shallow-inset{
    margin-left: 20px;
  }
  &.light {
    background-color: #2F3238;
    // background-color: fade(@fullBlack, 4%);
  }
  html.pixel-ratio-2 & {
    .transform(scaleY(0.5));
  }
  html.pixel-ratio-3 & {
    .transform(scaleY(0.33));
  }
}
</style>
