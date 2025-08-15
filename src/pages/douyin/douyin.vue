<template>
  <view class="douyin-container" v-if="type === 'image'">
    <!-- 作者信息卡片 -->
    <view class="author-card">
      <view class="author-info">
        <image
          class="avatar"
          :src="info.author?.avatar_thumb.url_list[0] || ''"
          mode="aspectFill"
        ></image>
        <view class="author-details">
          <view class="author-name">
            <text class="verify-icon"></text>
            {{ info.author?.nickname || '加载中...' }}
          </view>
          <view class="author-id">ID: {{ info.author?.unique_id }}</view>
        </view>
      </view>
      <view class="content-desc">
        {{ info?.desc }}
      </view>
    </view>

    <!-- 图片集合 -->
    <view class="image-count">共 {{ imageList.length }} 张图片</view>
    <view class="image-grid">
      <view
        class="image-item"
        v-for="(item, index) in imageList"
        :key="index"
        @click="previewImage(index)"
      >
        <image class="grid-image" :src="item" mode="aspectFill"></image>
      </view>
    </view>

    <button
      class="download-btn"
      style="margin-bottom: 40rpx"
      @click="downloadAllImages"
      v-if="imageList.length > 1"
    >
      全部下载
    </button>

    <!-- 分享按钮组 -->
    <view class="share-group" style="margin-bottom: 40rpx">
      <button class="share-btn" open-type="share">分享给朋友</button>
    </view>

    <button class="download-btn" @click="goHome" style="margin-bottom: 100rpx; margin-top: 20rpx">
      我也要解析视频/图片
    </button>
  </view>

  <view v-else-if="type === 'video'" class="video-container" :style="`height: ${windowHeight}px`">
    <video
      style="height: 100%"
      class="video-player"
      :src="videoPlayUrl"
      :controls="true"
      :autoplay="true"
      :show-fullscreen-btn="false"
      :show-mute-btn="true"
      object-fit="contain"
      ref="selfVideo"
      id="selfVideo"
    ></video>

    <view class="user-info">
      <image
        class="video-avatar"
        :src="info.author?.avatar_thumb.url_list[0] || ''"
        mode="aspectFill"
      ></image>
      <button class="custom-button" open-type="share">
        <image src="/static/share.png" class="icon"></image>
        <view class="text">转发好友</view>
      </button>
      <button class="custom-button" @click="downloadVideo">
        <image src="/static/download.png" class="icon"></image>
        <view class="text">下载视频</view>
      </button>
      <button class="custom-button" @click="goHome">
        <image src="/static/home.png" class="icon"></image>
        <view class="text">我要解析</view>
      </button>
    </view>

    <view class="user-box">
      <view class="name">{{ info.author?.nickname }}</view>
      <view class="desc">{{ info?.desc }}</view>
    </view>
  </view>

  <view v-if="loading" :style="`width: 100%;height: ${windowHeight}px;`" class="loading-container">
    <image class="loading-img" :src="loadingImg" mode="widthFix"></image>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
  import { getDouyinDataApi } from '../../api/douyin';

  import loadingImg from '../../static/13395852403014388.gif';

  // 图片列表
  const imageList = ref([]);

  // 预览图片
  const previewImage = (index: number) => {
    uni.previewImage({
      urls: imageList.value,
      current: index,
    });
  };
  const pageType = ref('');
  const type = ref('');
  const info = ref({});
  const dataId = ref('');
  const selfVideo = ref('');
  const share = ref('0');
  const videoContext = ref(null);

  const loading = ref(false);

  const windowHeight = uni.getSystemInfoSync().windowHeight;
  
  onLoad((options) => {
    if ('pageType' in options) {
      pageType.value = options.pageType;
    }
    if ('dataId' in options) {
      dataId.value = options.dataId;
    }
    if ('share' in options) {
      share.value = options.share;
    }
    if (pageType.value == '1') {
      info.value = uni.getStorageSync('douyin');
      initialization();
    }
    if (pageType.value == '2') {
      loading.value = true;
      getDataBaseVideo();
    }
  });

  const getDataBaseVideo = async () => {
    const { data } = await getDouyinDataApi({ id: dataId.value });
    info.value = data.jsonData;
    initialization();
    loading.value = false;
  };

  const initialization = () => {
    type.value = info.value.type;
    if (type.value == 'image') {
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      });
      getImagesList();
    }
    if (type.value == 'video') {
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
      });
      videoContext.value = uni.createVideoContext('selfVideo');
      getVideo();
    }
  };

  const videoUrl = ref('');
  const videoPlayUrl = ref('');
  const getVideo = () => {
    videoUrl.value = info.value.video_data.wm_video_url_HQ;
    videoPlayUrl.value = info.value.video_data.nwm_video_url;
    console.log('videoPlayUrl', videoPlayUrl.value);
    console.log('share', share.value);
    console.log('videoContext', videoContext.value);
    // if (videoContext.value && share.value === '1' && videoPlayUrl.value) {
    //   const direction = 0
    //   videoContext.value.requestFullScreen({
    //     direction: direction
    //   })
    // }
  };

  const getImagesList = () => {
    imageList.value = info.value?.image_data?.no_watermark_image_list || [];
    console.log(imageList.value.length);
  };

  // 分享功能
  onShareAppMessage(() => {
    const shareTitle = info.value?.desc || '抖音分享';

    let shareImage = null;

    if (type.value === 'image') {
      shareImage = imageList.value[0] || info.value.author?.avatar_thumb.url_list[0];
    }
    if (type.value === 'video') {
      shareImage =
        info.value.cover_data?.cover.url_list[0] || info.value.author?.avatar_thumb.url_list[0];
    }

    return {
      title: shareTitle,
      path: `/pages/douyin/douyin?pageType=2&dataId=${dataId.value}&share=1`,
      imageUrl: shareImage,
    };
  });

  onShareTimeline(() => {
    const shareTitle = info.value?.desc || '抖音分享';
    const shareImage =
      type.value === 'image'
        ? imageList.value[0] || info.value.author?.avatar_thumb.url_list[0]
        : info.value.author?.avatar_thumb.url_list[0];

    return {
      title: shareTitle,
      imageUrl: shareImage,
    };
  });

  // 下载单个图片
  const downloadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                resolve(true);
              },
              fail: (err) => {
                reject(err);
              },
            });
          } else {
            reject(new Error('下载失败'));
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  };

  // 下载视频
  const downloadVideo = async () => {
    if (!videoUrl.value) {
      await uni.showToast({
        title: '没有可下载的视频',
        icon: 'none',
      });
      return;
    }

    await uni.showLoading({
      title: '下载中...',
    });

    try {
      uni.downloadFile({
        url: videoUrl.value,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.hideLoading();

            // 保存视频到相册
            uni.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                uni.showToast({
                  title: '视频已保存到相册',
                  icon: 'success',
                });
              },
              fail: (err) => {
                console.error('保存视频失败:', err);
                uni.showToast({
                  title: '保存视频失败',
                  icon: err.message,
                });
              },
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: '下载失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('下载视频失败:', err);
          uni.showToast({
            title: '下载视频失败',
            icon: err.message,
          });
        },
      });
    } catch (err) {
      uni.hideLoading();
      uni.showToast({
        title: '下载过程中出错',
        icon: err.message,
      });
      console.error('下载过程中出错:', err);
    }
  };

  // 下载所有图片
  const downloadAllImages = async () => {
    if (!imageList.value || imageList.value.length === 0) {
      await uni.showToast({
        title: '没有可下载的图片',
        icon: 'none',
      });
      return;
    }

    await uni.showLoading({
      title: '下载中...',
    });

    try {
      let successCount = 0;

      // 创建下载进度提示
      const showProgress = (current: number, total: number) => {
        uni.showLoading({
          title: `下载中 ${current}/${total}`,
        });
      };

      // 逐个下载图片
      for (let i = 0; i < imageList.value.length; i++) {
        showProgress(i + 1, imageList.value.length);
        try {
          await downloadImage(imageList.value[i]);
          successCount++;
        } catch (err) {
          console.error('下载失败:', err);
        }
      }

      uni.hideLoading();

      // 显示下载结果
      await uni.showToast({
        title: `下载完成，成功${successCount}/${imageList.value.length}`,
        icon: 'none',
        duration: 2000,
      });
    } catch (err) {
      uni.hideLoading();
      await uni.showToast({
        title: '下载过程中出错',
        icon: 'none',
      });
      console.error('下载过程中出错:', err);
    }
  };

  const shareVideoToGroup = async () => {
    console.log('shareVideoToGroup');
    uni.downloadFile({
      url: videoUrl.value,
      success: (res) => {
        console.log('下载成功');
        console.log(res.tempFilePath);
        uni.shareVideoToGroup({
          filePath: res.tempFilePath,
          success: () => {
            uni.showToast({
              title: '视频已分享到聊天',
              icon: 'success',
            });
          },
          fail: (err) => {
            console.error('保存视频失败:', err);
            uni.showToast({
              title: '保存视频失败',
              icon: 'none',
            });
          },
        });
      },
      fail: (err) => {
        uni.hideLoading();
        console.error('下载视频失败:', err);
        uni.showToast({
          title: '下载视频失败',
          icon: 'none',
        });
      },
    });
  };

  const goHome = () => {
    uni.switchTab({
      url: '/pages/douyin/index',
    });
  };
