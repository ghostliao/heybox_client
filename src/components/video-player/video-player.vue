<template>
  <div class="cpt-video-player">
    <div class="layer">
      <div class="video-player">
        <p>This is a demo player</p>
        <video ref="video-player" id="single-play" width="640" height="360" controls preload>
          <source id="single-source" :src="videoSource" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "cpt-video-player",
  props: {
    videoSource: {
      type: String,
      default: 'max-file://video/D:/files/test.mkv'
    }
  },
  data () {
    return {
      
    }
  }
}
</script>
<style lang="less">
@import "../../styles/import.less";
.cpt-video-player {
  .layer {
    position: fixed;
    z-index: @videoPlayer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.8);
    .video-player {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      video {
        background: #111;
      }
    }
  }
}
</style>
