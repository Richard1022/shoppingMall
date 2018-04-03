<template>
<div class="good-list">
    <nav-header/>
    <nav-brand></nav-brand>
    <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price">Price
                    <svg class="icon icon-arrow-short">
                        <use xlink:href="#icon-arrow-short"></use>
                    </svg>
                </a>
                <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showProp">Filter by</a>
            </div>
            <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" :class="{'filterby-show': filterShow}">
                    <dl class="filter-price">
                        <dt>Price:</dt>
                        <dd>
                            <a href="javascript:void(0)" @click="setFilter('all')" :class="{'cur':filterChecked === 'all'}">All</a>
                        </dd>
                        <dd v-for="(price,index) in filterPrice" :key="index">
                            <a href="javascript:void(0)" @click="setFilter(index,price)" :class="{'cur':filterChecked === index}" v-text="`${price.startPrice}-${price.endPrice}`"></a>
                        </dd>
                    </dl>
                </div>
                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item,index) in goodList" :key="index">
                                <div class="pic">
                                    <a href="#">
                                        <img v-lazy="`/static/${item.productImage}`" alt="">
                                    </a>
                                </div>
                                <div class="main">
                                    <div class="name" v-text="item.productName"></div>
                                    <div class="price" v-text="item.salePrice">999</div>
                                    <div class="btn-area">
                                        <a href="javascript:;" class="btn btn--m" @click="addShopCart(item)">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                        正在加载商品...
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <nav-footer/>
</div>
</template>
<script>
// 工具函数
function isEmptyObj(obj) {
  for (let prop in obj) {
    return false;
  }
  return true;
}

import "assets/base.css";
import "assets/product.css";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBrand from "@/components/NavBrand";
import axios from "axios";

export default {
  components: {
    NavHeader,
    NavFooter,
    NavBrand
  },
  data() {
    return {
      goodList: [],
      filterPrice: [
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      filterChecked: "all",
      overLayFlag: false,
      filterShow: false,
      busy: false,
      filterCondition: {},
      page: 1,
      pagesize: 4
    };
  },
  methods: {
    addShopCart(item) {
      let {
        productId,
        productName,
        salePrice,
        productImage,
        productNum
      } = item;
      axios
        .post(`/mock/addShopCart`, {
          params: {
            productId,
            productName,
            salePrice,
            productImage,
            productNum: 1
          }
        })
        .then(res => {
          if (res.status === 403) {
            alert("请先登录");
          } else if (res.status === 200) {
            console.log(666);
          }
        });
    },
    closePop() {
      this.overLayFlag = false;
      this.filterShow = false;
    },
    showProp() {
      this.overLayFlag = true;
      this.filterShow = true;
    },
    setFilter(sign, item) {
      this.busy = false;
      this.page = 1;
      if (sign === "all") {
        this.filterCondition = {};
        this.getProduct({
          page: this.page,
          pagesize: this.pagesize
        });
      } else {
        this.filterCondition = {
          priceGt: parseInt(item.startPrice),
          priceIt: parseInt(item.endPrice)
        };
        this.getProduct(
          Object.assign(this.filterCondition, {
            page: this.page,
            pagesize: this.pagesize
          })
        );
      }
      this.filterChecked = sign;
      this.closePop();
    },
    getProduct(params, flag) {
      axios
        .get(`/mock/goods`, {
          params: params
        })
        .then(res => {
          if (res.status === 200) {
            if (flag) {
              this.goodList = this.goodList.concat(res.data.data);
              this.busy = res.data.count === 0 ? true : false;
            } else {
              this.goodList = res.data.data;
            }
          }
        });
    },
    loadMore() {
      this.busy = true;
      this.page++;
      let searchParams = Object.assign(this.filterCondition, {
        page: this.page,
        pagesize: this.pagesize
      });
      this.getProduct(searchParams, true);
    }
  },
  mounted() {
    this.getProduct({
      page: this.page,
      pagesize: this.pagesize
    });
  }
};
</script>
<style scoped>

</style>


