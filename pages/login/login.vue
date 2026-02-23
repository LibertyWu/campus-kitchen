<template>
  <view class="container">
    <!-- 顶部标题区域 -->
    <view class="header">
      <view class="logo">
        <text class="logo-icon">🍽</text>
      </view>
      <text class="title">共享厨房</text>
      <text class="subtitle">用美味点亮校园生活</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <!-- 手机号/校园号输入框 -->
      <view class="input-item">
        <text class="input-icon">📱</text>
        <input 
          v-model="form.username" 
          placeholder="请输入手机号"
          placeholder-style="color: #999999"
          class="input-field"
        />
      </view>

      <!-- 密码输入框 -->
      <view class="input-item">
        <text class="input-icon">🔒</text>
        <input 
          v-model="form.password" 
          type="password"
          placeholder="请输入密码"
          placeholder-style="color: #999999"
          class="input-field"
        />
      </view>

      <!-- 登录按钮 -->
      <view class="login-btn-container">
        <view 
          class="btn-primary" 
          @click="login" 
          :class="{ 'btn-disabled': loading }"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </view>
      </view>

      <!-- 其他登录选项 -->
      <view class="login-options">
        <text class="option-link" @click="goToCodeLogin">验证码登录</text>
        <text class="option-link">忘记密码？</text>
      </view>

      <!-- 其他登录方式 -->
      <view class="other-login">
        <text class="other-login-text">其他登录方式</text>
        <view class="login-methods">
          <view class="login-method" @click="wechatLogin">
            <text class="method-icon">💬</text>
          </view>
          <view class="login-method" @click="alipayLogin">
            <text class="method-icon">💰</text>
          </view>
        </view>
      </view>

      <!-- 用户协议 -->
      <view class="agreement">
        <view class="checkbox-container" @tap="toggleAgree">
          <view class="checkbox" :class="{ 'checked': agree }">
            <text v-if="agree" class="checkbox-icon">✓</text>
          </view>
        </view>
        <text class="agreement-text">我已阅读并同意</text>
        <text class="agreement-link">《用户协议》</text>
        <text class="agreement-text">和</text>
        <text class="agreement-link">《隐私条款》</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      agree: false
    };
  },
  methods: {
    async login() {
      // 表单验证
      if (!this.form.username || !this.form.password) {
        uni.showToast({
          title: '请输入手机号/密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (!this.agree) {
        uni.showToast({
          title: '请阅读并同意用户协议和隐私条款',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.loading = true;

      try {
        // 调用真实的登录API
        const res = await uni.$post('/api/user/login', {
          username: this.form.username,
          password: this.form.password
        });

        if (res.code === 0) {
          // 登录成功
          const userInfo = res.data;
          
          // 保存用户信息到本地存储
          uni.setStorageSync('userInfo', userInfo);
          uni.setStorageSync('token', userInfo.token);
          
          // 全局挂载用户信息
          uni.$userInfo = userInfo;

          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });

          // 跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        } else {
          // 登录失败
          uni.showToast({
            title: res.msg || '登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('登录失败:', error);
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/login/register'
      });
    },
    goToCodeLogin() {
      uni.showToast({
        title: '验证码登录功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    wechatLogin() {
      uni.showToast({
        title: '微信登录功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    alipayLogin() {
      uni.showToast({
        title: '支付宝登录功能开发中',
        icon: 'none',
        duration: 2000
      });
    },
    toggleAgree() {
      this.agree = !this.agree;
    }
  }
};
</script>

<style scoped>
.container {
  background: linear-gradient(135deg, #55AD67 0%, #7ED957 100%);
  min-height: 100vh;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 顶部标题区域 */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 80rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 80rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

/* 登录表单 */
.login-form {
  width: 100%;
  max-width: 500rpx;
  margin-bottom: 60rpx;
}

/* 输入框样式 */
.input-item {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 25rpx;
  margin-bottom: 24rpx;
  padding: 0 30rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.input-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.input-field {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 28rpx;
  color: #333333;
}

/* 登录按钮 */
.login-btn-container {
  margin-top: 40rpx;
  margin-bottom: 30rpx;
}

.btn-primary {
  background-color: #FFFFFF;
  color: #55AD67;
  border-radius: 25rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(2rpx);
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.1);
}

.btn-disabled {
  opacity: 0.7;
}

/* 其他登录选项 */
.login-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;
  padding: 0 20rpx;
}

.option-link {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
}

/* 其他登录方式 */
.other-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.other-login-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30rpx;
}

.login-methods {
  display: flex;
  gap: 60rpx;
}

.login-method {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.login-method:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.method-icon {
  font-size: 40rpx;
}

/* 用户协议 */
.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  gap: 10rpx;
  margin-top: 40rpx;
  white-space: nowrap;
}

.checkbox-container {
  margin-right: 10rpx;
  cursor: pointer;
}

.checkbox {
  width: 24rpx;
  height: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.checkbox.checked {
  background-color: #FFFFFF;
  border-color: #FFFFFF;
}

.checkbox-icon {
  color: #55AD67;
  font-size: 16rpx;
  font-weight: bold;
}

.agreement-text {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.agreement-link {
  font-size: 20rpx;
  color: #FFFFFF;
  text-decoration: underline;
  line-height: 1.4;
}

/* 底部版权信息 */
.footer {
  position: absolute;
  bottom: 20rpx;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.7);
}
</style>
