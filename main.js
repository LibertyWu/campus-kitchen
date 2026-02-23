// main.js
import { createSSRApp } from 'vue';
import App from './App.vue';
import { request, get, post } from './utils/request';

// 全局挂载请求方法
uni.$request = request;
uni.$get = get;
uni.$post = post;

// 全局存储用户信息（登录后保存）
uni.$userInfo = uni.getStorageSync('userInfo') || {};

export function createApp() {
  const app = createSSRApp(App);
  return {
    app
  };
}