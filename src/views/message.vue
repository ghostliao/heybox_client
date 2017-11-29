<template>
  <div class="view-message">
    <div class="wrapper">
      <cpt-set-block-head title="消息"></cpt-set-block-head>
      <div class="body">
        <cpt-set-block title="">
          <div class="setting-row" v-if="messageList.length <= 0">
            <div class="view-msg-list-notice">还没有收到任何消息</div>
          </div>
          <div class="setting-row" v-for="(i, index) of messageList" :key="index">
            <div class="view-msg-item-info">
              <div class="view-msg-item-type">{{i.msg_type}}</div>
              <div class="view-msg-item-time">{{i.time}}</div>
            </div>
            <div class="view-msg-item-content">
              <div class="view-msg-item-content-wrap">
                <span>{{i.msg_content}}</span><a :href="'//' + i.link" target="_blank" v-if="i.link">{{i.link}}</a>
              </div>
            </div>
          </div>
        </cpt-set-block>
      </div>
    </div>
  </div>
</template>

<script>
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'
import Bus from '@/components/bus'

export default {
  name: "view-message",
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead
  },
  data () {
    return {
      messageList: []
    }
  },
  methods: {
    getMessageList () {
      const url = '/pc/get_sys_msg'
      const options = {
        params: {
          heybox_id: this.$store.state.accountInfo.uid
        }
      }
      this.$ajax.get(url, options).then(res => {
        if (res.data.status === 'ok') {
          this.messageList = res.data.result
        }
      }, res => {

      })
    }
  },
  created () {
    this.getMessageList()
    Bus.$on('notifyMessageArrived', data => {
      this.getMessageList()      
    })
  }
}
</script>

<style lang="less">
@import "../styles/import.less";
.view-message {
  flex: 1;
  min-width: 0;
  padding: 16px 36px 16px;
  .wrapper {
    max-width: 500px;
    margin: auto;
    .cpt-set-block {
      padding-top: 0;
      user-select: text;
    }
  }
}

.view-msg-list-notice {
  font-size: 14px;
  line-height: 120px;
  text-align: center;
  color: @secondaryTextColor;
}
.view-msg-item-info {
  display: flex;
  line-height: 12px;
  padding: 6px 0 8px;
}
.view-msg-item-type {
  flex: 1;
  min-width: 0;
  color: @textColor;
  font-size: 12px;
}
.view-msg-item-time {
  color: @secondaryTextColor;  
  font-size: 12px;
}
.view-msg-item-content {}
.view-msg-item-content-wrap {
  font-size: 14px;
  line-height: 20px;
  a {
    color: @primaryColor;
    font-weight: 400;
    text-decoration: underline;
    margin-left: 5px; 
  }
}
</style>
