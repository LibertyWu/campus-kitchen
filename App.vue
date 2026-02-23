<template>
  <view class="app-container">
    <slot></slot>
    
    <!-- 自定义底部导航栏 -->
    <view class="custom-tab-bar">
      <view 
        v-for="(tab, index) in tabBarList" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="switchTab(tab)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabBarList: [
        {
          text: '首页',
          icon: '🏠',
          path: '/pages/index/index'
        },
        {
          text: '预约',
          icon: '📅',
          path: '/pages/kitchen/list'
        },
        {
          text: '扫码',
          icon: '📱',
          path: '/pages/kitchen/my-reserve'
        },
        {
          text: '订单',
          icon: '📦',
          path: '/pages/food/my-order'
        },
        {
          text: '我的',
          icon: '👤',
          path: '/pages/mine/mine'
        }
      ]
    };
  },
  methods: {
    switchTab(tab) {
      uni.switchTab({
        url: tab.path
      });
    }
  }
};
</script>

<style>
/* 全局样式重置 */
page {
  background-color: #F5F5F5;
  font-size: 14px;
  color: #333333;
}

/* 全局颜色变量 */
:root {
  --color-primary: #55AD67;
  --color-secondary: #FF9F43;
  --color-bg: #F5F5F5;
  --color-card: #FFFFFF;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-auxiliary: #999999;
  --color-border: #EEEEEE;
}

/* 自定义底部导航栏 */
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 2px;
  color: var(--color-text-secondary);
}

.tab-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.tab-item.active .tab-icon,
.tab-item.active .tab-text {
  color: var(--color-primary);
}
</style>