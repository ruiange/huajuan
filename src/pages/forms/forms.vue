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
      <picker 
        mode="multiSelector" 
        :range="pickerRange" 
        :value="pickerValue" 
        @change="onServerPickerChange"
        @columnchange="onServerPickerColumnChange"
      >
        <view class="picker-container">
          <text v-if="selectedServerText" class="picker-text">{{ selectedServerText }}</text>
          <text v-else class="picker-placeholder">请选择游戏区服</text>
          <text class="picker-arrow">></text>
        </view>
      </picker>
    </view>

    <view class="form-item">
      <text>贴吧昵称</text>
      <input v-model="formData.tieba_name" placeholder="请输入贴吧昵称" />
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
  import { reactive, ref, computed } from 'vue';
  import {
    addGameAccountAPI,
    getGameAccountAPI,
    updateGameAccountAPI,
  } from '../../api/gameAccount';
  import { onLoad } from '@dcloudio/uni-app';
  import loadingImg from '../../static/13395852403014388.gif';
  import { getGameServerListApi } from '../../api/jiuYin';
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  const formData = ref({
    game_nick_name: '',
    game_AccountNumber: '',
    game_server: '', // 游戏区服（区域-服务器名称）
    tieba_name: '',
    is_default: true,
  });

  const showSuccessModal = ref(false);
  const loading = ref(false);
  const formLoading = ref(false);
  const serverList = ref([]);
  
  // picker相关数据
  const pickerRange = ref([[], []]); // 多列选择器的数据源
  const pickerValue = ref([0, 0]); // 当前选中的索引
  
  // 新增：选中的服务器文本显示
  const selectedServerText = computed(() => {
    if (formData.value.game_server) {
      return formData.value.game_server;
    }
    return '';
  });

  const closeSuccessModal = () => {
    showSuccessModal.value = false;
    uni.navigateBack();
  };

  // 初始化picker数据
  const initPickerData = () => {
    if (!serverList.value || serverList.value.length === 0) return;
    
    // 第一列：区域名称
    const regions = serverList.value.map(region => region.name);
    
    // 第二列：默认显示第一个区域的服务器
    const firstRegionServers = serverList.value[0]?.children?.map(server => server.name) || [];
    
    pickerRange.value = [regions, firstRegionServers];
    
    // 如果有已保存的数据，设置picker初始值
    if (formData.value.game_server || (formData.value.game_server_region && formData.value.game_server_name)) {
      setPickerValueFromSavedData();
    }
  };

  // picker列变化事件
  const onServerPickerColumnChange = (e) => {
    const { column, value } = e.detail;
    
    if (column === 0) {
      // 第一列（区域）变化时，更新第二列（服务器）
      const selectedRegion = serverList.value[value];
      const servers = selectedRegion?.children?.map(server => server.name) || [];
      
      pickerRange.value[1] = servers;
      pickerValue.value[1] = 0; // 重置第二列为第一个选项
    }
  };

  // picker选择完成事件
  const onServerPickerChange = (e) => {
    const { value } = e.detail;
    pickerValue.value = value;
    
    const regionIndex = value[0];
    const serverIndex = value[1];
    
    const selectedRegion = serverList.value[regionIndex];
    const selectedServer = selectedRegion?.children?.[serverIndex];
    
    if (selectedRegion && selectedServer) {
      // 只保存一个参数：区域-服务器名称
      formData.value.game_server = `${selectedRegion.name}-${selectedServer.name}`;
    }
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
    if (!formData.value.game_server) {
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
    getGameServerList()
  });
  // 根据已保存的数据设置picker初始值
  const setPickerValueFromSavedData = () => {
    console.log('开始设置picker值，当前表单数据：', formData.value);
    
    if (!formData.value.game_server && !(formData.value.game_server_region && formData.value.game_server_name)) {
      console.log('没有找到服务器数据');
      return;
    }
    
    // 解析已保存的游戏区服字符串
    let region, server;
    
    // 处理不同的数据格式
    if (formData.value.game_server && formData.value.game_server.includes('-')) {
      // 新格式：区域-服务器
      [region, server] = formData.value.game_server.split('-');
      console.log('使用新格式数据：', { region, server });
    } else if (formData.value.game_server_region && formData.value.game_server_name) {
      // 旧格式：分别存储区域和服务器
      region = formData.value.game_server_region;
      server = formData.value.game_server_name;
      // 统一格式
      formData.value.game_server = `${region}-${server}`;
      console.log('使用旧格式数据，已转换为新格式：', { region, server });
    } else {
      console.log('数据格式不匹配');
      return;
    }
    
    // 查找区域索引
    const regionIndex = serverList.value.findIndex(item => item.name === region);
    console.log('查找区域索引：', { region, regionIndex });
    if (regionIndex === -1) {
      console.log('未找到匹配的区域');
      return;
    }
    
    // 查找服务器索引
    const selectedRegion = serverList.value[regionIndex];
    const serverIndex = selectedRegion.children.findIndex(item => item.name === server);
    console.log('查找服务器索引：', { server, serverIndex, availableServers: selectedRegion.children.map(s => s.name) });
    if (serverIndex === -1) {
      console.log('未找到匹配的服务器');
      return;
    }
    
    // 设置picker值
    pickerValue.value = [regionIndex, serverIndex];
    console.log('设置picker值：', pickerValue.value);
    
    // 确保第二列数据正确
    const servers = selectedRegion.children.map(item => item.name);
    pickerRange.value[1] = servers;
    console.log('更新picker范围：', pickerRange.value);
  };

  const getGameAccount = async (id) => {
    loading.value = true;
    try {
      const { data, code } = await getGameAccountAPI(id);
      console.log('获取到的表单数据：', data);
      if (data) {
        formData.value = data;
        // 如果有服务器数据，设置picker初始值
        if (data.game_server || (data.game_server_region && data.game_server_name)) {
          console.log('检测到服务器数据，准备设置picker值');
          // 等待服务器列表加载完成后再设置picker值
          setTimeout(() => {
            console.log('开始设置picker值，当前服务器列表：', serverList.value);
            setPickerValueFromSavedData();
          }, 200);
        }
      }
    } finally {
      loading.value = false;
    }
  };

  // 新增：switch组件change事件处理
  const onDefaultChange = (e) => {
    formData.value.is_default = e.detail.value;
  };
  const getGameServerList = async () =>{
   try {
     const {data} = await getGameServerListApi()
     serverList.value = data
     console.log('获取到的服务器列表：', serverList.value)
     // 数据加载完成后初始化picker数据
     initPickerData();
   } catch (error) {
     console.error('获取服务器列表失败:', error);
   }
  }
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

      .picker-container {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        cursor: pointer;

        .picker-text {
          color: #333;
          font-size: 14px;
        }

        .picker-placeholder {
          color: #999;
          font-size: 14px;
        }

        .picker-arrow {
          color: #999;
          font-size: 12px;
          transform: rotate(90deg);
        }
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
