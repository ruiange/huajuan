<template>
  <view class="list-container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else>
      <view v-if="accounts.length === 0" class="empty">暂无数据</view>
      <view v-else>
        <view v-for="(item, idx) in accounts" :key="item._id || idx" class="card">
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
            <text class="value">{{ item.game_address }}</text>
          </view>
          <view class="card-row">
            <text class="label">贴吧昵称：</text>
            <text class="value">{{ item.tieba_name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { getMyGameListAccountAPI } from '../../api/gameAccount';

  const accounts = ref([]);
  const loading = ref(true);

  const fetchAccounts = async () => {
    loading.value = true;
    try {
      const { data } = await getMyGameListAccountAPI();
      accounts.value = data;
      console.log('data', data);
    } catch (e) {
      accounts.value = [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchAccounts();
  });
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
</style>
