<template>
  <div class="view-video-cloud">
    <div class="media-list">
      <transition name="fade" mode="out-in">
        <div v-if="loading" key="loading" class="progress">
          <cpt-circular-progress :size="40" />
        </div>
        
        <div v-if="!loading && mediaList.length <= 0" key="notice" class="notice">
          <span v-show="loadingFailed">获取列表失败，<span class="reload" @click="getMediaList({ offset: 0, limit: limit }, true)">点击重试</span></span>
          <span v-show="!loadingFailed">暂无媒体文件</span>
        </div>
        <div v-if="!loading && mediaList.length > 0" key="list" class="media-list-wrap" :class="{ 'grid': $store.state.mediaListShowType === 'grid' }">
          <template v-for="(i, index) of mediaList">
            <cpt-manage-bar :key="index" :data="i" v-if="hasManageBar(mediaList, index)"></cpt-manage-bar>
            <cpt-media-item-cloud :key="index" :data="i" :index="index" :mediaItemStyle="$store.state.mediaListShowType" @deleteMedia="deleteMedia"></cpt-media-item-cloud>
          </template>
        </div>
      </transition>

      <lazy :time="600">
        <div class="pagination">
          <!-- <transition name="fade-in"> -->
            <cpt-pagination v-show="!loading && firstLoadFinished && !loadingFailed && mediaList.length > 0" :total="total" :pageSize="limit" :current="current" @pageChange="pageChange"></cpt-pagination>
          <!-- </transition> -->
        </div>
      </lazy>
    </div>

  </div>
</template>

<script>

import {cptManageBar, cptMediaItemCloud} from '@/components/media-item'
import cptPagination from '@/components/pagination'

export default {
  name: "view-video-cloud",
  components: {
    'cpt-manage-bar': cptManageBar,
    'cpt-media-item-cloud': cptMediaItemCloud,
    'cpt-pagination': cptPagination
  },
  data () {
    return {
      loading: true,
      loadingFailed: false,
      firstLoadFinished: false,
      mediaList: [],
      total: 500, // 总数
      current: 1, // 当前页数
      limit: 30 // 每页数
    }
  },
  computed: {
    
  },
  methods: {
    getMediaList (config, firstLoad = false) {
      if (firstLoad) {
        this.current = 1
        this.firstLoadFinished = false
      }
      // this.$parent.$parent.$refs.scroller.scrollTop = 0
      this.loading = true
      const url = '/pc/media/'
      const options = {
        params: {
          'heybox_id': this.$store.state.accountInfo.uid,
          'os_type': 'pc',
          'offset': config.offset,
          'limit': config.limit,
          // 'lastval': 1515154898
        }
      }
      this.$ajax(url, options).then(res => {
        const data = res.data.result
        this.total = data.total === 0 ? 1 : data.total
        this.firstLoadFinished = true
        this.$parent.$parent.$refs.scroller.scrollTop = 0
        if (res.data.status === 'ok') {
          this.loading = false
          this.loadingFailed = false
          this.mediaList = data.media
        } else {
          this.getMediaListFailed()
        }
      }).catch(error => {
        this.getMediaListFailed()
      })
    },
    getMediaListFailed () {
      this.loading = false
      this.loadingFailed = true
    },
    // 给媒体列表添加时间分类
    hasManageBar (list, index) {
      // console.log(index)
      // console.log(list[index])
      if (list[index - 1]) {
        const t1 = this.formDate(list[index - 1].createTimeStamp)
        const t2 = this.formDate(list[index].createTimeStamp)
        if (t1 === t2) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    formDate (t) {
      const timeSpan = t * 1000
      const dateTime = new Date(parseInt(timeSpan))
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const day = dateTime.getDate()
      return `${year}-${month}-${day}`
    },
    pageChange (newIndex) {
      this.current = newIndex
      this.getMediaList({
        offset: (newIndex - 1) * this.limit,
        limit: this.limit
      })
    },
    deleteMedia (id) {
      let arr =  this.mediaList
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].id === id) {
          arr.splice(i, 1)
          break
        }
      }
    }
  },
  created () {
  },
  mounted () {
    this.getMediaList({
      offset: 0,
      limit: this.limit
    }, true)
  }
}
</script>

<style lang="less">
@import "../../styles/import.less";
.view-video-cloud {
  .media-list {
    position: relative;
    // max-width: 1072px;
    margin: auto;
    .progress {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
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
      height: 200px;
      text-align: center;
      font-size: 14px;
      color: @secondaryTextColor;
      .reload {
        color: @primaryColor;
        cursor: pointer;
      }
    }
    .media-list-wrap {
      display: flex;
      flex-wrap: wrap;
      &.grid {
        margin-right: -20px;
      }
    }
    .pagination {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
  }
}

.first-upload-notice-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: @dialogHeight;
  line-height: 22px;
  .msg {
    font-size: 16px;
    color: @textColor;
    margin-top: 12px;
  }
  .desc {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 12px;
  }
}


</style>