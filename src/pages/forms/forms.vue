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

    <button type="submit" @click="handleSubmit">提交</button>
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
    })
    const { code } = await addGameAccountAPI(params);
    uni.hideLoading();
    if (code === 2000) {
      await uni.showToast({
        title: '保存成功',
        icon: 'success',
      });
    }
  };
  const putForm = async (params) => {
    await uni.showLoading({
      title: '加载中',
    })
    const { code } = await updateGameAccountAPI(params);
    uni.hideLoading();
    if (code === 2000) {
      await uni.showToast({
        title: '保存成功',
        icon: 'success',
      });
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
</style>
