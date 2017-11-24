<template>
  <div class="fb-dialog-conversation-part">
    <div class="fb-dialog-conversation-part-wrap" :class="{ 'admin': data.is_user !== 1, 'user': data.is_user === 1 }">
      <div class="fb-dialog-conversation-admin-avatar" v-if="data.is_user !== 1">
        <div class="fb-dialog-conversation-admin-avatar-wrap">
          <img :src="adminAvatar">
        </div>
      </div>
      <div class="fb-dialog-conversation-msg">
        <div>{{data.text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
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

    }
  },
  methods: {
    
    
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
</style>