</script>

<style lang="less" scoped>
  // 变量定义
  @primary-color: #1c2126;
  @primary-hover: #2c3136;
  @bg-color: #f8f9fa;
  @card-bg: #ffffff;
  @text-primary: #222;
  @text-secondary: #444;
  @text-light: #888;
  @border-color: #f0f2f5;
  @shadow-color: rgba(0, 0, 0, 0.08);
  @border-radius: 16rpx;
  @btn-height: 88rpx;

  // 混入
  .card() {
    background-color: @card-bg;
    border-radius: @border-radius;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx @shadow-color;
  }

  .button-base() {
    height: @btn-height;
    line-height: @btn-height;
    color: #fff;
    border-radius: @btn-height / 2;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 8rpx 20rpx rgba(28, 33, 38, 0.3);
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
      transform: skewX(-25deg);
      transition: all 0.7s;
      z-index: -1;
    }

    &:active {
      transform: translateY(3rpx);
      box-shadow: 0 4rpx 10rpx rgba(28, 33, 38, 0.2);
      background: linear-gradient(135deg, @primary-hover, #3c4146);

      &::before {
        left: 150%;
      }
    }
  }

  // 样式
  .douyin-container {
    padding: 30rpx;
    background-color: @bg-color;
    min-height: 100vh;
  }

  .author-card {
    .card();
    margin-bottom: 30rpx;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 12rpx;
      height: 100%;
      background: linear-gradient(to bottom, @primary-color, @primary-hover);
      border-top-left-radius: @border-radius;
      border-bottom-left-radius: @border-radius;
    }
  }

  .author-info {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
  }

  .avatar {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2);
    border: 3rpx solid @card-bg;
    transition: transform 0.3s;

    &:active {
      transform: scale(1.05);
    }
  }

  .author-details {
    flex: 1;
  }

  .author-name {
    font-size: 34rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    color: @text-primary;
  }

  .verify-icon {
    display: inline-block;
    width: 10rpx;
    height: 32rpx;
    background-color: @primary-color;
    margin-right: 10rpx;
    border-radius: 4rpx;
  }

  .author-id {
    font-size: 24rpx;
    color: @text-light;
    margin-top: 6rpx;
  }

  .content-desc {
    font-size: 28rpx;
    line-height: 1.7;
    color: @text-secondary;
    padding: 16rpx 0;
    border-top: 2rpx solid @border-color;
    margin-top: 10rpx;
  }

  .image-count {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    margin: 36rpx 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1rpx;
      background-color: #e8e8e8;
      margin: 0 20rpx;
    }
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .download-btn {
    .button-base();
    width: 90%;
    background: linear-gradient(135deg, @primary-color, @primary-hover);
  }

  .video-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
    position: relative;

    .video-player {
      width: 100%;
      margin-bottom: 30rpx;
      background-color: #000;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
      overflow: hidden;
      position: absolute;
      left: 0;
      z-index: 1;
    }

    .user-box {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 80rpx;
      color: #fff;
      font-size: 28rpx;
      box-sizing: border-box;
      padding: 20rpx;
      text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
      z-index: 3;
      .name {
        margin-bottom: 20rpx;
        font-weight: bold;
        font-size: 34rpx;
      }
    }
  }

  .user-info {
    position: absolute;
    bottom: 250rpx;
    right: 20rpx;
    width: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 2;

    .video-avatar {
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 60rpx;
      border: 4rpx solid #fff;
    }
  }

  .image-item {
    width: 32%;
    margin-bottom: 20rpx;
    position: relative;
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 12rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
    }

    &:hover .grid-image {
      transform: scale(1.05);
    }

    .grid-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
  }

  .video-tip {
    display: flex;
    align-items: center;
    background-color: rgba(255, 248, 230, 0.9);
    border-left: 6rpx solid #ffc107;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;
    margin-bottom: 24rpx;
    width: 90%;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .tip-icon {
      font-size: 36rpx;
      color: #ffc107;
      margin-right: 12rpx;
      font-weight: bold;
    }
  }

  .share-group {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 10rpx auto;
    align-items: center;
  }

  .share-btn {
    .button-base();
    width: 48%;
    background: linear-gradient(135deg, @primary-color, @primary-hover);
  }

  .poster-btn {
    background: linear-gradient(135deg, @primary-hover, #3c4146);

    &:active {
      background: linear-gradient(135deg, #3c4146, #4c5156);
    }
  }

  .share-canvas {
    position: fixed;
    top: -9999rpx;
    left: -9999rpx;
    width: 600rpx;
    height: 800rpx;
    z-index: -1;
  }

  .share-icon {
    font-size: 36rpx;
    margin-right: 10rpx;
  }

  // 自定义按钮样式
  .custom-button {
    border: none;
    border-radius: 0;
    background-color: transparent;
    line-height: 1;
    margin-bottom: 50rpx;
    color: #fff;
    font-size: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    z-index: 1;

    &::after {
      display: none;
    }

    .icon {
      width: 60rpx;
      height: 60rpx;
    }

    .text {
      margin-top: 20rpx;
      text-shadow: 0 0 10rpx rgba(0, 0, 0, 1);
    }
  }
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    .loading-img {
      width: 80%;
    }
  }
</style>
