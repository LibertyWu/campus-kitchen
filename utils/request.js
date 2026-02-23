// utils/request.js
// 后端接口根地址（替换成你的实际IP+端口）
const baseUrl = 'http://127.0.0.1:5000';

/**
 * 统一接口请求封装
 * @param {String} url 接口地址（如/api/user/login）
 * @param {String} method 请求方法（GET/POST）
 * @param {Object} data 请求参数
 */
export const request = (url, method = 'GET', data = {}) => {
  // 加载中提示
  uni.showLoading({
    title: '加载中...',
    mask: true
  });

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json' // 统一JSON格式
      },
      success: (res) => {
        uni.hideLoading();
        // 后端统一返回格式：{code:0, msg:"", data:{}}
        if (res.data.code === 0) {
          resolve(res.data); // 成功返回data
        } else {
          // 错误提示
          uni.showToast({
            title: res.data.msg || '操作失败',
            icon: 'none',
            duration: 2000
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.hideLoading();
        uni.showToast({
          title: '网络错误，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      }
    });
  });
};

// 简化GET/POST请求
export const get = (url, data) => request(url, 'GET', data);
export const post = (url, data) => request(url, 'POST', data);