<template>
  <div class="cpt-wallpaper-item">
    <div class="wallpaper-item" :style="[ current === index && itemMargin]" @click="wallpaperPreview" ref="item">
      <div class="wallpaper-item-wrap">
        <div class="row row-1">
          <div class="thumbnail">
            <img v-lazy="thumbnail">
          </div>
          <div class="layer">
            <div class="name">{{data.name}}</div>
            <div class="download-status">
              <!-- <div class="icon-fail">
                <cpt-icon value="warning-fill" :size="12"></cpt-icon>
              </div>
              <div class="msg">下载失败</div> -->
            </div>
            <!-- <div class="progress-bar">
              <cpt-linear-progress mode="determinate" :size="2" :value="50"/>
            </div> -->
            <div class="info">
              <!-- <span v-text="data.type === 1 ? '视频' : '图片'"></span>  -->
              <!-- <span class="download-size">2.8 M</span> -->
              <!-- <span class="download-size">/</span> -->
              <span class="full-size">{{data.fileSize|fileSize}}</span><br>
              <span class="wh">{{data.width}} × {{data.height}}</span>
            </div>
            <div class="btn-group">
              <!-- <div class="btn">
                <cpt-icon-button icon="delete-fill" danger></cpt-icon-button>
              </div> -->
            </div>
          </div>
          <transition name="fade">
            <div v-show="current === index" class="highlight"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/components/bus'

export default {
  name: 'cpt-local-wallpaper-item',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    },
    current: {
      type: Number
    },
    margin: {
      type: Number
    }
  },
  data () {
    return {
      offsetTop: 0
    }
  },
  computed: {
    thumbnail () {
      // return 'max-file://' + this.data.thumbnail.replace(':', '')
      // return 'https://ss3.bdstatic.com/lPoZeXSm1A5BphGlnYG/skin_plus/2.jpg?2'
      return this.data.thumbnail
    },
    itemMargin () {
      return {
        'margin-bottom': this.margin + 20 + 'px'
      }
    }
  },
  methods: {
    wallpaperPreview () {
      if (this.$route.name !== 'wallpaper-local') return
      const item = this.$refs.item
      const data = {
        from: this.$route.name === 'wallpaper-local' ? 'local' : 'store',
        index: this.index,
        itemHeight: item.offsetHeight,
        position: {
          top: this.offsetTop
        },
        fileData: this.data
      }
      console.log(data.index, data.position.top)
      Bus.$emit('wallpaperPreview', data)
    },
    getItemOffsetTop () {
      this.offsetTop = this.$refs.item.offsetTop
    }
  },
  created () {
    
  },
  mounted () {
    this.getItemOffsetTop()
    window.addEventListener('resize', () => {
      this.getItemOffsetTop()
    })
  },
  activated () {
    this.getItemOffsetTop()
  }
}

</script>

<style lang="less">
@import "../../styles/import.less";

.cpt-wallpaper-item {
  // position: relative;
  width: 16.666667%;
  padding-right: 20px;
  // .common-transition;
  // transition-delay: .3s;
  @media (max-width: 1600px) {
    width: 20%;
  }
  @media (max-width: 1280px) {
    width: 25%;
  }
  .wallpaper-item {
    margin-bottom: 20px;
    cursor: pointer;
    .wallpaper-item-wrap {
      > .row-1 {
        position: relative;
        padding-top: 56.25%;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0 0 6px rgba(0,0,0,.5);
        .thumbnail {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .layer {
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          background: fade(#14191e, 80%);
          padding: 0 8px;
          opacity: 0;
          // .common-transition;
          &.hover {
            opacity: 1;
          }
          .name {
            font-size: 14px;
            line-height: 20px;
            padding: 5px 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .download-status {
            flex: 1;
            min-height: 0;
            display: flex;
            font-size: 14px;
            .icon-fail {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: @dangerColor;
              font-size: 0;
              font-weight: 300;
            }
            .msg {
              line-height: 16px;
              height: 16px;
              padding-left: 8px;
            }
          }
          .progress-bar {
            height: 2px;
            border-radius: 2px;
            background-color: fade(#fff, 20%);
            margin-bottom: 8px;
            .value {
              position: relative;
              height: 2px;
              border-radius: 2px;
              background-image: linear-gradient(to right, #36b0fa, #a1dcff);
              &:after {
                content: '';
                position: absolute;
                z-index: 1;
                top: 0;
                right: -1px;
                width: 2px;
                height: 2px;
                border-radius: 2px;
                background-color: #a1dbff;
                box-shadow: 0 0 6px 0 #a1dbff, 0 0 6px 0 #a1dbff;
              }
            }
          }
          .info {
            color: fade(@textColor, 60%);
            font-size: 12px;
            line-height: 16px;
            text-align: right;
            padding-bottom: 8px;
            .download-size {
              color: @textColor;
            }
          }
          .btn-group {
            position: absolute;
            left: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            height: 32px;
            padding: 8px;
            .btn {
              position: relative;
              // width: 14px;
              // height: 14px;
              margin-right: 6px;
              color: @lightIconColor;
              &.disabled {
                color: fade(@textColor, 10%);
                cursor: not-allowed;
              }
            }
          }
          .highlight {
            position: absolute;
            z-index: 3;
            left: 0;
            right: 0;
            bottom: 0;
            height: 2px;
            background: @primaryColor;
          }
        }
      
      }
      &:hover {
        > .row-1 {
          .layer {
            opacity: 1;
          }
        }
      }
    }
    &:hover {
      .wallpaper-item-wrap {
        > .row-2 {
          .btn-group {
            display: flex;
          }
        }
      }
    }
  }
}

</style>