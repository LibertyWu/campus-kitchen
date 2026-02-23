"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: "",
        name: "",
        phone: ""
      },
      loading: false
    };
  },
  methods: {
    async register() {
      if (!this.form.username || !this.form.password || !this.form.name || !this.form.phone) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.loading = true;
      try {
        const res = await utils_request.post("/api/user/register", {
          username: this.form.username,
          password: this.form.password,
          name: this.form.name,
          phone: this.form.phone
        });
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }, 1500);
        }
      } catch (error) {
        console.error("注册失败:", error);
        common_vendor.index.showToast({
          title: "注册失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.loading = false;
      }
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.username,
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    c: $data.form.password,
    d: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    e: $data.form.name,
    f: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    g: $data.form.phone,
    h: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    i: common_vendor.o((...args) => $options.register && $options.register(...args)),
    j: $data.loading,
    k: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
