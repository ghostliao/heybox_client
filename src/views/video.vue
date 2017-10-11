<template>
  <div class="view-video">
    <div class="record">
      <div class="title">录制</div>
      <div class="video-setting-btn">
        <cpt-button label="录制设置" icon="set-video-thin" @click="$router.push({ name: 'settings-video' })" secondary small></cpt-button>
      </div>
      <div class="main">
        <div class="record-btn" @click="easyStartVideoCapture">
          <cpt-icon value="add-thin" :size="24"></cpt-icon>``
          <span class="txt">录制新视频</span>
        </div>
      </div>
    </div>
    <ul class="nav-list">
      <router-link :to="{ name: 'video-desktop' }" tag="li">桌面录制</router-link>
      <!-- <router-link :to="{ name: 'video-highlight' }" tag="li">精彩时刻</router-link> -->
    </ul>
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>  
    </div>
  </div>
</template>
<script>
import cptButton from '@/components/button'
import { mapActions } from 'vuex'

export default {
  name: "view-video",
  components: {
    'cpt-button': cptButton
  },
  data () {
    return {
      
    }
  },
  methods: {
    ...mapActions([
      'easyStartVideoCapture'
    ])
  }
}
</script>
<style lang="less">
@import "../styles/import.less";
.view-video {
  padding: 16px 36px;
  .record {
    position: relative;
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
    > .main {
      .record-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 134px;
        height: 64px;
        color: @secondaryTextColor;
	      border-radius: 2px;
        background-color: fade(@textColor, 10%);
        margin-bottom: 16px;
        cursor: pointer;
        .txt {
          font-size: 12px;
          line-height: 1;
          margin-top: 4px;
        }
        &:hover {
          background-color: fade(@textColor, 20%);
        }
        &:active {
          background-color: fade(@textColor, 10%);
        }
      }
    }
  }
  .nav-list {
    display: flex;
    height: 48px;
    li {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 300;
      color: fade(@textColor, 40%);
      cursor: pointer;
      margin-right: 20px;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: -12px;
        width: 4px;
        height: 4px;
        background: fade(@textColor, 40%);
        border-radius: 50%;
        margin-top: -2px;
      }
      &:last-of-type:after {
        content: none;
      }
      &.active {
        color:fade(#f1f2f3, 100%);
      }
    }
  }
}
</style>
