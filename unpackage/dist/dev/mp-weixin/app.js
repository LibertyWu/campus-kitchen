"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/mine/mine.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/kitchen/list.js";
  "./pages/kitchen/reserve.js";
  "./pages/kitchen/my-reserve.js";
  "./pages/food/list.js";
  "./pages/food/my-order.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
common_vendor.index.$request = utils_request.request;
common_vendor.index.$get = utils_request.get;
common_vendor.index.$post = utils_request.post;
common_vendor.index.$userInfo = common_vendor.index.getStorageSync("userInfo") || {};
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
