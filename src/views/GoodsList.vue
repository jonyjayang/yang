<template>
    <div>
<nav-header></nav-header>
<nav-bread>
    <span slot="bread">Goods</span>
</nav-bread>

<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFliterPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt >Price:</dt>
          <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}"  @click="all" >All</a></dd>
          <dd v-for="(price,index) in priceFilter" :key="index">
            <a href="javascript:void(0)" @click="setPriceFilter(index)"   :class="{'cur':priceChecked==index}"   >{{price.startPrice}} - {{price.endPrice}}</a>
          </dd>
       
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodsList" :key="index" >
              <div class="pic">
                <!-- <div>{{item.productImage}}</div> -->
                <a href="#"><img :src="'/static/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>

          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                加载中...
          </div>
        </div>
      </div>

    </div>  
  </div>
</div>
<div class="md-overlay" v-show="overLayFlag==true" @click="closeFliterPop"></div>
<modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
            吗雷劈，滚去登录
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
        </modal>
<nav-footer></nav-footer>

    </div>
</template>
<style>
</style>


<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "@/components/NavHeader.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavBread from "@/components/NavBread.vue";
import Modal from "@/components/Modal.vue";
import axios from "axios";

export default {
  methods: {
    getGoodslist(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      axios.get("/goods/lists", { params: param }).then(response => {
        //前台通过axios传递params数据到后台，后台接受数据，后台返回结果前台通过返回的数据进行相应的处理
        let res = response.data;
        if (res.status == "0") {
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list);
            if (res.result.count == 0) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = [];
        }
      });
    },
    showFliterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    all() {
      //展示所有商品
      this.page = 1;
      this.priceChecked = "all";
      this.getGoodslist();
    },
    setPriceFilter(index) {
      //传递价格区间，并且根据后台传过来的数据尽心展示
      this.priceChecked = index;
      this.page = 1;
      this.getGoodslist();
      this.closeFliterPop();
    },
    closeFliterPop() {
      //响应式的时候关闭弹窗
      this.filterBy = false;
      this.overLayFlag = false;
    },
    sortGoods() {
      //将sortflag的值进行判断，通过取反在1和-1之间进行传递数据，后台拿到sort的值根据1和-1对商品根据价格进行排序
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodslist();
    },

    loadMore() {
      //实现分页式加载，当busy为false的时候可以进行分页加载page++跳转到下一页，后台进行判断当下一个的数据长度为0时将busy变为true
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodslist(true);
      }, 500);
    },
    addCart(productId) {
      //axios传递prodductid到后台，后台通过productid查询对应的id的商品并将其存储进数据库，然后返回值，前段通过返回值进行相应操作
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(response => {
          let res = response.data;
          console.log(res.status);
          if (res.status == 0) {
            alert("家去成功");
              this.$store.commit("updateCartCount",1);
          } else {
            this.mdShow = true;
          }
        });
    },
      closeModal () {
      this.mdShow = false;
    }
  },
  data() {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
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
          endPrice: "2000.00"
        }
      ],
      priceChecked: "all",
      overLayFlag: "false",
      filterBy: "false",
      mdShow: false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted() {
    this.getGoodslist();
  }
};
</script>

