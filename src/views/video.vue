<template>
  <div class="view-video">
    <div class="toolbar">
      <!-- <div class="title">录制</div> -->
      <!-- <div class="video-setting-btn">
        <cpt-button label="录制设置" icon="set-video-thin" @click="$router.push({ name: 'settings-video' })" secondary small></cpt-button>
      </div> -->
      <div class="wrap">
        <cpt-block-button icon="screenshot-fill" :text="'截屏'" :tooltipLabel="$store.state.hotkeys.captureImage" @click="startImageCapture"></cpt-block-button>
        <cpt-block-button
          :buttonClass="recordButtonClass"
          icon="record-fill" 
          :text="recordButtonText" 
          :textClass="recordButtonTextClass" 
          :tooltipLabel="$store.state.hotkeys.captureVideo" 
          @click="recordButtonClickEvent"></cpt-block-button>
        <cpt-block-button buttonClass="set" icon="set-fill" @click="$router.push({ name: 'settings-video' })"></cpt-block-button>
         
        <!-- <div v-show="isAutoStartCaptureInGame" class="main-btn auto" @click="setIsAutoStartCaptureInGame(false)">
          <cpt-icon value="capture-fill" :size="24"></cpt-icon>
          <span class="txt">精彩时刻已开启</span>
        </div>
        <div v-show="!isAutoStartCaptureInGame" class="main-btn auto close" @click="setIsAutoStartCaptureInGame(true)">
          <cpt-icon value="capture-fill" :size="24"></cpt-icon>
          <span class="txt">精彩时刻已关闭</span>
        </div> -->
      </div>
    </div>
    <div class="nav-bar">
      <ul class="nav-list">
        <router-link v-for="(i, index) in navTabs" :to="{ name: i.name }" tag="li" :key="i.name">
          <span :ref="`tab${index}`">{{i.label}}</span>
        </router-link>
        <!-- <router-link :to="{ name: 'video-desktop' }" tag="li">
          <span ref="tab0">录像</span>
        </router-link>
        <router-link :to="{ name: 'video-screenshot' }" tag="li">
          <span ref="tab1">截屏</span>
        </router-link> -->
        <span class="tab-link-highlight" ref="highlight"></span>
      </ul>
      <div class="media-list-filter">
        <div class="media-list-filter-item">
          <cpt-select-field :select="mediaListFilter.fileType.select.value === 'all' ? '分类' : mediaListFilter.fileType.select.label">
            <cpt-menu>
              <cpt-menu-item v-for="(key, value) in mediaListFilter.fileType.filter" :key="key" :title="key" :selectActive="mediaListFilter.fileType.select.value === value" @click="filterSelect('fileType', key, value)" />
            </cpt-menu>
          </cpt-select-field>
        </div>
        <!-- <div class="media-list-filter-item">
          <cpt-select-field :select="mediaListFilter.moment.select.value === 'all' ? '时刻' : mediaListFilter.moment.select.label">
            <cpt-menu>
              <cpt-menu-item v-for="(key, value) in mediaListFilter.moment.filter" :key="key" :title="key" :selectActive="mediaListFilter.moment.select.value === value" @click="filterSelect('moment', key, value)" />
            </cpt-menu>
          </cpt-select-field>
        </div> -->
      </div>
      <div class="show-type">
        <div class="btn" :class="{ 'active': $store.state.mediaListShowType === 'list' }" @click.stop="changeShowType('list')">
          <cpt-icon value="list-fill" :size="16"></cpt-icon>          
        </div>
        <div class="btn" :class="{ 'active': $store.state.mediaListShowType === 'grid' }" @click.stop="changeShowType('grid')">
          <cpt-icon value="card-fill" :size="16"></cpt-icon>
        </div>
      </div>
    </div>
    <div class="main">
      <lazy :time="300">
        <keep-alive>
          <router-view :viewParams="viewParams"></router-view>
          <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      </lazy>
    </div>

    <!-- <cpt-back-top>
      <div class="back-top">TOP</div>
    </cpt-back-top> -->
  </div>
</template>
<script>
import cptButton from '@/components/button'
import cptBlockButton from '@/components/blockButton'
import { mapState, mapActions } from 'vuex'
import cptBackTop from '@/components/backTop'
import tabHighlight from '@/components/tab-highlight'
import {menu, menuItem} from '@/components/menu'
import cptDivider from '@/components/divider'
import Bus from '@/components/bus'

