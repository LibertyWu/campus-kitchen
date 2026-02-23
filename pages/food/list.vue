<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input 
          type="text" 
          placeholder="搜索食材"
          v-model="searchQuery"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 分类筛选 -->
    <view class="category-tabs">
      <scroll-view scroll-x="true" class="category-scroll">
        <view 
          v-for="category in categories" 
          :key="category"
          class="category-tab"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </view>
      </scroll-view>
    </view>

    <!-- 食材列表 -->
    <view class="food-list">
      <view 
        v-for="food in filteredFoods" 
        :key="food.id"
        class="food-card"
      >
        <view class="food-image">
          <image :src="food.image" mode="aspectFill"></image>
        </view>
        <view class="food-info">
          <text class="food-name">{{ food.name }}</text>
          <text class="food-category">{{ food.category }}</text>
          <view class="food-price-stock">
            <text class="food-price">¥{{ food.price }}/{{ food.unit }}</text>
            <text class="food-stock">库存：{{ food.stock }} {{ food.unit }}</text>
          </view>
          <view class="food-actions">
            <view class="quantity-control" v-if="getCartItem(food.id)">
              <view class="quantity-btn" @click="decreaseQuantity(food.id)">-</view>
              <text class="quantity">{{ getCartItem(food.id).quantity }}</text>
              <view class="quantity-btn" @click="increaseQuantity(food.id)">+</view>
            </view>
            <view 
              class="add-btn" 
              v-else
              @click="addToCart(food)"
            >
              加入购物车
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredFoods.length === 0" class="empty-state">
        <text class="empty-icon">🍎</text>
        <text class="empty-text">暂无食材</text>
      </view>
    </view>

    <!-- 购物车 -->
    <view v-if="cart.length > 0" class="cart-footer">
      <view class="cart-info">
        <text class="cart-count">购物车：{{ cart.length }}件</text>
        <text class="cart-total">合计：¥{{ calculateTotal() }}</text>
      </view>
      <view 
        class="checkout-btn" 
        @click="goToCheckout"
      >
        去结算
      </view>
    </view>
  </view>
</template>

<script>
import { get, post } from '../../utils/request';

