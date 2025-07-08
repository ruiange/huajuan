<template>
  <view class="wallpaper-page">
   <view class="navbar-box">
     <!-- 顶部安全区 -->
     <status-bar></status-bar>
     <!-- 顶部导航栏 -->
     <view class="navbar">
       <view class="nav-left">
         <text class="nav-title" :class="{ active: activeTab === 0 }" @tap="activeTab = 0">每日壁纸</text>
       </view>
       <view class="nav-right">
         <view class="dot-indicator"></view>
         <view class="camera-btn">
           <!-- 可用uni-icons或图片icon -->
           <text class="camera-icon">●</text>
         </view>
       </view>
     </view>
   </view>
    <!-- 壁纸宫格 -->
    <scroll-view scroll-y class="wallpaper-scroll">
      <view class="wallpaper-grid">
        <template v-if="loading">
          <view v-for="n in 9" :key="n" class="wallpaper-item skeleton">
            <view class="wallpaper-img skeleton-bg"></view>
          </view>
        </template>
        <template v-else>
          <view v-for="(item, idx) in wallpapers" :key="idx" class="wallpaper-item" @tap="openDetails(item)">
            <image :src="item" mode="aspectFill" class="wallpaper-img" />
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import StatusBar from '@/components/statusBar/statusBar.vue';
  import { getWallpaperApi } from '@/api/wallpaper';
  import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
  const wallpapers = ref([]);
  const activeTab = ref(0);
  const loading = ref(true);
  function openDetails(img) {
    uni.navigateTo({
      url: '/pages/wallpaper/details?img=' + img,
    });
  }

  const getWallpaper = async () => {
    loading.value = true;
    const { data } = await getWallpaperApi();
    wallpapers.value = data || [];
    loading.value = false;
  };

  onMounted(() => {
    getWallpaper();
  });
  onShareAppMessage(() => {
    return {
      title: '每日高清壁纸，快来挑选你的专属美图！',
      path: '/pages/wallpaper/wallpaper',
      imageUrl: wallpapers.value[0] || ''
    };
  });
  onShareTimeline(() => {
    return {
      title: '每日高清壁纸，快来挑选你的专属美图！',
      query: '',
      imageUrl: wallpapers.value[0] || ''
    };
  });
</script>

<style lang="less" scoped>
  .wallpaper-page {
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .navbar-box{
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .navbar {
   
   
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    height: 56px;
  
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .nav-left {
    display: flex;
    align-items: flex-end;
    gap: 24px;
  }
  .nav-title {
    color: #242424;
    font-size: 22px;
    font-weight: 600;
    opacity: 0.7;
    padding-bottom: 4px;
    position: relative;
    transition: opacity 0.3s ease;
  }
  .nav-title.active {
    opacity: 1;
  }
  .nav-title.active::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 3px;
    border-radius: 2px;
    background: #242424;
    transition: background-color 0.3s ease;
  }
  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dot-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    opacity: 0.5;
  }
  .camera-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camera-icon {
    color: #fff;
    font-size: 22px;
    opacity: 0.7;
  }
  .wallpaper-scroll {
    flex: 1;
    overflow: hidden;
    padding-top: 8px;
  }
  .wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 0 12px 18px 12px;
  }
  .wallpaper-item {
    width: 100%;
    position: relative;
    background: #f5f5f5;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    padding-top: 177.78%; /* 9:16 手机比例 */
  }
  .wallpaper-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 18px;
    display: block;
  }
  .skeleton {
    animation: skeleton-loading 1.2s infinite linear alternate;
  }
  .skeleton-bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 37%, #f0f0f0 63%);
    border-radius: 18px;
  }
  @keyframes skeleton-loading {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
</style>
