<template>
  <view class="container">
    <view class="order-list">
      <view 
        v-for="order in orders" 
        :key="order.id"
        class="order-card"
      >
        <text class="order-title">订单号：{{ order.id }}</text>
        <text class="order-info">下单时间：{{ order.created_at }}</text>
        <text class="order-info">总金额：¥{{ order.total_amount }}</text>
        <view class="order-status">
          <text 
            class="status-text" 
            :class="{
              'status-pending': order.status === 'pending',
              'status-completed': order.status === 'completed',
              'status-cancelled': order.status === 'cancelled'
            }"
          >
            {{ getStatusText(order.status) }}
          </text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="orders.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request';

export default {
  data() {
    return {
      orders: []
    };
  },
  onLoad() {
    this.getMyOrders();
  },
  methods: {
    async getMyOrders() {
      try {
        const res = await get('/api/order/my');
        if (res && res.data) {
          this.orders = res.data;
        }
      } catch (error) {
        console.error('获取订单列表失败:', error);
        this.orders = [];
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'pending':
          return '待支付';
        case 'completed':
          return '已完成';
        case 'cancelled':
          return '已取消';
        default:
          return '未知';
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: var(--color-bg);
  min-height: 100vh;
  padding: 30rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background-color: var(--color-card);
  padding: 20rpx;
  border-radius: 10rpx;
}

.order-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 10rpx;
}

.order-info {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 8rpx;
}

.order-status {
  margin-top: 10rpx;
}

.status-text {
  font-size: 12px;
  font-weight: bold;
}

.status-pending {
  color: var(--color-primary);
}

.status-completed {
  color: #00CC00;
}

.status-cancelled {
  color: var(--color-text-auxiliary);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--color-text-auxiliary);
  font-size: 14px;
}
</style>
