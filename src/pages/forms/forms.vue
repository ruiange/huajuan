<template>
  <view v-if="!loading" class="form-container">
    <view class="form-item">
      <text>游戏昵称</text>
      <input v-model="formData.game_nick_name" placeholder="请输入游戏昵称" />
    </view>

    <view class="form-item">
      <text>游戏账号</text>
      <input v-model="formData.game_AccountNumber" placeholder="请输入游戏账号" />
    </view>

    <view class="form-item">
      <text>游戏区服</text>
      <input v-model="formData.game_address" placeholder="请输入游戏区服" />
    </view>

    <view class="form-item">
      <text>贴吧昵称</text>
      <input v-model="formData.tieba_name" placeholder="请输入游戏区服" />
    </view>

    <view class="form-item">
      <text>是否默认</text>
      <switch :checked="formData.is_default" @change="onDefaultChange" />
    </view>

    <view
      class="sub-btn"
      :class="{ disabled: loading }"
      :disabled="loading"
      @click="handleSubmit"
      >{{ loading ? '加载中...' : '提交' }}</view
    >

    <!-- 成功提示弹窗 -->
    <view v-if="showSuccessModal" class="modal-overlay">
      <view class="modal-content">
        <view class="modal-body">
          <text class="success-icon">✓</text>
          <text class="success-text">保存成功</text>
        </view>
        <view class="modal-footer">
          <view @click="closeSuccessModal" class="confirm-btn">确定</view>
        </view>
      </view>
    </view>
  </view>

  <view v-if="loading" :style="`width: 100%;height: ${windowHeight}px;`" class="loading-container">
    <image class="loading-img" :src="loadingImg" mode="widthFix"></image>
  </view>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import {
    addGameAccountAPI,
    getGameAccountAPI,
    updateGameAccountAPI,
  } from '../../api/gameAccount';
  import { onLoad } from '@dcloudio/uni-app';
  import loadingImg from '../../static/13395852403014388.gif';
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  const formData = ref({
    game_nick_name: '',
    game_AccountNumber: '',
    game_address: '',
    tieba_name: '',
    is_default: true,
  });

  const showSuccessModal = ref(false);
  const loading = ref(false);
  const formLoading = ref(false);

  const closeSuccessModal = () => {
    showSuccessModal.value = false;
    uni.navigateBack();
  };

  const handleSubmit = async () => {
    if (loading.value) return;
    console.log('表单数据：', formData);
    //添加字段校验
    if (!formData.value.game_nick_name) {
      await uni.showToast({
        title: '游戏昵称不能为空',
        icon: 'none',
      });
      return;
    }
    if (!formData.value.game_AccountNumber) {
      await uni.showToast({
        title: '游戏账号不能为空',
        icon: 'none',
      });
      return;
    }
    if (!formData.value.game_address) {
      await uni.showToast({
        title: '游戏区服不能为空',
        icon: 'none',
      });
      return;
    }
    if (!formData.value.tieba_name) {
      await uni.showToast({
        title: '贴吧昵称不能为空',
        icon: 'none',
      });
      return;
    }
    const params = JSON.parse(JSON.stringify(formData.value));

    if ('_id' in params) {
      await putForm(params);
    } else {
      await postForm(params);
    }
  };
  const postForm = async (params) => {
    if(formLoading.value) return;
    formLoading.value = true;
    try {
      await uni.showLoading({
        title: '加载中',
      });
      const { code, data } = await addGameAccountAPI(params);
      formData.value = data.info;
      if (code === 2000) {
        showSuccessModal.value = true;
      }
    } finally {
      formLoading.value = false;
      uni.hideLoading();
    }
  };
  const pages = getCurrentPages();
  const goBack = () => {
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      uni.reLaunch({
        url: '/pages/forms/list',
      });
    }
  };

  const putForm = async (params) => {
    if(formLoading.value) return;

    formLoading.value = true;
    try {
      await uni.showLoading({
        title: '加载中',
      });
      const { code, data } = await updateGameAccountAPI(params);
      formData.value = data.info;
      if (code === 2000) {
        showSuccessModal.value = true;
      }
    } finally {
      formLoading.value = false;
      uni.hideLoading();
    }
  };
  const id = ref(null);
  onLoad((options) => {
    if ('id' in options) {
      id.value = options.id;
      getGameAccount(id.value);
    }
  });
  const getGameAccount = async (id) => {
    loading.value = true;
    try {
      const { data, code } = await getGameAccountAPI(id);
      console.log('data', data);
      if (data) {
        formData.value = data;
      }
    } finally {
      loading.value = false;
    }
  };

  // 新增：switch组件change事件处理
  const onDefaultChange = (e) => {
    formData.value.is_default = e.detail.value;
  };
</script>

<style scoped lang="less">
  .form-container {
    padding: 20px;
    width: 100%;
    .form-item {
      margin-bottom: 20px;
      box-sizing: border-box;
      text {
        display: block;
        margin-bottom: 8px;
      }

      input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
    }

    button {
      width: 100%;
      height: 44px;
      background-color: #007aff;
      color: #fff;
      border-radius: 4px;
      border: none;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 8px;
    width: 80%;
    max-width: 300px;
    padding: 20px;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  .success-icon {
    font-size: 40px;
    color: #07c160;
    margin-bottom: 10px;
  }

  .success-text {
    font-size: 16px;
    color: #333;
  }

  .modal-footer {
    margin-top: 20px;
    text-align: center;
  }

  .confirm-btn {
    background: linear-gradient(to right, #d8d9ff, #e0e0fb, #f5ebf2, #fdeeec, #fdeeec);
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sub-btn {
    background: linear-gradient(to right, #d8d9ff, #e0e0fb, #f5ebf2, #fdeeec, #fdeeec);
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 14px 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
  }
  .sub-btn.disabled {
    opacity: 0.6;
    pointer-events: none;
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