export default {
  name: "view-video",
  // mixins: [tabHighlight],
  components: {
    'cpt-button': cptButton,
    'cpt-block-button': cptBlockButton,
    'cpt-back-top': cptBackTop,
    'cpt-menu': menu,
    'cpt-menu-item': menuItem,
    'cpt-divider': cptDivider
  },
  data () {
    return {
      routeDepth: 2,
      navTabs: [
        {
          name: 'video-lib',
          label: '精彩时刻'
        },
        // {
        //   name: 'video-desktop',
        //   label: '录像'
        // },
        // {
        //   name: 'video-screenshot',
        //   label: '截屏'
        // }
      ],
      mediaListFilter: {
        fileType: {
          select: {
            label: '全部',
            value: 'all'
          },
          filter: {
            'all': '全部',
            'video': '视频',
            'image': '截图'
          }
        },
        moment:{
          select: {
            label: '全部',
            value: 'all'
          },
          filter: {
            'all': '全部',
            'kill': '击杀',
            'dead': '死亡'
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      // 'recordingState'
    }),
    recordButtonClass () {
       return this.$store.state.recordingState !== 'RS_Stop' ? 'recording' : ''
    },
    recordButtonText () {
      if (this.$store.state.recordingState === 'RS_Init') {
        return '初始化中'
      } else if (this.$store.state.recordingState === 'RS_Recording') {
        return this.filterDuration(this.$store.state.recordingSeconds)
      } else {
        return '录制'
      }
    },
    recordButtonTextClass () {
      return this.$store.state.recordingState === 'RS_Recording' ? 'time' : ''
    },
    viewParams () {
      return {
        'fileType': this.mediaListFilter.fileType.select.value,
        'moment': this.mediaListFilter.moment.select.value
      }
    }
  },
  methods: {
    ...mapActions([
      'startImageCapture',
      'easyStartVideoCapture',
      'stopVideoCapture'
    ]),
    recordButtonClickEvent () {
      this.$store.state.recordingState === 'RS_Stop' ? this.easyStartVideoCapture() : this.stopVideoCapture()
    },
    onRecordingSecondsChanged () {
      this.getRecordingSeconds()
    },
    getRecordingSeconds () {
      maxjia.media.getRecordingSeconds(data => {
        // console.log(data)
        this.$store.state.recordingState = data.recordingState
        this.$store.state.recordingSeconds = data.recordingState === 'RS_STOP' ? 0 : data.recordingSeconds
      })
    },
    init () {
      maxjia.media.getRecordingState(data => {
        this.$store.state.recordingState = data.recordingState
      })
      maxjia.media.recordingSecondsChanged.addListener(data => {
        this.onRecordingSecondsChanged()
      })
    },
    // 改变媒体列表展示方式
    changeShowType (type) {
      console.log(type)
      localStorage.setItem('mediaListShowType', type)
      this.$store.state.mediaListShowType = type
    },
    // 媒体列表过滤器
    filterSelect (type, key, value) {
      this.mediaListFilter[type].select.label = key
      this.mediaListFilter[type].select.value = value
      Bus.$emit('closeMenu')
    }
  },
  mounted () {
    this.init()
  },
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-video {
  padding: 24px 40px;
  .toolbar {
    position: relative;
    margin-bottom: 16px;
    .video-setting-btn {
      position: absolute;
      top: 10px;
      right: 0;
    }
    > .title {
      display: flex;
      align-items: center;
      height: 48px;
      font-size: 16px;
    }
    > .wrap {
      display: flex;
    }
  }
  .nav-bar {
    display: flex;
    border-bottom: 1px solid @layoutBorderColor;
    margin-bottom: 2px;
    .nav-list {
      position: relative;
      display: flex;
      height: 54px;
      > li {
        position: relative;
        top: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 300;
        color: fade(@textColor, 40%);
        border-bottom: 1px solid transparent;
        cursor: pointer;
        margin-right: 24px;
        .common-transition;
        // &:after {
        //   content: '';
        //   position: absolute;
        //   top: 50%;
        //   right: -12px;
        //   width: 4px;
        //   height: 4px;
        //   background: fade(@textColor, 40%);
        //   border-radius: 50%;
        //   margin-top: -2px;
        // }
        // &:last-of-type:after {
        //   content: none;
        // }
        &:hover {
          color: @textColor;
        }
        &.active {
          color: @textColor;
          border-bottom: 1px solid @primaryColor;
        }
      }
      .tab-link-highlight {
        position: absolute;
        left: 0;
        bottom: -1px;
        height: 1px;
        background-color: @primaryColor;
        transition: all .3s;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
      }
    }
    .media-list-filter {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
    }
    .media-list-filter-item {
      margin-right: 12px;
    }
    .show-type {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn {
        margin-left: 6px;
        cursor: pointer;
        .iconfont {
          color: @lightIconColor;
        }
        &.active {
          .iconfont {
            color: @primaryColor;
          }
        }
      }
    }
  }
}
</style>
