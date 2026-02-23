<template>
  <view class="container">
    <!-- 顶部用户信息卡片 -->
    <view class="user-info-card">
      <view v-if="userInfo" class="user-info">
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-student-id">校园号：{{ userInfo.student_id }}</text>
        <text class="user-credit">信用分：{{ userInfo.credit }}</text>
      </view>
      <view v-else class="login-prompt">
        <text class="login-text">请先登录</text>
        <view class="login-btn" @click="goToLogin">去登录</view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-item" @click="goToMyReserve">
        <text class="function-text">我的预约</text>
        <text class="function-arrow">→</text>
      </view>
      <view class="function-item" @click="goToMyOrder">
        <text class="function-text">我的订单</text>
        <text class="function-arrow">→</text>
      </view>
      <view class="function-item" @click="logout" v-if="userInfo">
        <text class="function-text logout">退出登录</text>
        <text class="function-arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      // 从本地存储获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    goToMyReserve() {
      if (!this.userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/my-reserve'
      });
    },
    goToMyOrder() {
      if (!this.userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      uni.navigateTo({
        url: '/pages/food/my-order'
      });
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储的用户信息
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('token');
            this.userInfo = null;

            uni.showToast({
              title: '已退出登录',
              icon: 'success',
              duration: 1500
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.user-info-card {
  background-color: #55AD67;
  padding: 60rpx 30rpx;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220rpx;
  border-radius: 0 0 20rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  align-items: center;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
}

.user-student-id {
  font-size: 14px;
  opacity: 0.9;
}

.user-credit {
  font-size: 14px;
  opacity: 0.9;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
  padding: 20rpx 0;
}

.login-text {
  font-size: 18px;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
  letter-spacing: 1rpx;
}

.login-btn {
  font-size: 16px;
  padding: 12rpx 32rpx;
  border-radius: 25rpx;
  background-color: #FFFFFF;
  color: #55AD67;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
  min-width: 160rpx;
  text-align: center;
}

.login-btn:active {
  background-color: #F0F0F0;
  transform: scale(0.95);
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.function-list {
  margin-top: 20rpx;
  background-color: var(--color-card);
  border-radius: 10rpx;
  overflow: hidden;
  margin: 20rpx 30rpx;
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.function-item:active {
  background-color: #F9F9F9;
}

.function-item:last-child {
  border-bottom: none;
}

.function-text {
  font-size: 16px;
  color: var(--color-text-primary);
}

.function-arrow {
  font-size: 14px;
  color: var(--color-text-auxiliary);
}

.logout {
  color: #FF3300;
}
</style>
