"use strict";
const common_vendor = require("../common/vendor.js");
const baseUrl = "http://127.0.0.1:5000";
const request = (url, method = "GET", data = {}) => {
  common_vendor.index.showLoading({
    title: "加载中...",
    mask: true
  });
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        "Content-Type": "application/json"
        // 统一JSON格式
      },
      success: (res) => {
        common_vendor.index.hideLoading();
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({
            title: res.data.msg || "操作失败",
            icon: "none",
            duration: 2e3
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
        reject(err);
      }
    });
  });
};
const get = (url, data) => request(url, "GET", data);
const post = (url, data) => request(url, "POST", data);
exports.get = get;
exports.post = post;
exports.request = request;
