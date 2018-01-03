<template>
  <span>
    <transition name="mu-dialog-slide" @after-enter="show()" @after-leave="hide()">
      <div class="mu-dialog-wrapper" @click="handleWrapperClick" v-if="open" ref="popup" :style="{'z-index': zIndex}">
        <div class="mu-dialog" ref="dialog" :class="dialogClass">
          <div class="mu-dialog-close" v-if="cornerClose" @click="hide()">
            <cpt-icon-button icon="close" :iconSize="closeIconSize"></cpt-icon-button>
            <!-- <cpt-icon value="close-thin" :size="24"></cpt-icon> -->
          </div>
          <h3 class="mu-dialog-title" v-if="showTitle" ref="title" :class="headerClass">
            <slot name="title">
              {{title}}
            </slot>
          </h3>
          <div class="mu-dialog-body " :style="{ bodyStyle: optDialog }" :class="bodyClass" ref="elBody">
            <slot></slot>
          </div>
          <div class="mu-dialog-actions" v-if="showFooter" ref="footer" :class="footerClass">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </transition>
  </span>
</template>

<script>
import Popup from '../internal/popup'
import PopupManager from '../internal/popup/manager'
import {convertClass} from '../utils'
export default {
  mixins: [Popup],
  name: 'cpt-dialog',
  props: {
    dialogClass: {
      type: [String, Array, Object]
    },
    title: {
      type: String
    },
    titleClass: {
      type: [String, Array, Object]
    },
    bodyClass: {
      type: [String, Array, Object]
    },
    actionsContainerClass: {
      type: [String, Array, Object]
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    optDialog: {
      type: Boolean,
      default: false
    },
    cornerClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {
    bodyStyle () {
      return {
        'overflow-x': 'hidden',
        'overflow-y': this.scrollable ? 'auto' : 'hidden',
        '-webkit-overflow-scrolling': 'touch'
      }
    },
    showTitle () {
      return this.title || (this.$slots && this.$slots.title && this.$slots.title.length > 0)
    },
    showFooter () {
      return this.$slots && this.$slots.actions && this.$slots.actions.length > 0
    },
    headerClass () {
      const {scrollable} = this
      const classNames = []
      if (scrollable) classNames.push('scrollable')
      return classNames.concat(convertClass(this.titleClass))
    },
    footerClass () {
      const {scrollable} = this
      const classNames = []
      if (scrollable) classNames.push('scrollable')
      return classNames.concat(convertClass(this.actionsContainerClass))
    },
    closeIconSize () {
      if (this.dialogClass === 'delete-dialog' || this.dialogClass === 'msg-dialog') {
        return 16
      } else {
        return 24
      }
    }
  },
  mounted () {
    this.setMaxDialogContentHeight()
  },
  updated () {
    this.$nextTick(() => {
      this.setMaxDialogContentHeight()
    })
  },
  methods: {
    handleWrapperClick (e) {
      const wrapperEl = this.$refs.popup
      if (wrapperEl === e.target) PopupManager.handleOverlayClick()
    },
    setMaxDialogContentHeight () {
      const dialogEl = this.$refs.dialog
      if (!dialogEl) return
      if (!this.scrollable) {
        dialogEl.style.maxHeight = ''
        return
      }

      let maxDialogContentHeight = window.innerHeight - 2 * 64
      const { footer, title, elBody } = this.$refs
      if (footer) maxDialogContentHeight -= footer.offsetHeight
      if (title) maxDialogContentHeight -= title.offsetHeight
      if (elBody) {
        let maxBodyHeight = maxDialogContentHeight
        if (footer) maxBodyHeight -= footer.offsetHeight
        if (title) maxBodyHeight -= title.offsetHeight
        elBody.style.maxHeight = maxBodyHeight + 'px'
      }
      dialogEl.style.maxHeight = maxDialogContentHeight + 'px'
    },
    show () {
      this.$emit('show')
    },
    hide () {
      this.$emit('hide')
    }
  },
  watch: {
    open (newValue) {
      if (!newValue) return
      this.$nextTick(() => {
        this.setMaxDialogContentHeight()
      })
    }
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.mu-dialog-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mu-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 77%;
  // max-width: 768px;
  padding: 0;
  background-color: @darkDialogBackgroundColor;
  border: 1px solid @darkDialogBorderColor;
  // border-radius: 2px;
  font-size: 16px;
  .depth(5);
  &.opt-dialog {
    // max-width: 924px;
    border: none;
    .mu-dialog-body {
      padding: 0;
    }
  }
  &.video-player {
    border: none;
    width: 100%;
    height: 100%;
    background: #000;
    .mu-dialog-close {
      top: 60px;
    }
    .mu-dialog-body {
      padding: 0;
    }
  }
  &.image-checker {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    .mu-dialog-close {
      top: 60px;
    }
    .mu-dialog-body {
      width: 100%;
      height: 100%;
      padding: 0;
    }
  }
  &.msg-dialog {
    width: 360px;
    min-height: 170px;
    .mu-dialog-title {
      justify-content: center;
    }
    .mu-dialog-body {
      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        text-align: center;
        .cpt-mark {
          margin-bottom: @dialogPadding;
        }
      }
    }
  }
  &.moment-dialog {
    width: 900px;
    height: 80%;
    .mu-dialog-body {
      padding: 0;
      height: 100%;
    }
  }
}
.mu-dialog-close {
  position: absolute;
  z-index: 100;
  top: 12px;
  right: 12px;
  font-size: 0;
  color: fade(@textColor, 60%);
}

@dialogPadding: 24px;
.mu-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 24px 24px 20px;
  padding: @dialogPadding;
  margin: 0;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: @textColor;
  + .mu-dialog-body{
    padding-top: 0;
  }
  &.scrollable{
    border-bottom: 1px solid @lightBorderColor;
  }
}
.mu-dialog-body {
  flex: 1;
  // padding: 24px 24px 20px;
  padding: 0 @dialogPadding;
  color: fade(@textColor, 60%);
  font-size: 14px;
}

.mu-dialog-actions {
  min-height: 48px;
  padding: @dialogPadding;
  display: flex;
  align-items: center;
  justify-content: center;
  .mu-raised-button + .mu-raised-button{
    margin-left: 10px;
  }
  .cpt-button + .cpt-button {
    margin-left: 12px;
  }
  &.scrollable{
    border-top: 1px solid @lightBorderColor;
  }
}

.mu-dialog-slide-enter-active,
.mu-dialog-slide-leave-active{
  transition: opacity .45s @easeOutFunction;
  .mu-dialog {
    backface-visibility: hidden;
    transition: transform .45s @easeOutFunction;
  }
}
.mu-dialog-slide-enter,
.mu-dialog-slide-leave-active {
    opacity: 0;
}

.mu-dialog-slide-enter .mu-dialog{
  transform: translate3d(0, -64px, 0);
}
.mu-dialog-slide-leave-active .mu-dialog{
  transform: translate3d(0, 64px, 0);
}
</style>
