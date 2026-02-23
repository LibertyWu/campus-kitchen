<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input 
          placeholder="输入校区区域搜索"
          placeholder-style="color: #999999"
          class="search-field"
        />
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view class="filter-tab active" @click="selectFilter('all')">全部</view>
      <view class="filter-tab" @click="selectFilter('chinese')">中餐厨房</view>
      <view class="filter-tab" @click="selectFilter('western')">西餐空间</view>
      <view class="filter-tab" @click="selectFilter('baking')">烘焙工坊</view>
      <view class="filter-tab" @click="selectFilter('dining')">聚餐大厅</view>
    </view>

    <!-- 排序选项 -->
    <view class="sort-options">
      <view class="sort-option active" @click="selectSort('default')">综合排序</view>
      <view class="sort-option" @click="selectSort('distance')">距离优先</view>
      <view class="sort-option" @click="selectSort('price')">价格</view>
      <view class="sort-option" @click="selectSort('filter')">筛选</view>
    </view>

    <!-- 厨房列表 -->
    <view class="kitchen-list">
      <view 
        v-for="kitchen in kitchens" 
        :key="kitchen.id"
        class="kitchen-card"
        @click="goToReserve(kitchen)"
      >
        <view class="kitchen-image">
          <text class="kitchen-image-placeholder">{{ kitchen.image }}</text>
          <view class="kitchen-price">¥{{ kitchen.price_per_hour }}/h</view>
        </view>
        <text class="kitchen-distance">{{ kitchen.distance }}</text>
        <text class="kitchen-name">{{ kitchen.name }}</text>
        <view class="kitchen-status">
          <text 
            class="status-text" 
            :class="{
              'status-available': kitchen.status === 'available',
              'status-busy': kitchen.status === 'busy',
              'status-unavailable': kitchen.status === 'unavailable'
            }"
          >
            {{ getStatusText(kitchen.status) }}
          </text>
        </view>
        <text class="kitchen-description">{{ kitchen.description }}</text>
        <view class="kitchen-facilities">
          <view 
            v-for="facility in kitchen.facilities" 
            :key="facility"
            class="facility-tag"
          >
            {{ facility }}
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="kitchens.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      kitchens: [],
      selectedFilter: 'all',
      selectedSort: 'default'
    };
  },
  onLoad() {
    this.getKitchenList();
  },
  methods: {
    async getKitchenList() {
      try {
        // 调用真实的API获取厨房列表
        const res = await uni.$get('/api/kitchen/list');
        
        if (res.code === 0) {
          // 处理API返回的数据
          this.kitchens = res.data.map(kitchen => ({
            id: kitchen.id,
            name: kitchen.name,
            location: kitchen.location,
            capacity: kitchen.capacity,
            status: kitchen.status,
            price_per_hour: kitchen.price_per_hour,
            distance: `${kitchen.distance}km`,
            image: kitchen.image || '🍽',
            description: kitchen.description || '暂无描述',
            facilities: kitchen.equipment ? kitchen.equipment.split(',').map(item => item.trim()) : []
          }));
        } else {
          this.kitchens = [];
          uni.showToast({
            title: res.msg || '获取厨房列表失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('获取厨房列表失败:', error);
        this.kitchens = [];
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'available':
          return '空闲';
        case 'busy':
          return '使用中';
        case 'unavailable':
          return '异常';
        default:
          return '未知';
      }
    },
    selectFilter(filter) {
      this.selectedFilter = filter;
      // 这里可以根据筛选条件过滤厨房列表
      uni.showToast({
        title: `已选择${this.getFilterName(filter)}`,
        icon: 'none',
        duration: 1500
      });
    },
    selectSort(sort) {
      this.selectedSort = sort;
      // 这里可以根据排序条件排序厨房列表
      uni.showToast({
        title: `已选择${this.getSortName(sort)}`,
        icon: 'none',
        duration: 1500
      });
    },
    getFilterName(filter) {
      const filterNames = {
        'all': '全部',
        'chinese': '中餐厨房',
        'western': '西餐空间',
        'baking': '烘焙工坊',
        'dining': '聚餐大厅'
      };
      return filterNames[filter] || '全部';
    },
    getSortName(sort) {
      const sortNames = {
        'default': '综合排序',
        'distance': '距离优先',
        'price': '价格排序',
        'filter': '筛选'
      };
      return sortNames[sort] || '综合排序';
    },
    goToReserve(kitchen) {
      if (kitchen.status !== 'available') {
        uni.showToast({
          title: '当前不可预约',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      uni.navigateTo({
        url: `/pages/kitchen/reserve?kitchen_id=${kitchen.id}&kitchen_name=${encodeURIComponent(kitchen.name)}`
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

/* 搜索栏 */
.search-bar {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.search-input {
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

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 15rpx;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 10rpx;
}

.filter-tab {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: var(--color-text-secondary);
  background-color: #F5F5F5;
  transition: all 0.3s;
}

.filter-tab.active {
  background-color: #55AD67;
  color: #FFFFFF;
  font-weight: bold;
}

.filter-tab:active {
  transform: scale(0.95);
}

/* 排序选项 */
.sort-options {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx 20rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.sort-option {
  font-size: 22rpx;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 5rpx;
}

.sort-option.active {
  color: var(--color-primary);
  font-weight: bold;
}

/* 厨房列表 */
.kitchen-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.kitchen-card {
  background-color: #FFFFFF;
  border-radius: 15rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.kitchen-card:active {
  transform: scale(0.98);
}

.kitchen-image {
  width: 100%;
  height: 200rpx;
  background-color: #F9F9F9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.kitchen-image-placeholder {
  font-size: 100rpx;
}

.kitchen-price {
  position: absolute;
  top: 15rpx;
  right: 15rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  padding: 8rpx 16rpx;
  border-radius: 15rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.kitchen-distance {
  position: absolute;
  top: 15rpx;
  left: 15rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  padding: 8rpx 16rpx;
  border-radius: 15rpx;
  font-size: 20rpx;
}

.kitchen-name {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 10rpx;
  padding: 20rpx 20rpx 0;
  display: block;
}

.kitchen-status {
  padding: 0 20rpx 10rpx;
}

.status-text {
  font-size: 20rpx;
  font-weight: bold;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  display: inline-block;
}

.status-available {
  color: #4CAF50;
  background-color: #E8F5E8;
}

.status-busy {
  color: #FF9800;
  background-color: #FFF3E0;
}

.status-unavailable {
  color: #F44336;
  background-color: #FFEBEE;
}

.kitchen-description {
  font-size: 20rpx;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: 15rpx;
  padding: 0 20rpx;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

.kitchen-facilities {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  padding: 0 20rpx 20rpx;
}

.facility-tag {
  background-color: #F0F0F0;
  color: var(--color-text-secondary);
  padding: 8rpx 16rpx;
  border-radius: 15rpx;
  font-size: 18rpx;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--color-text-auxiliary);
  font-size: 24rpx;
}

/* 滚动条样式 */
.filter-tabs::-webkit-scrollbar {
  display: none;
}
</style>
