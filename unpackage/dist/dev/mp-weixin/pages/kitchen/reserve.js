"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      kitchenId: "",
      kitchenName: "",
      kitchenPrice: 15,
      selectedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      selectedHours: 2,
      includeFoodPackage: false,
      foodPackagePrice: 28,
      totalPrice: 48,
      loading: false,
      facilities: [
        { id: 1, icon: "🔥", name: "烤箱" },
        { id: 2, icon: "🧊", name: "冰箱" },
        { id: 3, icon: "👨‍🍳", name: "厨师机" },
        { id: 4, icon: "📶", name: "免费WiFi" }
      ],
      timeSlots: [
        { id: 1, time: "08:00-10:00", status: "booked" },
        { id: 2, time: "10:00-12:00", status: "selected" },
        { id: 3, time: "12:00-14:00", status: "available" },
        { id: 4, time: "14:00-16:00", status: "available" },
        { id: 5, time: "16:00-18:00", status: "available" },
        { id: 6, time: "18:00-20:00", status: "available" }
      ]
    };
  },
  onLoad(options) {
    this.kitchenId = options.kitchen_id;
    this.kitchenName = options.kitchen_name;
    this.getKitchenDetail();
    this.calculateTotalPrice();
  },
  methods: {
    async getKitchenDetail() {
      try {
        const res = await common_vendor.index.$get(`/api/kitchen/detail?kitchen_id=${this.kitchenId}`);
        if (res.code === 0) {
          const kitchen = res.data;
          this.kitchenName = kitchen.name;
          this.kitchenPrice = kitchen.price_per_hour;
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取厨房详情失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("获取厨房详情失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      }
    },
    getDateDay(dateString) {
      const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      const date = new Date(dateString);
      return days[date.getDay()];
    },
    selectTimeSlot(slot) {
      if (slot.status === "booked") {
        return;
      }
      this.timeSlots.forEach((s) => {
        s.status = s.status === "booked" ? "booked" : "available";
      });
      slot.status = "selected";
      this.selectedHours = 2;
      this.calculateTotalPrice();
    },
    toggleFoodPackage() {
      this.includeFoodPackage = !this.includeFoodPackage;
      this.calculateTotalPrice();
    },
    calculateTotalPrice() {
      let price = this.kitchenPrice * this.selectedHours;
      if (this.includeFoodPackage) {
        price += this.foodPackagePrice;
      }
      this.totalPrice = price - 2;
    },
    async submitReserve() {
      const selectedSlot = this.timeSlots.find((slot) => slot.status === "selected");
      if (!selectedSlot) {
        common_vendor.index.showToast({
          title: "请选择预约时间段",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.loading = true;
      try {
        common_vendor.index.showToast({
          title: "预约成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/kitchen/my-reserve"
          });
        }, 1500);
      } catch (error) {
        console.error("预约失败:", error);
        common_vendor.index.showToast({
          title: "预约失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.kitchenPrice),
    b: common_vendor.t($data.kitchenName),
    c: common_vendor.f($data.facilities, (facility, k0, i0) => {
      return {
        a: common_vendor.t(facility.icon),
        b: common_vendor.t(facility.name),
        c: facility.id
      };
    }),
    d: common_vendor.t($data.selectedDate),
    e: common_vendor.t($options.getDateDay($data.selectedDate)),
    f: common_vendor.f($data.timeSlots, (slot, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(slot.time),
        b: slot.status === "booked"
      }, slot.status === "booked" ? {} : {}, {
        c: slot.id,
        d: slot.status === "booked" ? 1 : "",
        e: slot.status === "selected" ? 1 : "",
        f: common_vendor.o(($event) => $options.selectTimeSlot(slot), slot.id)
      });
    }),
    g: common_vendor.t($data.includeFoodPackage ? "▼" : "▶"),
    h: common_vendor.o((...args) => $options.toggleFoodPackage && $options.toggleFoodPackage(...args)),
    i: common_vendor.t($data.selectedHours),
    j: common_vendor.t($data.totalPrice.toFixed(2)),
    k: common_vendor.t($data.loading ? "提交中..." : "立即预约"),
    l: common_vendor.o((...args) => $options.submitReserve && $options.submitReserve(...args)),
    m: $data.loading ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f1c8659"]]);
wx.createPage(MiniProgramPage);
