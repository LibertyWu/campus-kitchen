"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      loading: false,
      agree: false
    };
  },
  methods: {
    async login() {
      if (!this.form.username || !this.form.password) {
        common_vendor.index.showToast({
          title: "请输入手机号/密码",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (!this.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意用户协议和隐私条款",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.loading = true;
      try {
        const res = await common_vendor.index.$post("/api/user/login", {
          username: this.form.username,
          password: this.form.password
        });
        if (res.code === 0) {
          const userInfo = res.data;
          common_vendor.index.setStorageSync("userInfo", userInfo);
          common_vendor.index.setStorageSync("token", userInfo.token);
          common_vendor.index.$userInfo = userInfo;
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "登录失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("登录失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    },
    goToCodeLogin() {
      common_vendor.index.showToast({
        title: "验证码登录功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    wechatLogin() {
      common_vendor.index.showToast({
        title: "微信登录功能开发中",
        icon: "none",
        duration: 2e3
      });
    },
    alipayLogin() {
      common_vendor.index.showToast({
        title: "支付宝登录功能开发中",
        icon: "none",
        duration: 2e3
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
    e: common_vendor.t($data.loading ? "登录中..." : "立即登录"),
    f: common_vendor.o((...args) => $options.login && $options.login(...args)),
    g: $data.loading ? 1 : "",
    h: common_vendor.o((...args) => $options.goToCodeLogin && $options.goToCodeLogin(...args)),
    i: common_vendor.o((...args) => $options.wechatLogin && $options.wechatLogin(...args)),
    j: common_vendor.o((...args) => $options.alipayLogin && $options.alipayLogin(...args)),
    k: $data.agree,
    l: common_vendor.o((...args) => $data.agree = !$data.agree)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
