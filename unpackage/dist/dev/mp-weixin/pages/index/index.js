"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      hotKitchens: []
    };
  },
  onLoad() {
    this.getUserInfo();
    this.getHotKitchens();
  },
  methods: {
    async getHotKitchens() {
      try {
        const res = await common_vendor.index.$get("/api/kitchen/list");
        if (res.code === 0) {
          this.hotKitchens = res.data.slice(0, 3).map((kitchen) => ({
            id: kitchen.id,
            name: kitchen.name,
            rating: 4.5,
            // 模拟评分，实际可以从API获取
            reviews: Math.floor(Math.random() * 200) + 50,
            // 模拟评价数
            image: kitchen.image || "�"
          }));
        } else {
          this.hotKitchens = [];
        }
      } catch (error) {
        console.error("获取热门厨房失败:", error);
        this.hotKitchens = [];
      }
    },
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
    goToNotification() {
      common_vendor.index.showToast({
        title: "通知功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    goToSearch() {
      common_vendor.index.showToast({
        title: "搜索功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    goToPromotion() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/list"
      });
    },
    goToChineseKitchen() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/list"
      });
    },
    goToBaking() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/list"
      });
    },
    goToWesternKitchen() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/list"
      });
    },
    goToFoodMarket() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/food/list"
      });
    },
    goToAllKitchens() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/kitchen/list"
      });
    },
    goToKitchenDetail(kitchenId) {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/kitchen/reserve?kitchen_id=${kitchenId}&kitchen_name=${encodeURIComponent(this.hotKitchens.find((k) => k.id === kitchenId).name)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToNotification && $options.goToNotification(...args)),
    b: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    c: common_vendor.o((...args) => $options.goToPromotion && $options.goToPromotion(...args)),
    d: common_vendor.o((...args) => $options.goToChineseKitchen && $options.goToChineseKitchen(...args)),
    e: common_vendor.o((...args) => $options.goToBaking && $options.goToBaking(...args)),
    f: common_vendor.o((...args) => $options.goToWesternKitchen && $options.goToWesternKitchen(...args)),
    g: common_vendor.o((...args) => $options.goToFoodMarket && $options.goToFoodMarket(...args)),
    h: common_vendor.o((...args) => $options.goToAllKitchens && $options.goToAllKitchens(...args)),
    i: common_vendor.f($data.hotKitchens, (kitchen, k0, i0) => {
      return {
        a: common_vendor.t(kitchen.image),
        b: common_vendor.t(kitchen.name),
        c: common_vendor.t(kitchen.rating),
        d: common_vendor.t(kitchen.reviews),
        e: kitchen.id,
        f: common_vendor.o(($event) => $options.goToKitchenDetail(kitchen.id), kitchen.id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
