import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import GoodList from '@/views/GoodList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '商品列表页',
      component: GoodList
    }
  ]
})
