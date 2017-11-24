<template>
  <div class="cpt-feedback">
    <transition name="fade-rotate">
      <div class="fb-switch" v-if="!fbDialog" @click="fbDialogToggle">
        <cpt-icon value="chat-fill"></cpt-icon>
      </div>
    </transition>
    <transition name="fade-rotate">
      <div class="fb-switch" v-if="fbDialog" @click="fbDialogToggle">
        <cpt-icon value="close"></cpt-icon>
      </div>
    </transition>

    <transition name="fade">
      <div class="fb-dialog" v-if="fbDialog">
        <transition name="fade" mode="out-in">
          <div class="progress" v-if="loading" key="loading">
            <cpt-circular-progress :size="40" />
          </div>
        </transition>
        <div class="fb-dialog-wrap">
          <div class="fb-dialog-header">
            <div class="fb-dialog-header-wrap">
              <div class="fb-dialog-admin-info">
                <div class="fb-dialog-admin-avatar">
                  <div class="fb-dialog-admin-avatar-wrap">
                    <img :src="adminAvatar">
                    <!-- <img src="https://static.intercomassets.com/avatars/1156593/square_128/timg-1-1511335537.jpg?1511335537"> -->
                  </div>
                </div>
                <div class="fb-dialog-admin-name">
                  <div>小黑妹</div>
                </div>
                <div class="fb-dialog-admin-desc">
                  <div>通常在几小时内回复</div>
                </div>
              </div>
            </div>
          </div>

          <div class="fb-dialog-body" ref="scroll" v-show="!loading">
            <div class="fb-dialog-conversation" ref="wrap">
              <div class="fb-dialog-conversation-wrap">
                <template v-for="(i, index) of conversationList">
                  <div class="fb-dialog-conversation-time" :key="index" v-if="index === 0">{{filterFormDate(conversationList[0].create_at, 6)}}</div>
                  <div class="fb-dialog-conversation-time" :key="index" v-show="conversationList[index - 1] && filterFormDate(conversationList[index - 1].create_at, 6) !== filterFormDate(conversationList[index].create_at, 6)">{{filterFormDate(i.create_at, 6)}}</div>
                  <cpt-feedback-part :key="index" :data="i" :adminAvatar="adminAvatar"></cpt-feedback-part>
                </template>
              </div>
            </div>
          </div>

          <div class="fb-dialog-footer">
            <div class="fb-dialog-composer">
              <pre>{{composerContent}}<br></pre>
              <textarea placeholder="写出你想说的话" spellcheck="false" v-model="composerContent" @keydown="keydown" ref="composer"></textarea>
              <div class="send">
                <cpt-icon-button icon="optimization-fill" :iconSize="20" @click="sendMsg"></cpt-icon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import cptFeedbackPart from './feedback-part'

export default {
  name: 'cpt-feedback',
  components: {
    'cpt-feedback-part': cptFeedbackPart
  },
  props: {
    
  },
  data () {
    return {
      fbDialog: false,
      loading: true,
      conversationList: [],
      adminAvatar: '',
      composerContent: ''
    }
  },
  watch: {
    fbDialog (newValue, oldValue) {
      if (!oldValue && newValue) {
        this.getConversationList().then(() => {
          this.$refs.composer.focus()
        })
      }
    },
    conversationList: {
      deep: false,
      handler (newValue, oldValue) {
        this.$nextTick(() => {
          if (!this.fbDialog) return
          this.scrollHandler()
        })
      }
    }
  },
  methods: {
    fbDialogToggle () {
      this.fbDialog = !this.fbDialog
    },
    getConversationList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        const url = '/bbs/app/feedback/list'
        const options = {
          withCredentials: false,
          params: {
            'os_type': 'win',
            'heybox_id': this.$store.state.accountInfo.uid,
            'offset': 0,
            'limit': 30
          }
        }
        this.$ajax.get(url, options).then(res => {
          this.loading = false
          resolve(res)

          const data = res.data
          // console.log(data)
          if (data.status === 'ok') {
            this.adminAvatar = data.hey_mei.avartar
            this.conversationList = data.result.reverse()
          } else {
  
          }
        },res => {
  
        })
      })
    },
    // enter 发送，shift + enter 换行
    keydown (e) {
      if (e.keyCode === 13) {
        if (e.shiftKey) {
          return
        } else {
          e.preventDefault()
          this.sendMsg()
        }
      }
    },
    sendMsg () {
      const msg = this.composerContent
      if (msg === '') return

      const url = '/bbs/app/feedback/post'
      const timeStamp = new Date().getTime() / 1000
      const data = this.qs.stringify({
        'text': msg,
        // 'send_timestamp': timeStamp
      })
      const options = {
        method: 'post',
        withCredentials: false,
        params: {
          'os_type': 'win',
          'heybox_id': this.$store.state.accountInfo.uid
        },
        data: data
      }
      this.$ajax(url, options).then(res => {
        console.log(res)
        const data = res.data
        if (data.status === 'ok') {
          const item = {
            create_at: timeStamp,
            is_user: 1,
            text: msg
          }
          this.conversationList.push(item)
          console.log(item)
        } else {

        }
      }, res => {})


      this.composerContent = ''
      console.log(msg)
    },
    scrollHandler () {
      this.$refs.scroll.scrollTop = this.$refs.wrap.clientHeight
    }
  },
  created () {
    // this.getConversationList()
  },
  mounted () {

  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-feedback {
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: @feedback;
  .fb-switch {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: @primaryColor;
    cursor: pointer;
    .depth(3);
  }
  .fb-dialog {
    position: fixed;
    right: 15px;
    bottom: 40px + 15px + 15px;
    z-index: @feedback;
    .progress {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .fb-dialog-wrap {
    position: relative;
    width: 370px;
    height: 500px;
    background: @darkColor;
    border-radius: 10px;
    overflow: hidden;
    .depth(3);
  }
  .fb-dialog-header {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: fade(@primaryColor, 80%);
    .depth(2);
  }
  .fb-dialog-header-wrap {
    position: relative;
    padding: 12px 18px;
  }
  .fb-dialog-admin-info {
    position: relative;
    padding-left: 48px;
  }
  .fb-dialog-admin-avatar {
    position: absolute;
    top: 0;
    left: 0;
  }
  .fb-dialog-admin-avatar-wrap {
    border-radius: 50%;
    // overflow: hidden;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }
  .fb-dialog-admin-name {
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    .ellipsis;
  }
  .fb-dialog-admin-desc {
    font-size: 12px;
    line-height: 16px;
    color: fade(#fff, 60%);
    .ellipsis;    
  }
  .fb-dialog-body {
    position: absolute;
    z-index: 1;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow-y: scroll;
    user-select: text;
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: fade(#f1f2f3, 10%);
      }
    }
  }
  .fb-dialog-conversation {

  }
  .fb-dialog-conversation-wrap {
    padding: 18px;
    font-weight: 400;
  }
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
  .fb-dialog-footer {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .fb-dialog-composer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 60px;
    max-height: 200px;
    pre {
      visibility: hidden;
      margin: 0;
    }
    pre, textarea {
      width: 100%;
      height: 100%;
      padding: 18px;
      padding-right: 20px + 18px + 18px;
      font-size: 14px;
      line-height: 24px;
      box-sizing: border-box;
      white-space: pre;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    textarea {
      position: absolute;
      left: 0;
      bottom: 0;
      background: @textFieldBackgroundColor;
      border: none;
      resize: none;
      color: @textColor;
      &::-webkit-input-placeholder {
        color: @secondaryTextColor;
      }
    }
    .send {
      position: absolute;
      top: 18px;
      right: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
    }
  }
}

</style>