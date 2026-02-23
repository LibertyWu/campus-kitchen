"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    goToMyReserve() {
      if (!this.userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/my-reserve"
      });
    },
    goToMyOrder() {
      if (!this.userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/food/my-order"
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("token");
            this.userInfo = null;
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success",
              duration: 1500
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? {
    b: common_vendor.t($data.userInfo.name),
    c: common_vendor.t($data.userInfo.student_id),
    d: common_vendor.t($data.userInfo.credit)
  } : {
    e: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    f: common_vendor.o((...args) => $options.goToMyReserve && $options.goToMyReserve(...args)),
    g: common_vendor.o((...args) => $options.goToMyOrder && $options.goToMyOrder(...args)),
    h: $data.userInfo
  }, $data.userInfo ? {
    i: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7c2ebfa5"]]);
wx.createPage(MiniProgramPage);
