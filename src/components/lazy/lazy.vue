<template>
  <div v-if="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'lazy',
  props: {
    time: Number
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    window.setTimeout(() => {
      this.show = true
    }, this.time)
  }
}

</script>