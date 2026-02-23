"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeTab: "all",
      statusTabs: [
        { key: "all", name: "全部" },
        { key: "pending", name: "待使用" },
        { key: "completed", name: "待评价" },
        { key: "cancelled", name: "已退款" }
      ],
      pendingReserves: [],
      completedReserves: [],
      cancelledReserves: []
    };
  },
  computed: {
    filteredReserves() {
      if (this.activeTab === "all") {
        return [...this.pendingReserves, ...this.completedReserves, ...this.cancelledReserves];
      } else if (this.activeTab === "pending") {
        return this.pendingReserves;
      } else if (this.activeTab === "completed") {
        return this.completedReserves;
      } else if (this.activeTab === "cancelled") {
        return this.cancelledReserves;
      }
      return [];
    },
    cookingStats() {
      return {
        times: 12,
        duration: "34.5 h",
        likes: "1.2k"
      };
    }
  },
  onLoad() {
    this.getMyReserves();
  },
  methods: {
    async getMyReserves() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      try {
        const res = await common_vendor.index.$get(`/api/reserve/list?user_id=${userInfo.id}`);
        if (res.code === 0) {
          this.pendingReserves = [];
          this.completedReserves = [];
          this.cancelledReserves = [];
          res.data.forEach((reserve) => {
            const reserveData = {
              id: reserve.id,
              kitchenName: reserve.kitchen_name,
              date: reserve.date,
              time: `${reserve.start_time} - ${reserve.end_time}`,
              duration: reserve.duration,
              service: reserve.include_food_package ? "基础食材包 ×1" : "无附加服务",
              price: reserve.total_amount,
              status: reserve.status
            };
            if (reserve.status === "pending") {
              reserveData.timeLeft = 4;
              this.pendingReserves.push(reserveData);
            } else if (reserve.status === "completed") {
              this.completedReserves.push(reserveData);
            } else if (reserve.status === "cancelled") {
              this.cancelledReserves.push(reserveData);
            }
          });
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取预约列表失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("获取预约列表失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      }
    },
    selectTab(tabKey) {
      this.activeTab = tabKey;
    },
    async cancelReserve(reserveId) {
      common_vendor.index.showModal({
        title: "取消预约",
        content: "确定要取消该预约吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              this.pendingReserves = this.pendingReserves.filter((item) => item.id !== reserveId);
              this.cancelledReserves.push({
                id: reserveId,
                kitchenName: "紫荆园 烘焙室 A2",
                date: "2026-02-12",
                time: "今天 14:00",
                duration: 2,
                price: 48,
                status: "cancelled"
              });
              common_vendor.index.showToast({
                title: "预约已取消",
                icon: "success",
                duration: 1500
              });
            } catch (error) {
              console.error("取消预约失败:", error);
              common_vendor.index.showToast({
                title: "取消预约失败",
                icon: "none",
                duration: 2e3
              });
            }
          }
        }
      });
    },
    verifyReserve(reserveId) {
      common_vendor.index.showToast({
        title: "核销入场功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    rateReserve(reserveId) {
      common_vendor.index.showToast({
        title: "评价功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    bookAgain(reserveId) {
      common_vendor.index.showToast({
        title: "再来一单功能开发中",
        icon: "none",
        duration: 2e3
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.statusTabs, (tab, k0, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: tab.key,
        c: $data.activeTab === tab.key ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTab(tab.key), tab.key)
      };
    }),
    b: common_vendor.f($data.pendingReserves, (reserve, k0, i0) => {
      return {
        a: common_vendor.t(reserve.date),
        b: common_vendor.t(reserve.time),
        c: common_vendor.t(reserve.timeLeft),
        d: common_vendor.t(reserve.kitchenName),
        e: common_vendor.t(reserve.duration),
        f: common_vendor.t(reserve.service),
        g: common_vendor.t(reserve.price),
        h: common_vendor.o(($event) => $options.cancelReserve(reserve.id), reserve.id),
        i: common_vendor.o(($event) => $options.verifyReserve(reserve.id), reserve.id),
        j: reserve.id
      };
    }),
    c: common_vendor.f($data.completedReserves, (reserve, k0, i0) => {
      return {
        a: common_vendor.t(reserve.date),
        b: common_vendor.t(reserve.kitchenName),
        c: common_vendor.t(reserve.duration),
        d: common_vendor.t(reserve.price),
        e: common_vendor.o(($event) => $options.rateReserve(reserve.id), reserve.id),
        f: common_vendor.o(($event) => $options.bookAgain(reserve.id), reserve.id),
        g: reserve.id
      };
    }),
    d: $options.filteredReserves.length === 0
  }, $options.filteredReserves.length === 0 ? {} : {}, {
    e: common_vendor.t($options.cookingStats.times),
    f: common_vendor.t($options.cookingStats.duration),
    g: common_vendor.t($options.cookingStats.likes)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-30560c86"]]);
wx.createPage(MiniProgramPage);
