"use strict";
const utils_request = require("../../utils/request.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orders: []
    };
  },
  onLoad() {
    this.getMyOrders();
  },
  methods: {
    async getMyOrders() {
      try {
        const res = await utils_request.get("/api/order/my");
        if (res && res.data) {
          this.orders = res.data;
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
        this.orders = [];
      }
    },
    getStatusText(status) {
      switch (status) {
        case "pending":
          return "待支付";
        case "completed":
          return "已完成";
        case "cancelled":
          return "已取消";
        default:
          return "未知";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.orders, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.id),
        b: common_vendor.t(order.created_at),
        c: common_vendor.t(order.total_amount),
        d: common_vendor.t($options.getStatusText(order.status)),
        e: order.status === "pending" ? 1 : "",
        f: order.status === "completed" ? 1 : "",
        g: order.status === "cancelled" ? 1 : "",
        h: order.id
      };
    }),
    b: $data.orders.length === 0
  }, $data.orders.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aed45d07"]]);
wx.createPage(MiniProgramPage);
