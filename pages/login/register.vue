<template>
  <view class="container">
    <view class="register-form">
      <view class="form-header">
        <text class="form-title">校园共享厨房</text>
        <text class="form-subtitle">注册</text>
      </view>

      <view class="form-body">
        <!-- 校园号输入框 -->
        <view class="input-group">
          <text class="input-label">校园号：</text>
          <input 
            class="input-field" 
            v-model="form.username" 
            placeholder="请输入校园号"
            placeholder-style="color: #999999"
          />
        </view>

        <!-- 密码输入框 -->
        <view class="input-group">
          <text class="input-label">密码：</text>
          <input 
            class="input-field" 
            v-model="form.password" 
            type="password"
            placeholder="请输入密码"
            placeholder-style="color: #999999"
          />
        </view>

        <!-- 姓名输入框 -->
        <view class="input-group">
          <text class="input-label">姓名：</text>
          <input 
            class="input-field" 
            v-model="form.name" 
            placeholder="请输入姓名"
            placeholder-style="color: #999999"
          />
        </view>

        <!-- 手机号输入框 -->
        <view class="input-group">
          <text class="input-label">手机号：</text>
          <input 
            class="input-field" 
            v-model="form.phone" 
            placeholder="请输入手机号"
            placeholder-style="color: #999999"
          />
        </view>

        <!-- 注册按钮 -->
        <button 
          class="register-btn" 
          @click="register" 
          :style="{ backgroundColor: '#55AD67', color: '#fff' }"
          :loading="loading"
          disabled="loading"
        >
          注册
        </button>

        <!-- 登录入口 -->
        <view class="login-link">
          <text class="login-text">已有账号？</text>
          <text class="login-btn" @click="goToLogin" :style="{ color: '#55AD67' }">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { post } from '../../utils/request';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        name: '',
        phone: ''
      },
      loading: false
    };
  },
  methods: {
    async register() {
      // 表单验证
      if (!this.form.username || !this.form.password || !this.form.name || !this.form.phone) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.loading = true;

      try {
        const res = await post('/api/user/register', {
          username: this.form.username,
          password: this.form.password,
          name: this.form.name,
          phone: this.form.phone
        });

        if (res.code === 0) {
          uni.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          });

          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 1500);
        }
      } catch (error) {
        console.error('注册失败:', error);
        uni.showToast({
          title: '注册失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.loading = false;
      }
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding: 60rpx 30rpx;
}

.register-form {
  background-color: #FFFFFF;
  border-radius: 10rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.form-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #55AD67;
  margin-bottom: 10rpx;
}

.form-subtitle {
  display: block;
  font-size: 16px;
  color: #333333;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.input-group {
  display: flex;
  align-items: center;
  padding-bottom: 10rpx;
  border-bottom: 1px solid #EEEEEE;
}

.input-label {
  width: 120rpx;
  font-size: 14px;
  color: #333333;
}

.input-field {
  flex: 1;
  font-size: 14px;
  color: #333333;
  padding: 10rpx 0;
}

.register-btn {
  margin-top: 20rpx;
  padding: 20rpx 0;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8rpx;
  border: none;
}

.login-link {
  display: flex;
  justify-content: center;
  gap: 10rpx;
  margin-top: 20rpx;
}

.login-text {
  font-size: 14px;
  color: #666666;
}

.login-btn {
  font-size: 14px;
  font-weight: bold;
}
</style>
