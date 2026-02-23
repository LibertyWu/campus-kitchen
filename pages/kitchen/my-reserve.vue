<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">我的预约订单</text>
    </view>

    <!-- 订单状态分类 -->
    <view class="status-tabs">
      <view 
        v-for="tab in statusTabs" 
        :key="tab.key"
        class="status-tab"
        :class="{ 'active': activeTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 预约列表 -->
    <view class="reserve-list">
      <!-- 待使用订单 -->
      <view 
        v-for="reserve in pendingReserves" 
        :key="reserve.id"
        class="reserve-card pending"
      >
        <view class="reserve-header">
          <view class="reserve-status">
            <text class="status-badge pending">待使用</text>
            <text class="reserve-time">{{ reserve.date }} {{ reserve.time }}</text>
          </view>
          <text class="time-left">剩{{ reserve.timeLeft }}小时</text>
        </view>
        <text class="reserve-title">{{ reserve.kitchenName }}</text>
        <text class="reserve-detail">预约时长：{{ reserve.duration }}小时</text>
        <text class="reserve-detail">附加服务：{{ reserve.service }}</text>
        <text class="reserve-price">¥{{ reserve.price }}</text>
        <view class="reserve-actions">
          <view class="btn-secondary" @click="cancelReserve(reserve.id)">取消预约</view>
          <view class="btn-primary" @click="verifyReserve(reserve.id)">核销入场</view>
        </view>
      </view>

      <!-- 已完成订单 -->
      <view 
        v-for="reserve in completedReserves" 
        :key="reserve.id"
        class="reserve-card completed"
      >
        <view class="reserve-header">
          <view class="reserve-status">
            <text class="status-badge completed">FINISHED</text>
            <text class="reserve-time">{{ reserve.date }}</text>
          </view>
        </view>
        <text class="reserve-title">{{ reserve.kitchenName }}</text>
        <text class="reserve-detail">使用时长：{{ reserve.duration }}小时</text>
        <text class="reserve-price">¥{{ reserve.price }}</text>
        <view class="reserve-actions">
          <view class="btn-tertiary" @click="rateReserve(reserve.id)">评价赢积分</view>
          <view class="btn-secondary" @click="bookAgain(reserve.id)">再来一单</view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredReserves.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>

    <!-- 本月厨艺报告 -->
    <view class="cooking-report">
      <text class="report-title">本月厨艺报告</text>
      <view class="report-stats">
        <view class="report-stat">
          <text class="stat-value">{{ cookingStats.times }}</text>
          <text class="stat-label">下厨次数</text>
        </view>
        <view class="report-stat">
          <text class="stat-value">{{ cookingStats.duration }}</text>
          <text class="stat-label">累计时长</text>
        </view>
        <view class="report-stat">
          <text class="stat-value">{{ cookingStats.likes }}</text>
          <text class="stat-label">获赞能量</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'all',
      statusTabs: [
        { key: 'all', name: '全部' },
        { key: 'pending', name: '待使用' },
        { key: 'completed', name: '待评价' },
        { key: 'cancelled', name: '已退款' }
      ],
      pendingReserves: [],
      completedReserves: [],
      cancelledReserves: []
    };
  },
  computed: {
    filteredReserves() {
      if (this.activeTab === 'all') {
        return [...this.pendingReserves, ...this.completedReserves, ...this.cancelledReserves];
      } else if (this.activeTab === 'pending') {
        return this.pendingReserves;
      } else if (this.activeTab === 'completed') {
        return this.completedReserves;
      } else if (this.activeTab === 'cancelled') {
        return this.cancelledReserves;
      }
      return [];
    },
    cookingStats() {
      return {
        times: 12,
        duration: '34.5 h',
        likes: '1.2k'
      };
    }
  },
  onLoad() {
    this.getMyReserves();
  },
  methods: {
    async getMyReserves() {
      // 检查用户是否登录
      const userInfo = uni.getStorageSync('userInfo');
      if (!userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        uni.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }

      try {
        // 调用真实的API获取预约列表
        const res = await uni.$get(`/api/reserve/list?user_id=${userInfo.id}`);
        
        if (res.code === 0) {
          // 处理API返回的数据
          this.pendingReserves = [];
          this.completedReserves = [];
          this.cancelledReserves = [];
          
          res.data.forEach(reserve => {
            const reserveData = {
              id: reserve.id,
              kitchenName: reserve.kitchen_name,
              date: reserve.date,
              time: `${reserve.start_time} - ${reserve.end_time}`,
              duration: reserve.duration,
              service: reserve.include_food_package ? '基础食材包 ×1' : '无附加服务',
              price: reserve.total_amount,
              status: reserve.status
            };
            
            // 计算剩余时间（简化处理）
            if (reserve.status === 'pending') {
              reserveData.timeLeft = 4; // 模拟剩余时间
              this.pendingReserves.push(reserveData);
            } else if (reserve.status === 'completed') {
              this.completedReserves.push(reserveData);
            } else if (reserve.status === 'cancelled') {
              this.cancelledReserves.push(reserveData);
            }
          });
        } else {
          uni.showToast({
            title: res.msg || '获取预约列表失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('获取预约列表失败:', error);
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      }
    },
    selectTab(tabKey) {
      this.activeTab = tabKey;
    },
    async cancelReserve(reserveId) {
      uni.showModal({
        title: '取消预约',
        content: '确定要取消该预约吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 模拟取消预约
              this.pendingReserves = this.pendingReserves.filter(item => item.id !== reserveId);
              this.cancelledReserves.push({
                id: reserveId,
                kitchenName: '紫荆园 烘焙室 A2',
                date: '2026-02-12',
                time: '今天 14:00',
                duration: 2.0,
                price: 48.00,
                status: 'cancelled'
              });

              uni.showToast({
                title: '预约已取消',
                icon: 'success',
                duration: 1500
              });
            } catch (error) {
              console.error('取消预约失败:', error);
              uni.showToast({
                title: '取消预约失败',
                icon: 'none',
                duration: 2000
              });
            }
          }
        }
      });
    },
    verifyReserve(reserveId) {
      uni.showToast({
        title: '核销入场功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    rateReserve(reserveId) {
      uni.showToast({
        title: '评价功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    bookAgain(reserveId) {
      uni.showToast({
        title: '再来一单功能开发中',
        icon: 'none',
        duration: 2000
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

/* 页面标题 */
.page-header {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-bottom: 1rpx solid var(--color-border);
}

.page-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

/* 订单状态分类 */
.status-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 30rpx;
  gap: 20rpx;
  border-bottom: 1rpx solid var(--color-border);
}

.status-tab {
  padding: 20rpx 0;
  font-size: 24rpx;
  color: var(--color-text-secondary);
  position: relative;
  transition: all 0.3s;
}

.status-tab.active {
  color: var(--color-primary);
  font-weight: bold;
}

.status-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background-color: var(--color-primary);
  border-radius: 2rpx;
}

/* 预约列表 */
.reserve-list {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

/* 预约卡片 */
.reserve-card {
  background-color: #FFFFFF;
  border-radius: 15rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.reserve-card:active {
  transform: scale(0.98);
}

/* 预约卡片头部 */
.reserve-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.reserve-status {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.status-badge {
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  font-size: 18rpx;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #E8F5E8;
  color: #4CAF50;
}

.status-badge.completed {
  background-color: #F5F5F5;
  color: var(--color-text-secondary);
}

.reserve-time {
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

.time-left {
  font-size: 20rpx;
  font-weight: bold;
  color: #F44336;
  background-color: #FFEBEE;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
}

/* 预约卡片内容 */
.reserve-title {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 15rpx;
  display: block;
}

.reserve-detail {
  font-size: 20rpx;
  color: var(--color-text-secondary);
  margin-bottom: 10rpx;
  display: block;
}

.reserve-price {
  font-size: 24rpx;
  font-weight: bold;
  color: #F44336;
  margin-bottom: 20rpx;
  display: block;
  text-align: right;
}

/* 预约卡片操作按钮 */
.reserve-actions {
  display: flex;
  gap: 15rpx;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 12rpx 24rpx;
  font-size: 20rpx;
  border-radius: 8rpx;
  background-color: #F5F5F5;
  color: var(--color-text-secondary);
  transition: all 0.3s;
  border: 1rpx solid var(--color-border);
}

.btn-secondary:active {
  background-color: #E0E0E0;
  transform: scale(0.95);
}

.btn-primary {
  padding: 12rpx 24rpx;
  font-size: 20rpx;
  border-radius: 8rpx;
  background-color: #55AD67;
  color: #FFFFFF;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary:active {
  background-color: #4AA35A;
  transform: scale(0.95);
}

.btn-tertiary {
  padding: 12rpx 24rpx;
  font-size: 20rpx;
  border-radius: 8rpx;
  background-color: #FFF3E0;
  color: #FF9800;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-tertiary:active {
  background-color: #FFE0B2;
  transform: scale(0.95);
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--color-text-auxiliary);
  font-size: 24rpx;
  background-color: #FFFFFF;
  border-radius: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 本月厨艺报告 */
.cooking-report {
  background: linear-gradient(135deg, #55AD67 0%, #7ED957 100%);
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 15rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.report-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 30rpx;
  display: block;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.report-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.report-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}
</style>
