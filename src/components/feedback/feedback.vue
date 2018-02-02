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
                <div class="fb-dialog-faq-enter" @click="showFaq">
                  <span>常见问题</span>
                  <cpt-icon value="explain-fill"></cpt-icon>
                </div>
                <div class="fb-dialog-admin-avatar">
                  <div class="fb-dialog-admin-avatar-wrap">
                    <!-- <img :src="adminAvatar"> -->
                    <img src="http://cdn.max-c.com/@/heybox/imgs/e52c7a9444958b36a42a597543a9f9c9">
                  </div>
                </div>
                <div class="fb-dialog-admin-name">
                  <div>小黑妹</div>
                </div>
                <div class="fb-dialog-admin-desc">
                  <div>我们将会在第一时间为您解决问题</div>
                </div>
              </div>
            </div>
          </div>

          <div class="fb-dialog-body" ref="scroll" v-show="!loading">
            <div class="fb-dialog-conversation" ref="wrap">
              <div class="fb-dialog-conversation-wrap">
                <div class="fb-dialog-conversation-notice" v-if="conversationList.length >= 30">仅展示最近30条信息</div>
                <template v-for="(i, index) of conversationList">
                  <div class="fb-dialog-conversation-time" :key="index" v-if="index === 0">{{filterFormDate(conversationList[0].create_at, 6)}}</div>
                  <div class="fb-dialog-conversation-time" :key="index" v-if="conversationList[index - 1] && filterFormDate(conversationList[index - 1].create_at, 6) !== filterFormDate(conversationList[index].create_at, 6)">{{filterFormDate(i.create_at, 6)}}</div>
                  <cpt-feedback-part :key="index" :data="i" :adminAvatar="adminAvatar"></cpt-feedback-part>
                </template>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="fb-dialog-upload-status" v-if="uploadStatus">
              <div class="fb-dialog-upload-status-wrap">
                <div v-show="uploadStatus === 'uploading'">正在发送图片</div>
                <div v-show="uploadStatus === 'success'">图片发送成功</div>
                <div v-show="uploadStatus === 'imgFail'">图片发送失败</div>
                <div v-show="uploadStatus === 'msgFail'">消息发送失败</div>
                <div v-show="uploadStatus === 'sizeLimit'">请发送小于3M的文件</div>
              </div>
            </div>
          </transition>

          <div class="fb-dialog-footer">
            <div class="fb-dialog-composer">
              <pre>{{composerContent}}<br></pre>
              <textarea placeholder="请尽可能详细的描述你的问题" spellcheck="false" v-model="composerContent" @keydown="keydown" ref="composer"></textarea>
              <div class="send">
                <cpt-icon-button icon="picture-fill" :iconSize="20" @click="uploadImage"></cpt-icon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { UploaderBuilder, Uploader } from 'qiniu4js'

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
      uploadStatus: '', // uploading, success, fail
      postMsg: '',
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
      if (!this.fbDialog) {
        this.__REPORT('view_feedback')
      }
      this.fbDialog = !this.fbDialog
    },
    getConversationList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        const url = '/bbs/app/feedback/list'
        const options = {
          params: {
            'os_type': 'pc',
            'heybox_id': this.$store.state.accountInfo.uid,
            'offset': 0,
            'limit': 30
          }
        }
        this.$ajax.get(url, options).then(res => {
          this.loading = false
          resolve(res)

          const data = res.data
          console.log(data)
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
          // this.addConversationItem()
          this.postFeedback()
        }
      }
    },
    addConversationItem (imgUrl) {
      const timeStamp = new Date().getTime() / 1000
      let item = {}
      if (imgUrl) {
        item = {
          info_type: "image",
          create_at: timeStamp,
          is_user: 1,
          text: this.postMsg,
          img: {
            url: imgUrl
          },
        }
      } else {
        item = {
          info_type: "text",
          create_at: timeStamp,
          is_user: 1,
          text: this.postMsg
        }
      }
      this.conversationList.push(item)
      console.log(item)
    },
    postFeedback (imgUrl) {
      this.postMsg = this.composerContent
      if (!imgUrl && this.postMsg === '') return

      const url = '/bbs/app/feedback/post'
      let data = ''
      if (imgUrl) {
        data = this.qs.stringify({
          'img_str': imgUrl,
          'clientVersion': maxjia.maxapi.version
        })
      } else {
        data = this.qs.stringify({
          'text': this.postMsg,
          'clientVersion': maxjia.maxapi.version,
          // 'send_timestamp': timeStamp
        })
      }
      const options = {
        method: 'post',
        params: {
          'os_type': 'pc',
          'heybox_id': this.$store.state.accountInfo.uid
        },
        data: data
      }
      this.$ajax(url, options).then(res => {
        console.log(res)
        const data = res.data
        if (data.status === 'ok') {
          if (imgUrl) {
            this.uploadStatusUpdate('success')
            this.addConversationItem(imgUrl)
          } else {
            this.addConversationItem()
            this.composerContent = ''            
          }
        } else {
          if (imgUrl) {
            this.uploadStatusUpdate('imgFail')
          } else {
            this.uploadStatusUpdate('msgFail')
          }
        }
      }, res => {
        if (imgUrl) {
          this.uploadStatusUpdate('imgFail')
        } else {
          this.uploadStatusUpdate('msgFail')
        }
      })


      // this.composerContent = ''
      console.log(this.postMsg)
    },
    scrollHandler () {
      this.$refs.scroll.scrollTop = this.$refs.wrap.clientHeight
    },
    uploadStatusUpdate (status) {
      this.uploadStatus = status
      if (status === 'uploading') {
        return
      } else {
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      }
    },
    uploadInit () {
      const self = this
      this.uploader = new UploaderBuilder()
      .debug(true)//开启debug，默认false
      .domain({http: "http://upload.qiniu.com", https: "https://up.qbox.me"})//默认为{http: "http://upload.qiniu.com", https: "https://up.qbox.me"}
      .scheme("https")//默认从 window.location.protocol 获取，可以通过指定域名为 "http://img.yourdomain.com" 来忽略域名选择。
      .retry(0)//设置重传次数，默认0，不重传
      //.compress(0.5)//默认为1,范围0-1
      //.scale([200,0])//第一个参数是宽度，第二个是高度,[200,0],限定高度，宽度等比缩放.[0,100]限定宽度,高度等比缩放.[200,100]固定长宽
      .size(1024*1024)//分片大小，最多为4MB,单位为字节,默认3MB
      .chunk(true)//是否分块上传，默认true，当chunk=true并且文件大于4MB才会进行分块上传
      .auto(true)//选中文件后立即上传，默认true
      .multiple(false)//是否支持多文件选中，默认true
      .accept(['image/png','image/jpeg','image/gif'])//过滤文件，默认无，详细配置见http://www.w3schools.com/tags/att_input_accept.asp
      .tokenShare(false)//在一次上传队列中，是否分享token,如果为false每上传一个文件都需要请求一次Token，默认true
      .tokenFunc(function (setToken, task) {
        self.uploadStatusUpdate('uploading')
        

        //token获取函数，token获取完成后，必须调用`setToken(token);`不然上传任务不会执行。
        //为每一个上传的文件指定key,如果不指定则由七牛服务器自行处理
        const getTokenUrl = self.$store.state.origin[self.$store.state.config.env] + '/bbs/qiniu/web/token'
        const data = self.qs.stringify({
          'heybox_id': self.$store.state.accountInfo.uid
        })
        const options = {
          method: 'post',
          params: {
            'os_type': 'pc',
            'heybox_id': self.$store.state.accountInfo.uid
          },
          data
        }
        self.$ajax(getTokenUrl, options).then(res => {
          console.log(res)
          setToken(res.data.uptoken)
        }, res => {
          self.uploadStatusUpdate('imgFail')
        }).catch((res) => {
          console.log(res)
        })
      })
      // .saveKey(true)
      //任务拦截器
      .interceptor({
        //拦截任务,返回true，任务将会从任务队列中剔除，不会被上传
        onIntercept: function (task) {
          // console.log(task.file.size)
          return task.file.size > 1024 * 1024 * 3;
          // 最大3M
        },
        //中断任务，返回true，任务队列将会在这里中断，不会执行上传操作。
        onInterrupt: function (task) {
          if (this.onIntercept(task)) {
            self.uploadStatusUpdate('sizeLimit')
            return true;
          } else {
            return false;
          }
        },
      })
      //你可以添加多个任务拦截器
      //.interceptor({...})
      .listener({
        onReady (tasks) {
          //该回调函数在图片处理前执行,也就是说task.file中的图片都是没有处理过的
          //选择上传文件确定后,该生命周期函数会被回调。
          // console.log(tasks)
          console.log('upload ready')

        }, onStart (tasks) {
          //所有内部图片任务处理后执行
          //开始上传
          console.log('upload start')
        }, onTaskGetKey (task,key) {
          self.contentMsg = '图片上传中'          
          // return
        }, onTaskProgress (task) {
          //每一个任务的上传进度,通过`task.progress`获取
          console.log(task.progress);

        }, onTaskSuccess (task) {
          //一个任务上传成功后回调
          //console.log(task.result.key);//文件的key
          //console.log(task.result.hash);//文件hash

          // self.uploadStatusUpdate('success')
          // 将文件以Data URL形式进行读入页面
          // const reader = new FileReader()
          // reader.readAsDataURL(task.file)
          // reader.onload = function (e) {
          //   self.addConversationItem(this.result)
          // }
          self.postFeedback(task.result.url)

        }, onTaskFail (task) {
          //一个任务在经历重传后依然失败后回调此函数
          self.uploadStatusUpdate('imgFail')
        }, onTaskRetry (task) {
          //开始重传
          console.log('upload retry')
        }, onFinish (tasks) {
          //所有任务结束后回调，注意，结束不等于都成功，该函数会在所有HTTP上传请求响应后回调(包括重传请求)。
          console.log('upload finish')
        }
      }).build()
    },
    uploadImage () {
      this.uploader.chooseFile()
    },
    showFaq () {
      this.__REPORT('view_faq')
      const faqUrl = 'https://api.xiaoheihe.cn/maxnews/app/detail/14943'
      maxjia.maxapi.openUrlInSystemBrowser(faqUrl)
    }
  },
  created () {
    // this.getConversationList()
    this.uploadInit()
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
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
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
  .fb-dialog-faq-enter {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    color: fade(#fff, 60%);
    cursor: pointer;
    &:hover {
      color: #fff;
    }
    span {
      margin-right: 5px;
    }
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
    font-weight: 400;    
    color: #fff;
    .ellipsis;
  }
  .fb-dialog-admin-desc {
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
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
  .fb-dialog-conversation-notice {
    font-size: 12px;
    color: @secondaryTextColor;
    line-height: 24px;
    font-weight: 300;
    text-align: center;
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
  .fb-dialog-upload-status {
    position: absolute;
    z-index: 2;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
  }
  .fb-dialog-upload-status-wrap {
    font-size: 12px;
    text-align: center;
    background: fade(@fullBlack, 80%);
    border-radius: 4px;
    padding: 4px 10px;
    .depth(1);
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