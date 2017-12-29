<template>
  <div class="view-wallpaper-store" ref="scroller">
    <div class="content">
      <cpt-set-block-head title="桌面商城"></cpt-set-block-head>
      <div class="body" ref="body">
        <div class="wp-filter" v-show="$store.state.wallpaperFilter.length > 0">
          <div class="wp-filter-type" v-for="(i, index) in $store.state.wallpaperFilter" :key="index">
            <div class="label">{{i.desc}}：</div>
            <div class="options-list">
              <div class="option" v-for="(j, index) in i.list" :key="index" :class="filterActiveClass(i, j)" @click="getListByParam(i.value, j.value)">{{j.desc}}</div>
            </div>
          </div>
          
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="loading" key="loading" class="loading">
            <cpt-circular-progress :size="40" />
          </div>
          <div v-if="!loading && wallpaperList.length <= 0" key="notice" class="notice">暂无桌面文件</div>
          <div v-if="!loading && getWallpaperListFailed" key="notice" class="notice">获取列表失败</div>
          <div v-if="!loading && wallpaperList.length > 0" key="list" class="wp-list">
            <cpt-store-wallpaper-item v-for="(i, index) in wallpaperList" :key="index" :index="index" :data="i" :current="currentWallpaper" :margin="previewHeight" @closePreview="closePreview"></cpt-store-wallpaper-item>
          </div>
          <!-- <cpt-pagination v-show="firstLoadFinished && !getWallpaperListFailed" key="pagination" :total="total" :pageSize="limit" :current="current" @pageChange="pageChange"></cpt-pagination> -->
          
          <!-- <div v-if="!loading && firstLoadFinished && !getWallpaperListFailed" class="pagination-wrap" key="pagination">
            <cpt-pagination :total="total" :pageSize="limit" :current="current" @pageChange="pageChange"></cpt-pagination>
          </div> -->
        </transition>
        <transition name="fade" mode="out-in">
          <lazy :time="500">
            <cpt-pagination v-show="!loading && firstLoadFinished && !getWallpaperListFailed" :total="total" :pageSize="limit" :current="current" @pageChange="pageChange"></cpt-pagination>
          </lazy>
        </transition>
        <cpt-wallpaper-preview v-if="wallpaperPreview" :from="page" :previewStyle="previewStyle" :data="wallpaperList[currentWallpaper]" @close="closePreview"></cpt-wallpaper-preview>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {cptSetBlock, cptSetBlockHead} from '@/components/set-block'

import {cptStoreWallpaperItem} from '@/components/wallpaper-item'
import cptWallpaperPreview from '@/components/wallpaper-preview'
import Bus from '@/components/bus'
import wallpaperApi from '@/components/wallpaperFile'
import cptPagination from '@/components/pagination'