export default {
  data() {
    return {
      foods: [],
      cart: [],
      searchQuery: '',
      categories: ['全部', '蔬菜', '肉类', '蛋类', '水果', '调料'],
      selectedCategory: '全部'
    };
  },
  onLoad() {
    this.getFoodList();
  },
  computed: {
    filteredFoods() {
      let result = [...this.foods];
      
      // 按分类筛选
      if (this.selectedCategory !== '全部') {
        result = result.filter(food => food.category === this.selectedCategory);
      }
      
      // 按搜索关键词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(food => 
          food.name.toLowerCase().includes(query) ||
          food.category.toLowerCase().includes(query)
        );
      }
      
      return result;
    }
  },
  methods: {
    async getFoodList() {
      try {
        // 调用真实的API获取食材列表
        const res = await uni.$get('/api/food/list');
        
        if (res.code === 0) {
          // 处理API返回的数据
          this.foods = res.data.map(food => ({
            id: food.id,
            name: food.name,
            category: food.category,
            price: food.price,
            unit: food.unit,
            stock: food.stock,
            image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(food.name)}%20fresh%20food&image_size=square`,
            description: food.description
          }));
        } else {
          this.foods = [];
          uni.showToast({
            title: res.msg || '获取食材列表失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('获取食材列表失败:', error);
        this.foods = [];
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      }
    },
    addToCart(food) {
      // 检查购物车中是否已有该食材
      const existingItem = this.cart.find(item => item.id === food.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          ...food,
          quantity: 1
        });
      }

      uni.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1000
      });
    },
    increaseQuantity(foodId) {
      const item = this.cart.find(item => item.id === foodId);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(foodId) {
      const itemIndex = this.cart.findIndex(item => item.id === foodId);
      if (itemIndex !== -1) {
        const item = this.cart[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          this.cart.splice(itemIndex, 1);
        }
      }
    },
    getCartItem(foodId) {
      return this.cart.find(item => item.id === foodId);
    },
    handleSearch() {
      // 搜索功能已在computed中实现
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    calculateTotal() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0).toFixed(2);
    },
    async goToCheckout() {
      if (this.cart.length === 0) {
        uni.showToast({
          title: '购物车为空',
          icon: 'none',
          duration: 2000
        });
        return;
      }

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

      // 准备订单数据
      const orderData = {
        total_amount: parseFloat(this.calculateTotal()),
        items: this.cart.map(item => ({
          food_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }))
      };

      try {
        const res = await uni.$post('/api/order/create', orderData);
        if (res.code === 0) {
          uni.showToast({
            title: '订单已提交',
            icon: 'success',
            duration: 1500
          });
          // 清空购物车
          this.cart = [];
        } else {
          uni.showToast({
            title: res.msg || '订单提交失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('提交订单失败:', error);
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      }
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

/* 搜索栏样式 */
.search-bar {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 25rpx;
  padding: 0 20rpx;
  height: 50rpx;
}

.search-icon {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-right: 10rpx;
}

.search-input input {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.search-input input::placeholder {
  color: var(--color-text-auxiliary);
}

/* 分类标签样式 */
.category-tabs {
  background-color: #FFFFFF;
  padding: 15rpx 0;
  margin-bottom: 10rpx;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-tab {
  display: inline-block;
  padding: 8rpx 24rpx;
  margin-right: 16rpx;
  font-size: 14px;
  color: var(--color-text-secondary);
  background-color: #F5F5F5;
  border-radius: 20rpx;
  transition: all 0.2s;
}

.category-tab.active {
  color: #FFFFFF;
  background-color: var(--color-primary);
}

/* 食材列表样式 */
.food-list {
  padding: 15rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}

.food-card {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.food-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.05);
}

.food-image {
  width: 100%;
  height: 200rpx;
  overflow: hidden;
}

.food-image image {
  width: 100%;
  height: 100%;
}

.food-info {
  padding: 16rpx;
}

.food-name {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.food-category {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10rpx;
}

.food-price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.food-price {
  font-size: 14px;
  font-weight: bold;
  color: #FF3300;
}

.food-stock {
  font-size: 11px;
  color: var(--color-text-auxiliary);
}

.food-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  padding: 8rpx 20rpx;
  font-size: 13px;
  border-radius: 16rpx;
  background-color: var(--color-primary);
  color: #FFFFFF;
  transition: background-color 0.2s;
}

.add-btn:active {
  background-color: #4AA35A;
}

/* 数量控制样式 */
.quantity-control {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 16rpx;
  overflow: hidden;
}

.quantity-btn {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--color-text-secondary);
  background-color: #F5F5F5;
}

.quantity-btn:active {
  background-color: #E8E8E8;
}

.quantity {
  width: 50rpx;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-primary);
  background-color: #FFFFFF;
  border-left: 1rpx solid #E8E8E8;
  border-right: 1rpx solid #E8E8E8;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--color-text-auxiliary);
  font-size: 14px;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

/* 购物车底部样式 */
.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 15rpx 30rpx;
  box-shadow: 0 -2rpx 15rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-info {
  flex: 1;
}

.cart-count {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 5rpx;
}

.cart-total {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #FF3300;
}

.checkout-btn {
  padding: 12rpx 32rpx;
  font-size: 14px;
  border-radius: 20rpx;
  background-color: var(--color-primary);
  color: #FFFFFF;
  transition: background-color 0.2s;
  box-shadow: 0 2rpx 8rpx rgba(74, 163, 90, 0.3);
}

.checkout-btn:active {
  background-color: #4AA35A;
  box-shadow: 0 1rpx 4rpx rgba(74, 163, 90, 0.3);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .food-list {
    grid-template-columns: 1fr;
  }
  
  .food-card {
    display: flex;
  }
  
  .food-image {
    width: 120rpx;
    height: 120rpx;
  }
  
  .food-info {
    flex: 1;
  }
}
</style>
