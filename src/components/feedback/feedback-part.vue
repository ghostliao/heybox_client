<template>
  <div class="fb-dialog-conversation-part">
    <div class="fb-dialog-conversation-part-wrap" :class="{ 'admin': data.is_user !== 1, 'user': data.is_user === 1 }">
      <div class="fb-dialog-conversation-admin-avatar" v-if="data.is_user !== 1">
        <div class="fb-dialog-conversation-admin-avatar-wrap">
          <img :src="adminAvatar">
        </div>
      </div>
      <div class="fb-dialog-conversation-msg" v-if="data.info_type === 'text'">
        <div>{{data.text}}</div>
      </div>
      <div class="fb-dialog-conversation-img" v-if="data.info_type === 'image'">
        <div class="fb-dialog-conversation-status" v-show="!imageLoaded">
          <cpt-circular-progress :size="24"></cpt-circular-progress>
        </div>
        <div class="fb-dialog-conversation-img-wrap" v-show="imageLoaded" ref="imageWrap">
          <img :src="data.img.url" @load="onImageLoaded" @click="checkImage(data.img.url)" ref="image">
        </div>
      </div>
      <div class="fb-dialog-conversation-fail" v-if="data.fail && data.is_user === 1">发送失败</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'cpt-feedback-part',
  props: {
    data: {
      type: Object
    },
    adminAvatar: {
      type: String
    }
  },
  data () {
    return {
      imageLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'checkImageFile'
    ]),
    onImageLoaded () {
      const h = this.$refs.image.naturalHeight
      if (h < 134) {
        this.$refs.imageWrap.style.height = h + 4 + 'px'
      }
      this.imageLoaded = true
    },
    checkImage (url) {
      this.checkImageFile({
        'file': url
      })
    }
  },
  created () {

  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.fb-dialog-conversation-part {
  .clearfix;
  margin-bottom: 10px;
}
.fb-dialog-conversation-time {
  font-size: 12px;
  color: @secondaryTextColor;
  line-height: 36px;
  text-align: center;
}
.fb-dialog-conversation-part-wrap {
  position: relative;
  max-width: 75%;
  &.admin {
    float: left;
    padding-left: 40px;
    .fb-dialog-conversation-msg {
      background: @darkDialogBackgroundColor;
    }
  }
  &.user {
    float: right;
    .fb-dialog-conversation-msg {
      background: fade(@primaryColor, 80%);
    }
  }
}
.fb-dialog-conversation-admin-avatar {
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 4px;
}
.fb-dialog-conversation-admin-avatar-wrap {
  border-radius: 50%;
  // overflow: hidden;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
}
.fb-dialog-conversation-msg {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  border-radius: 4px;
  word-wrap: break-word;
}
.fb-dialog-conversation-img {
  
}
.fb-dialog-conversation-status {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 246px;
  height: 138px;
  background: #23282d;
  border-radius: 4px;
}
.fb-dialog-conversation-img-wrap {
  height: 138px;
  padding: 2px;
  background: #23282d;
  border-radius: 4px;  
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
  }
}
.fb-dialog-conversation-fail {
  font-size: 12px;
  color: #e62a32;
  line-height: 24px;
  text-align: right;
}
</style>