export default {
  name: "view-wallpaper-store",
  mixins: [wallpaperApi],
  components: {
    'cpt-set-block': cptSetBlock,
    'cpt-set-block-head': cptSetBlockHead,
    'cpt-store-wallpaper-item': cptStoreWallpaperItem,
    'cpt-wallpaper-preview': cptWallpaperPreview,
    'cpt-pagination': cptPagination
  },
  data () {
    return {
      page: 'store',
      loading: true,
      singleRowItemCount: 4, // 单行壁纸展示数
      currentWallpaper: -1, // 当前查看的壁纸
      wallpaperPreview: false, // 壁纸预览开关
      previewStyle: {}, // wallpaper 位置信息
      previewHeight: 0, // 预览区域高度
      firstLoadFinished: false,
      getWallpaperListFailed: false,
      wallpaperList: [],
      wallpaperFilterParams: {
        tag: 0,
        sort: 1
      },
      total: 500, // 壁纸总数
      current: 1, // 当前页数
      limit: 60 // 每页壁纸数
    }
  },
  computed: {
    
  },
  methods: {
    ...mapActions([
      'openMsgDialog'
    ]),
    bodyWidthDetect () {
      const maxWidth = document.body.clientWidth
      if (maxWidth > 1600) {
        this.singleRowItemCount = 6
        this.previewHeight = 600
      } else if (maxWidth > 1280) {
        this.singleRowItemCount = 5
        this.previewHeight = 500
      } else {
        this.singleRowItemCount = 4
        this.previewHeight = 400
      }
    },
    closePreview () {
      this.wallpaperPreview = false
      this.currentWallpaper = -1
    },
    getStoreWallpaperList ({
      offset,
      limit
    } = {
      offset: 0,
      limit: this.limit
    }) {
      return new Promise((resolve, reject) => {
        const url = '/pc/wallpaper/'
        let tag
        if (this.wallpaperFilterParams.tag === 0) {
          tag = 0
        } else {
          tag = this.wallpaperFilterParams.tag.join('_')
          // console.log(tag)
        }
        const options = {
          params: {
            'heybox_id': this.$store.state.accountInfo.uid,
            'os_type': 'pc',
            'offset': offset,
            'limit': limit,
            'sort': this.wallpaperFilterParams.sort,
            'tag': tag
          }
        }
        this.$ajax(url, options).then(res => {
          const data = res.data.result
          this.wallpaperList = data.list
          this.total = data.total
          this.loading = false
          resolve(data.list)
          // this.$nextTick(() => {
            this.$refs.scroller.scrollTop = 0
          // })
        }, res => {
          console.log('getStoreWallpaperList failed')
          this.loading = false
          
          reject(res)
          // this.$store.state.msgDialogOptions.markType = 'fail'
          // this.$store.state.msgDialogOptions.msg = '获取列表失败'
          // this.$store.state.msgDialog = true
        })
      })
    },
    updateStoreWallpaperList (config, firstLoad = false) {
      if (!this.$store.state.wallpaperFilter) {
        this.getWallpaperListFailed = true
        return
      }
      if (firstLoad) {
        this.firstLoadFinished = false
        this.current = 1
      }
      this.loading = true
      this.$nextTick(() => {
        this.getStoreWallpaperList(config).then(list => {
          this.firstLoadFinished = true
          return this.getLocalWallpaperList()
        }).then(list => {
          for (let i = 0, len1 = list.length; i < len1; i++) {
            for (let j = 0, len2 = this.wallpaperList.length; j < len2; j++) {
              if (this.wallpaperList[j].ID === list[i].ID) {
                this.$set(this.wallpaperList[j], 'downloadFinished', true)
                this.$set(this.wallpaperList[j], 'downloadProgress', 1)
                if (list[i].isCurrent) {
                  this.$set(this.wallpaperList[j], 'isCurrent', true)
                }
                break
              }
            }
          }
        })
      })
    },
    pageChange (newIndex) {
      this.updateStoreWallpaperList({
        offset: (newIndex - 1) * this.limit,
        limit: this.limit
      })
    },
    getListByParam (filterValue, optionValue) {
      if (filterValue === 'tag') { // 标签
        if (optionValue === 0) {
          this.wallpaperFilterParams.tag = 0
        } else {
          let arr = this.wallpaperFilterParams.tag
          if (arr === 0) {
            arr = []
            arr.push(optionValue)
          } else {
            if (arr.find(n => n === optionValue)) {
              arr.splice(arr.findIndex(n => n === optionValue), 1)
              if (arr.length < 1) {
                arr = 0
              }
            } else {
              arr.push(optionValue)
            }
          }
          this.wallpaperFilterParams.tag = arr
        }
      } else if (filterValue === 'sort') { // 排序
        this.wallpaperFilterParams.sort = optionValue   
      }
      this.$nextTick(() => {
        this.updateStoreWallpaperList({
          offset: 0,
          limit: this.limit
        }, true)
      })
      
    },
    filterActiveClass (i, j) {
      if (i.value === 'tag') {
        const arr = this.wallpaperFilterParams.tag
        if (arr === 0) {
          return { 'active': j.value === 0 }
        } else {
          return { 'active': arr.find(n => n === j.value) }
        }
      } else if (i.value === 'sort') {
        return { 'active': j.value === this.wallpaperFilterParams[i.value] }
      }
    }
  },
  created () {
    this.wallpaperInitConnect()

    Bus.$on('wallpaperPreview', data => {
      if (data.from !== 'store') return
      this.currentWallpaper = data.index
      this.previewStyle = {
        top: data.position.top + data.itemHeight + 10 + 'px',
        height: this.previewHeight + 'px'
      }
      this.wallpaperPreview = true
      this.$nextTick(() => {
        this.$refs.scroller.scrollTop = data.position.top
      })
      // console.log(this.wallpaperList[this.currentWallpaper])
    })
    
  },
  mounted () {
    this.updateStoreWallpaperList({
      offset: 0,
      limit: this.limit
    }, true)

    this.bodyWidthDetect()

    window.addEventListener('resize', () => {
      this.bodyWidthDetect()
      this.closePreview()
    })
  },
  activated () {
    this.__REPORT('view_wallpaper_store')
  },
  deactivated () {
    this.closePreview()
  }
}

</script>
<style lang="less">
@import "../../styles/import.less";
.view-wallpaper-store {
  .view-scroller;
  .content {
    width: 100%;
    padding: 6px 40px 40px;
    > .body {
      position: relative;
      .loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .notice {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400px;
        text-align: center;
        font-size: 14px;
        color: @secondaryTextColor;
      }
      .wp-list {
        display: flex;
        flex-wrap: wrap;
        margin-right: -20px;
      }
    }
  }
}

.wp-filter {
  position: relative;
  z-index: 1;
  font-weight: 400;
  padding-bottom: 8px;
  .wp-filter-type {
    display: flex;
    padding-top: 8px;
    .label {
      width: 50px;
      color: #969ba0;
    }
    .options-list {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      margin-right: -8px;
      .option {
        color: #bec3c8;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        background: fade(@textColor, 10%);
        border-radius: 2px;
        padding: 0 12px;
        margin-right: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        &.active {
          color: @textColor;
          background-color: @primaryColor;
        }
      }
    }
  }
}
</style>