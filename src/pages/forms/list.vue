<template>
  <view v-if="!loading" class="list-container">
    <view class="add-btn" @click="goAdd">添加账号</view>
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else>
      <view v-if="accounts.length === 0" class="empty">
        <image src="/static/images/default.png" class="empty-img" mode="widthFix" />
        <view>暂无账号，点击上方"添加账号"按钮新增</view>
      </view>
      <view v-else>
        <view
          v-for="(item, idx) in accounts"
          :key="item._id || idx"
          class="card"
          @click="goEdit(item._id)"
          @longpress="onLongPress(item._id)"
        >
          <view v-if="item.is_default" class="default-tag">默认</view>
          <view class="card-row">
            <text class="label">游戏昵称：</text>
            <text class="value">{{ item.game_nick_name }}</text>
          </view>
          <view class="card-row">
            <text class="label">游戏账号：</text>
            <text class="value">{{ item.game_AccountNumber }}</text>
          </view>
          <view class="card-row">
            <text class="label">游戏区服：</text>
            <text class="value">{{ item.game_server }}</text>
          </view>
          <view class="card-row">
            <text class="label">贴吧昵称：</text>
            <text class="value">{{ item.tieba_name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view v-if="loading" :style="`width: 100%;height: ${windowHeight}px;`" class="loading-container">
    <image class="loading-img" :src="loadingImg" mode="widthFix"></image>
  </view>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { getMyGameListAccountAPI, deleteGameAccountAPI } from '../../api/gameAccount';
  import { onShow } from '@dcloudio/uni-app';
  import loadingImg from '../../static/13395852403014388.gif';
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  const accounts = ref([]);
  const loading = ref(true);

  const fetchAccounts = async () => {
    loading.value = true;
    try {
      const { data } = await getMyGameListAccountAPI();
      accounts.value = data;
    } catch (e) {
      accounts.value = [];
    } finally {
      loading.value = false;
    }
  };

  onShow(() => {
    fetchAccounts();
  });

  // 新增：跳转到编辑页面
  const goEdit = (id) => {
    uni.navigateTo({
      url: `/pages/forms/forms?id=${id}`,
    });
  };

  // 新增：跳转到新增页面
  const goAdd = () => {
    uni.navigateTo({
      url: '/pages/forms/forms',
    });
  };

  // 新增：长按删除
  const onLongPress = (id) => {
    uni.showModal({
      title: '提示',
      content: '是否删除该账号？',
      success: async (res) => {
        if (res.confirm) {
          await deleteGameAccountAPI(id);
          await uni.showToast({ title: '删除成功', icon: 'success' });
          await fetchAccounts();
        }
      },
    });
  };
</script>

<style scoped lang="less">
  .list-container {
    padding: 20px;
    width: 100%;
  }
  .card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 18px;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
  }
  .default-tag {
    position: absolute;
    top: 10px;
    right: 14px;
    background: linear-gradient(90deg, #ffd700 0%, #ffe066 100%);
    color: #b48800;
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 12px;
    font-weight: bold;
    z-index: 2;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  }
  .card-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;
    align-items: center;
  }
  .card-row:last-child {
    margin-bottom: 0;
  }
  .label {
    color: #888;
    min-width: 80px;
    font-size: 14px;
  }
  .value {
    color: #222;
    font-size: 15px;
    word-break: break-all;
  }
  .loading,
  .empty {
    text-align: center;
    color: #888;
    padding: 30px 0;
  }
  .add-btn {
    width: 100%;
    background: linear-gradient(to right, #d8d9ff, #e0e0fb, #f5ebf2, #fdeeec, #fdeeec);
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 14px 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    cursor: pointer;
    font-weight: bold;
  }
  .empty-img {
    width: 120px;
    margin: 0 auto 16px auto;
    display: block;
    opacity: 0.6;
  }
  .empty {
    text-align: center;
    color: #888;
    padding: 40px 0 30px 0;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
