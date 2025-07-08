<template>
  <view class="wallpaper-preview">
    <!-- 顶部时间和日期 -->
    <view class="lock-info">
      <view class="time">11:51</view>
      <view class="date">7月5日</view>
    </view>
    <!-- 壁纸大图预览 -->
    <image class="wallpaper-img" :src="imgUrl" mode="aspectFill" />
    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-btn" @click="onBack">
        <image src="/static/wallpaper/back.png"></image>
      </view>
      <view class="action-btn" @click="onFavorite">
        <image src="/static/wallpaper/collection.png"></image>
      </view>
      <view class="action-btn" @click="onDownload">
        <image src="/static/wallpaper/download.png"></image>
      </view>
      <view class="action-btn" @click="onLike">
        <image src="/static/wallpaper/like.png"></image>
      </view>
      <button class=" custom-btn action-btn" @click="onShare" open-type="share">
        <image src="/static/wallpaper/share.png"></image>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

const imgUrl = ref('');
const pages = getCurrentPages();
onMounted(() => {
  // 获取页面参数img（兼容uni-app）
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  let imgParam = '';
  if (current && current.route) {
    // #ifdef H5
    imgParam = (current as any).options?.img;
    // #endif
    // #ifndef H5
    imgParam = (current as any).options?.img || (current as any).$page?.options?.img;
    // #endif
  }
  if (imgParam) {
    imgUrl.value = decodeURIComponent(imgParam);
  }
});

const onBack = () => {
  if(pages.length > 1){
    uni.navigateBack({
      delta: pages.length - 1,
    });
  }else{
    uni.switchTab({
      url: '/pages/wallpaper/wallpaper',
    });
  }
};
const onFavorite = () => {
  uni.showToast({ title: '已收藏', icon: 'success' });
};
const onDownload = () => {
  if (!imgUrl.value) {
    uni.showToast({ title: '图片地址无效', icon: 'none' });
    return;
  }
  uni.showLoading({ title: '下载中...' });
  uni.downloadFile({
    url: imgUrl.value,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.hideLoading();
            uni.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      } else {
        uni.hideLoading();
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    },
    fail: () => {
      uni.hideLoading();
      uni.showToast({ title: '下载失败', icon: 'none' });
    }
  });
};
const onLike = () => {
  uni.showToast({ title: '点赞成功', icon: 'success' });
};
const onShare = () => {
  uni.showShareMenu();
};
onShareAppMessage(() => {
  return {
    title: '超美手机壁纸，快来看看！',
    path: '/pages/wallpaper/details?img=' + encodeURIComponent(imgUrl.value),
    imageUrl: imgUrl.value
  };
});
onShareTimeline(() => {
  return {
    title: '超美手机壁纸，快来看看！',
    query: 'img=' + encodeURIComponent(imgUrl.value),
    imageUrl: imgUrl.value
  };
});
</script>

<style scoped lang="less">
  .custom-btn{
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    text-align: inherit;
    box-shadow: none;
    border-radius: 0;
    outline: none;
    &::after {
      border: none;
    }
  }
.wallpaper-preview {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.lock-info {
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 2;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.time {
  font-size: 64px;
  font-weight: bold;
  letter-spacing: 2px;
}
.date {
  font-size: 24px;
  margin-top: 8px;
}
.wallpaper-img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
}
.action-bar {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0,0,0,0.18);
  padding: 16px 0 12px 0;
  z-index: 3;
  border-radius: 32px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  min-height: 56px;
}
.action-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  outline: none;
  line-height: 36px;
  text-shadow: 0 2px 8px rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  
  image {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}
</style>
