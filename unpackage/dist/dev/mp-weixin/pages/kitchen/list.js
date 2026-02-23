"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      kitchens: [],
      selectedFilter: "all",
      selectedSort: "default"
    };
  },
  onLoad() {
    this.getKitchenList();
  },
  methods: {
    async getKitchenList() {
      try {
        const res = await common_vendor.index.$get("/api/kitchen/list");
        if (res.code === 0) {
          this.kitchens = res.data.map((kitchen) => ({
            id: kitchen.id,
            name: kitchen.name,
            location: kitchen.location,
            capacity: kitchen.capacity,
            status: kitchen.status,
            price_per_hour: kitchen.price_per_hour,
            distance: `${kitchen.distance}km`,
            image: kitchen.image || "🍽",
            description: kitchen.description || "暂无描述",
            facilities: kitchen.equipment ? kitchen.equipment.split(",").map((item) => item.trim()) : []
          }));
        } else {
          this.kitchens = [];
          common_vendor.index.showToast({
            title: res.msg || "获取厨房列表失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("获取厨房列表失败:", error);
        this.kitchens = [];
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      }
    },
    getStatusText(status) {
      switch (status) {
        case "available":
          return "空闲";
        case "busy":
          return "使用中";
        case "unavailable":
          return "异常";
        default:
          return "未知";
      }
    },
    selectFilter(filter) {
      this.selectedFilter = filter;
      common_vendor.index.showToast({
        title: `已选择${this.getFilterName(filter)}`,
        icon: "none",
        duration: 1500
      });
    },
    selectSort(sort) {
      this.selectedSort = sort;
      common_vendor.index.showToast({
        title: `已选择${this.getSortName(sort)}`,
        icon: "none",
        duration: 1500
      });
    },
    getFilterName(filter) {
      const filterNames = {
        "all": "全部",
        "chinese": "中餐厨房",
        "western": "西餐空间",
        "baking": "烘焙工坊",
        "dining": "聚餐大厅"
      };
      return filterNames[filter] || "全部";
    },
    getSortName(sort) {
      const sortNames = {
        "default": "综合排序",
        "distance": "距离优先",
        "price": "价格排序",
        "filter": "筛选"
      };
      return sortNames[sort] || "综合排序";
    },
    goToReserve(kitchen) {
      if (kitchen.status !== "available") {
        common_vendor.index.showToast({
          title: "当前不可预约",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/kitchen/reserve?kitchen_id=${kitchen.id}&kitchen_name=${encodeURIComponent(kitchen.name)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.selectFilter("all")),
    b: common_vendor.o(($event) => $options.selectFilter("chinese")),
    c: common_vendor.o(($event) => $options.selectFilter("western")),
    d: common_vendor.o(($event) => $options.selectFilter("baking")),
    e: common_vendor.o(($event) => $options.selectFilter("dining")),
    f: common_vendor.o(($event) => $options.selectSort("default")),
    g: common_vendor.o(($event) => $options.selectSort("distance")),
    h: common_vendor.o(($event) => $options.selectSort("price")),
    i: common_vendor.o(($event) => $options.selectSort("filter")),
    j: common_vendor.f($data.kitchens, (kitchen, k0, i0) => {
      return {
        a: common_vendor.t(kitchen.image),
        b: common_vendor.t(kitchen.price_per_hour),
        c: common_vendor.t(kitchen.distance),
        d: common_vendor.t(kitchen.name),
        e: common_vendor.t($options.getStatusText(kitchen.status)),
        f: kitchen.status === "available" ? 1 : "",
        g: kitchen.status === "busy" ? 1 : "",
        h: kitchen.status === "unavailable" ? 1 : "",
        i: common_vendor.t(kitchen.description),
        j: common_vendor.f(kitchen.facilities, (facility, k1, i1) => {
          return {
            a: common_vendor.t(facility),
            b: facility
          };
        }),
        k: kitchen.id,
        l: common_vendor.o(($event) => $options.goToReserve(kitchen), kitchen.id)
      };
    }),
    k: $data.kitchens.length === 0
  }, $data.kitchens.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8fa596b8"]]);
wx.createPage(MiniProgramPage);
