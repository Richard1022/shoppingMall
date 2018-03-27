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
                <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showProp" >Filter by</a>
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
                            <a href="javascript:void(0)" @click="setFilter(index)" :class="{'cur':filterChecked === index}" v-text="`${price.startPrice}-${price.endPrice}`"></a>
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
                                        <img v-lazy="`/static/${item.prodcutImg}`" alt="">
                                    </a>
                                </div>
                                <div class="main">
                                    <div class="name" v-text="item.productName"></div>
                                    <div class="price" v-text="item.prodcutPrice">999</div>
                                    <div class="btn-area">
                                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
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
      filterChecked: "",
      overLayFlag: false,
      filterShow: false
    };
  },
  methods: {
    closePop() {
      this.overLayFlag = false;
      this.filterShow = false;
    },
    showProp() {
      this.overLayFlag = true;
      this.filterShow = true;
    },
    setFilter(sign) {
      this.filterChecked = sign;
      this.closePop();
    }
  },
  mounted() {
    axios.get(`/mock/goods`).then(res => {
      if (res.status === 200) {
        this.goodList = res.data.result;
      }
    });
  }
};
</script>
<style scoped>

</style>


