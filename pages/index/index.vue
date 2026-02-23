<template>
  <view class="container">
    <!-- 顶部位置和通知 -->
    <view class="top-bar">
      <view class="location">
        <text class="location-icon">📍</text>
        <text class="location-text">清华大学 - 紫荆园2号楼</text>
        <text class="location-arrow">▼</text>
      </view>
      <view class="notification" @click="goToNotification">
        <text class="notification-icon">🔔</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input 
          placeholder="搜索厨房、厨具、食材..."
          placeholder-style="color: #999999"
          class="search-field"
        />
      </view>
      <view class="search-btn" @click="goToSearch">搜索</view>
    </view>

    <!-- 优惠Banner -->
    <view class="banner" @click="goToPromotion">
      <view class="banner-content">
        <text class="banner-title">本周特惠</text>
        <text class="banner-subtitle">烘焙室限时 5折</text>
        <view class="banner-btn">立即预约</view>
      </view>
    </view>

    <!-- 功能分类 -->
    <view class="function-category">
      <view class="category-item" @click="goToChineseKitchen">
        <view class="category-icon chinese">🍳</view>
        <text class="category-text">中餐厨房</text>
      </view>
      <view class="category-item" @click="goToBaking">
        <view class="category-icon baking">🧁</view>
        <text class="category-text">创意烘焙</text>
      </view>
      <view class="category-item" @click="goToWesternKitchen">
        <view class="category-icon western">🍝</view>
        <text class="category-text">西餐空间</text>
      </view>
      <view class="category-item" @click="goToFoodMarket">
        <view class="category-icon market">�</view>
        <text class="category-text">食材集市</text>
      </view>
    </view>

    <!-- 热门厨房推荐 -->
    <view class="recommendation">
      <view class="recommendation-header">
        <text class="recommendation-title">热门厨房推荐</text>
        <text class="recommendation-more" @click="goToAllKitchens">查看全部</text>
      </view>
      
      <view class="kitchen-list">
        <view class="kitchen-card" v-for="kitchen in hotKitchens" :key="kitchen.id" @click="goToKitchenDetail(kitchen.id)">
          <view class="kitchen-image">
            <image :src="kitchen.image" mode="aspectFill" class="kitchen-img"></image>
          </view>
          <text class="kitchen-name">{{ kitchen.name }}</text>
          <text class="kitchen-rating">⭐ {{ kitchen.rating }}</text>
          <text class="kitchen-review">({{ kitchen.reviews }}+评价)</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      hotKitchens: []
    };
  },
  onLoad() {
    this.getUserInfo();
    this.getHotKitchens();
  },
  methods: {
    async getHotKitchens() {
      try {
        // 调用真实的API获取厨房列表
        const res = await uni.$get('/api/kitchen/list');
        
        if (res.code === 0) {
          // 取前3个作为热门厨房
          this.hotKitchens = res.data.slice(0, 3).map(kitchen => ({
            id: kitchen.id,
            name: kitchen.name,
            rating: 4.5, // 模拟评分，实际可以从API获取
            reviews: Math.floor(Math.random() * 200) + 50, // 模拟评价数
            image: kitchen.image || '�'
          }));
        } else {
          this.hotKitchens = [];
        }
      } catch (error) {
        console.error('获取热门厨房失败:', error);
        this.hotKitchens = [];
      }
    },
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
    goToNotification() {
      uni.showToast({
        title: '通知功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    goToSearch() {
      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    goToPromotion() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/list'
      });
    },
    goToChineseKitchen() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/list'
      });
    },
    goToBaking() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/list'
      });
    },
    goToWesternKitchen() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/list'
      });
    },
    goToFoodMarket() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/food/list'
      });
    },
    goToAllKitchens() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: '/pages/kitchen/list'
      });
    },
    goToKitchenDetail(kitchenId) {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      uni.navigateTo({
        url: `/pages/kitchen/reserve?kitchen_id=${kitchenId}&kitchen_name=${encodeURIComponent(this.hotKitchens.find(k => k.id === kitchenId).name)}`
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: var(--color-bg);
  min-height: 100vh;
  padding-bottom: 100rpx;
}

/* 顶部位置和通知 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.location {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.location-icon {
  font-size: 24rpx;
}

.location-text {
  font-size: 26rpx;
  color: var(--color-text-primary);
  font-weight: 500;
}

.location-arrow {
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

.notification {
  padding: 10rpx;
}

.notification-icon {
  font-size: 32rpx;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  gap: 15rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  background-color: #F5F5F5;
  border-radius: 25rpx;
  padding: 0 25rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.search-icon {
  font-size: 24rpx;
  color: var(--color-text-auxiliary);
}

.search-field {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 24rpx;
  color: var(--color-text-primary);
}

.search-btn {
  padding: 0 30rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: var(--color-primary);
  color: #FFFFFF;
  border-radius: 25rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: background-color 0.2s;
}

.search-btn:active {
  background-color: #4AA35A;
}

/* 优惠Banner */
.banner {
  margin: 0 30rpx 30rpx;
  background: linear-gradient(135deg, #FF9F43 0%, #FF6B6B 100%);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.banner:active {
  transform: scale(0.98);
}

.banner-content {
  padding: 40rpx;
  color: #FFFFFF;
}

.banner-title {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 10rpx;
  display: block;
}

.banner-subtitle {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.banner-btn {
  display: inline-block;
  padding: 15rpx 30rpx;
  background-color: rgba(255, 255, 255, 0.9);
  color: #FF6B6B;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.banner-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* 功能分类 */
.function-category {
  display: flex;
  justify-content: space-around;
  padding: 0 30rpx 30rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  padding-top: 30rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.category-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.category-icon.chinese {
  background-color: #E8F5E8;
  color: #4CAF50;
}

.category-icon.baking {
  background-color: #FFF3E0;
  color: #FF9800;
}

.category-icon.western {
  background-color: #E3F2FD;
  color: #2196F3;
}

.category-icon.market {
  background-color: #F3E5F5;
  color: #9C27B0;
}

.category-text {
  font-size: 22rpx;
  color: var(--color-text-primary);
  margin-top: 5rpx;
}

/* 热门厨房推荐 */
.recommendation {
  padding: 30rpx;
  background-color: #FFFFFF;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.recommendation-title {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.recommendation-more {
  font-size: 22rpx;
  color: var(--color-text-secondary);
}

.kitchen-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.kitchen-card {
  background-color: #F9F9F9;
  border-radius: 15rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.kitchen-card:active {
  transform: scale(0.98);
}

.kitchen-image {
  width: 100%;
  height: 180rpx;
  background-color: #F0F0F0;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15rpx;
}

.kitchen-img {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.kitchen-name {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 10rpx;
  display: block;
}

.kitchen-rating {
  font-size: 22rpx;
  color: #FF9800;
  font-weight: 500;
  margin-right: 10rpx;
}

.kitchen-review {
  font-size: 20rpx;
  color: var(--color-text-auxiliary);
}

/* 底部导航栏 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rpx;
  padding: 10rpx;
}

.tab-icon {
  font-size: 36rpx;
}

.tab-text {
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

.tab-item.active .tab-text {
  color: var(--color-primary);
  font-weight: bold;
}
</style>
