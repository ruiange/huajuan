<template>
  <view class="form-container">
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

    <view class="sub-btn" type="submit" @click="handleSubmit">提交</view>

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
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import {
    addGameAccountAPI,
    getGameAccountAPI,
    updateGameAccountAPI,
  } from '../../api/gameAccount';
  import { onLoad } from '@dcloudio/uni-app';

  const formData = ref({
    game_nick_name: '',
    game_AccountNumber: '',
    game_address: '',
    tieba_name: '',
  });

  const showSuccessModal = ref(false);

  const closeSuccessModal = () => {
    showSuccessModal.value = false;
    uni.navigateBack();
  };

  const handleSubmit = async () => {
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
    await uni.showLoading({
      title: '加载中',
    });
    const { code, data } = await addGameAccountAPI(params);
    formData.value = data.info;
    uni.hideLoading();
    if (code === 2000) {
      showSuccessModal.value = true;
    }
  };

  const putForm = async (params) => {
    await uni.showLoading({
      title: '加载中',
    });
    const { code, data } = await updateGameAccountAPI(params);
    formData.value = data.info;
    uni.hideLoading();
    if (code === 2000) {
      showSuccessModal.value = true;
    }
  };
  onLoad(() => {
    console.log('=================================');
    getGameAccount();
  });
  const getGameAccount = async () => {
    const { data, code } = await getGameAccountAPI();
    console.log('data', data);
    if (data) {
      formData.value = data;
    }
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
  .sub-btn{
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
</style>
