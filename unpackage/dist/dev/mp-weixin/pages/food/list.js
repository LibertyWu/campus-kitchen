"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      foods: [],
      cart: [],
      searchQuery: "",
      categories: ["全部", "蔬菜", "肉类", "蛋类", "水果", "调料"],
      selectedCategory: "全部"
    };
  },
  onLoad() {
    this.getFoodList();
  },
  computed: {
    filteredFoods() {
      let result = [...this.foods];
      if (this.selectedCategory !== "全部") {
        result = result.filter((food) => food.category === this.selectedCategory);
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (food) => food.name.toLowerCase().includes(query) || food.category.toLowerCase().includes(query)
        );
      }
      return result;
    }
  },
  methods: {
    async getFoodList() {
      try {
        const res = await common_vendor.index.$get("/api/food/list");
        if (res.code === 0) {
          this.foods = res.data.map((food) => ({
            id: food.id,
            name: food.name,
            category: food.category,
            price: food.price,
            unit: food.unit,
            stock: food.stock,
            image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(food.name)}%20fresh%20food&image_size=square`,
            description: food.description
          }));
        } else {
          this.foods = [];
          common_vendor.index.showToast({
            title: res.msg || "获取食材列表失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("获取食材列表失败:", error);
        this.foods = [];
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      }
    },
    addToCart(food) {
      const existingItem = this.cart.find((item) => item.id === food.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          ...food,
          quantity: 1
        });
      }
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success",
        duration: 1e3
      });
    },
    increaseQuantity(foodId) {
      const item = this.cart.find((item2) => item2.id === foodId);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(foodId) {
      const itemIndex = this.cart.findIndex((item) => item.id === foodId);
      if (itemIndex !== -1) {
        const item = this.cart[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          this.cart.splice(itemIndex, 1);
        }
      }
    },
    getCartItem(foodId) {
      return this.cart.find((item) => item.id === foodId);
    },
    handleSearch() {
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    calculateTotal() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0).toFixed(2);
    },
    async goToCheckout() {
      if (this.cart.length === 0) {
        common_vendor.index.showToast({
          title: "购物车为空",
          icon: "none",
          duration: 2e3
        });
        return;
      }
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
      const orderData = {
        total_amount: parseFloat(this.calculateTotal()),
        items: this.cart.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }))
      };
      try {
        const res = await common_vendor.index.$post("/api/order/create", orderData);
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "订单已提交",
            icon: "success",
            duration: 1500
          });
          this.cart = [];
        } else {
          common_vendor.index.showToast({
            title: res.msg || "订单提交失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("提交订单失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请检查后端服务",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.searchQuery = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    b: $data.searchQuery,
    c: common_vendor.f($data.categories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category),
        b: category,
        c: $data.selectedCategory === category ? 1 : "",
        d: common_vendor.o(($event) => $options.selectCategory(category), category)
      };
    }),
    d: common_vendor.f($options.filteredFoods, (food, k0, i0) => {
      return common_vendor.e({
        a: food.image,
        b: common_vendor.t(food.name),
        c: common_vendor.t(food.category),
        d: common_vendor.t(food.price),
        e: common_vendor.t(food.unit),
        f: common_vendor.t(food.stock),
        g: common_vendor.t(food.unit),
        h: $options.getCartItem(food.id)
      }, $options.getCartItem(food.id) ? {
        i: common_vendor.o(($event) => $options.decreaseQuantity(food.id), food.id),
        j: common_vendor.t($options.getCartItem(food.id).quantity),
        k: common_vendor.o(($event) => $options.increaseQuantity(food.id), food.id)
      } : {
        l: common_vendor.o(($event) => $options.addToCart(food), food.id)
      }, {
        m: food.id
      });
    }),
    e: $options.filteredFoods.length === 0
  }, $options.filteredFoods.length === 0 ? {} : {}, {
    f: $data.cart.length > 0
  }, $data.cart.length > 0 ? {
    g: common_vendor.t($data.cart.length),
    h: common_vendor.t($options.calculateTotal()),
    i: common_vendor.o((...args) => $options.goToCheckout && $options.goToCheckout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f17086e"]]);
wx.createPage(MiniProgramPage);
