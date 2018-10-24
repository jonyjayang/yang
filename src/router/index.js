import Vue from 'vue'
import Router from 'vue-router'
import Cart from '@/views/Cart'
import GoodsList from '@/views/GoodsList'
import Address from '@/views/Address'
import OrderList from '@/views/OrderList'
import OrderSuc from '@/views/OrderSuc'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component:GoodsList,
    },
    {
      path: '/cart',
      name: 'Cart',
      component:Cart,
    },
       {
         path: '/address',
         name: 'Address',
         component: Address,
       },
       {
        path: '/order',
        name: 'OrderList',
        component: OrderList,
      },
      {
        path: '/suc',
        name: 'OrderSuc',
        component: OrderSuc,
      }


  
  
  ]
})
