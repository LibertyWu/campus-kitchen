<template>
  <view class="container">
    <!-- 厨房图片和基本信息 -->
    <view class="kitchen-header">
      <view class="kitchen-image">
        <text class="kitchen-image-placeholder">🍽</text>
        <view class="kitchen-price">¥{{ kitchenPrice }}/h</view>
      </view>
      <view class="kitchen-info">
        <text class="kitchen-name">{{ kitchenName }}</text>
        <view class="kitchen-meta">
          <text class="kitchen-rating">⭐ 4.9</text>
          <text class="kitchen-orders"> • 324次预约</text>
          <text class="kitchen-status"> • 开放中 (08:00 - 22:00)</text>
        </view>
      </view>
    </view>

    <!-- 包含设施 -->
    <view class="facilities-section">
      <text class="section-title">包含设施</text>
      <view class="facilities-list">
        <view class="facility-item" v-for="facility in facilities" :key="facility.id">
          <text class="facility-icon">{{ facility.icon }}</text>
          <text class="facility-name">{{ facility.name }}</text>
        </view>
      </view>
    </view>

    <!-- 选择预约时间 -->
    <view class="time-section">
      <text class="section-title">选择预约时间</text>
      <text class="date-display">{{ selectedDate }} ({{ getDateDay(selectedDate) }})</text>
      
      <view class="time-slots">
        <view 
          v-for="slot in timeSlots" 
          :key="slot.id"
          class="time-slot"
          :class="{
            'time-slot-booked': slot.status === 'booked',
            'time-slot-selected': slot.status === 'selected'
          }"
          @click="selectTimeSlot(slot)"
        >
          <text class="time-slot-text">{{ slot.time }}</text>
          <text v-if="slot.status === 'booked'" class="time-slot-status">约满</text>
        </view>
      </view>
    </view>

    <!-- 官方食材包 -->
    <view class="food-section">
      <text class="section-title">官方食材包（可选）</text>
      <view class="food-package" @click="toggleFoodPackage">
        <text class="food-package-name">基础蛋糕食材包</text>
        <text class="food-package-price">¥28.00</text>
        <text class="food-package-arrow">{{ includeFoodPackage ? '▼' : '▶' }}</text>
      </view>
    </view>

    <!-- 总计费用 -->
    <view class="total-section">
      <view class="total-info">
        <text class="total-label">总计 ({{ selectedHours }}小时 + 食材)</text>
        <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <text class="discount-info">已优惠 ¥2.00</text>
    </view>

    <!-- 立即预约按钮 -->
    <view class="reserve-btn-container">
      <view 
        class="btn-primary" 
        @click="submitReserve" 
        :class="{ 'btn-disabled': loading }"
      >
        {{ loading ? '提交中...' : '立即预约' }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      kitchenId: '',
      kitchenName: '',
      kitchenPrice: 15,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedHours: 2,
      includeFoodPackage: false,
      foodPackagePrice: 28,
      totalPrice: 48,
      loading: false,
      facilities: [
        { id: 1, icon: '🔥', name: '烤箱' },
        { id: 2, icon: '🧊', name: '冰箱' },
        { id: 3, icon: '👨‍🍳', name: '厨师机' },
        { id: 4, icon: '📶', name: '免费WiFi' }
      ],
      timeSlots: [
        { id: 1, time: '08:00-10:00', status: 'booked' },
        { id: 2, time: '10:00-12:00', status: 'selected' },
        { id: 3, time: '12:00-14:00', status: 'available' },
        { id: 4, time: '14:00-16:00', status: 'available' },
        { id: 5, time: '16:00-18:00', status: 'available' },
        { id: 6, time: '18:00-20:00', status: 'available' }
      ]
    };
  },
  onLoad(options) {
    this.kitchenId = options.kitchen_id;
    this.kitchenName = options.kitchen_name;
    this.getKitchenDetail();
    this.calculateTotalPrice();
  },
  methods: {
    async getKitchenDetail() {
      try {
        // 调用真实的API获取厨房详情
        const res = await uni.$get(`/api/kitchen/detail?kitchen_id=${this.kitchenId}`);
        
        if (res.code === 0) {
          const kitchen = res.data;
          this.kitchenName = kitchen.name;
          this.kitchenPrice = kitchen.price_per_hour;
          // 可以根据需要更新其他厨房信息
        } else {
          uni.showToast({
            title: res.msg || '获取厨房详情失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('获取厨房详情失败:', error);
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      }
    },
    getDateDay(dateString) {
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const date = new Date(dateString);
      return days[date.getDay()];
    },
    selectTimeSlot(slot) {
      if (slot.status === 'booked') {
        return;
      }
      
      // 重置所有时间段状态
      this.timeSlots.forEach(s => {
        s.status = s.status === 'booked' ? 'booked' : 'available';
      });
      
      // 设置选中的时间段
      slot.status = 'selected';
      
      // 计算时长（这里简化处理，假设每个时间段都是2小时）
      this.selectedHours = 2;
      this.calculateTotalPrice();
    },
    toggleFoodPackage() {
      this.includeFoodPackage = !this.includeFoodPackage;
      this.calculateTotalPrice();
    },
    calculateTotalPrice() {
      let price = this.kitchenPrice * this.selectedHours;
      if (this.includeFoodPackage) {
        price += this.foodPackagePrice;
      }
      // 应用优惠
      this.totalPrice = price - 2;
    },
    async submitReserve() {
      // 验证是否选择了时间段
      const selectedSlot = this.timeSlots.find(slot => slot.status === 'selected');
      if (!selectedSlot) {
        uni.showToast({
          title: '请选择预约时间段',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.loading = true;

      try {
        // 模拟预约成功
        uni.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 1500
        });

        // 跳转到我的预约页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/kitchen/my-reserve'
          });
        }, 1500);
      } catch (error) {
        console.error('预约失败:', error);
        uni.showToast({
          title: '预约失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: var(--color-bg);
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 厨房图片和基本信息 */
.kitchen-header {
  background-color: #FFFFFF;
  border-radius: 0 0 20rpx 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

.kitchen-image {
  width: 100%;
  height: 240rpx;
  background-color: #F9F9F9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.kitchen-image-placeholder {
  font-size: 120rpx;
}

.kitchen-price {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.kitchen-info {
  padding: 20rpx;
}

.kitchen-name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 15rpx;
  display: block;
}

.kitchen-meta {
  display: flex;
  align-items: center;
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

.kitchen-rating {
  font-weight: bold;
  color: #FF9800;
}

/* 通用区块样式 */
.section-title {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 20rpx;
  display: block;
}

/* 包含设施 */
.facilities-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.facilities-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 15rpx;
  background-color: #F9F9F9;
  border-radius: 10rpx;
}

.facility-icon {
  font-size: 32rpx;
}

.facility-name {
  font-size: 22rpx;
  color: var(--color-text-primary);
}

/* 选择预约时间 */
.time-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.date-display {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin-bottom: 25rpx;
  display: block;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.time-slot {
  padding: 20rpx 10rpx;
  border-radius: 10rpx;
  background-color: #F5F5F5;
  text-align: center;
  transition: all 0.3s;
  position: relative;
}

.time-slot:hover {
  background-color: #E8F5E8;
}

.time-slot:active {
  transform: scale(0.95);
}

.time-slot-selected {
  background-color: #55AD67;
  color: #FFFFFF;
}

.time-slot-booked {
  background-color: #F5F5F5;
  color: var(--color-text-auxiliary);
  opacity: 0.7;
}

.time-slot-text {
  font-size: 22rpx;
  display: block;
}

.time-slot-status {
  font-size: 18rpx;
  margin-top: 5rpx;
  display: block;
}

/* 官方食材包 */
.food-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.food-package {
  background-color: #F9F9F9;
  padding: 20rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.food-package:active {
  transform: scale(0.98);
  background-color: #F0F0F0;
}

.food-package-name {
  font-size: 24rpx;
  color: var(--color-text-primary);
  flex: 1;
}

.food-package-price {
  font-size: 24rpx;
  font-weight: bold;
  color: #F44336;
  margin-right: 20rpx;
}

.food-package-arrow {
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

/* 总计费用 */
.total-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 15rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.total-label {
  font-size: 22rpx;
  color: var(--color-text-secondary);
}

.total-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #F44336;
}

.discount-info {
  font-size: 20rpx;
  color: #4CAF50;
  text-align: right;
}

/* 立即预约按钮 */
.reserve-btn-container {
  padding: 0 30rpx 30rpx;
}

.btn-primary {
  background-color: #55AD67;
  color: #FFFFFF;
  border-radius: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4rpx 12rpx rgba(85, 173, 103, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 6rpx rgba(85, 173, 103, 0.3);
}

.btn-disabled {
  opacity: 0.7;
}
</style>
