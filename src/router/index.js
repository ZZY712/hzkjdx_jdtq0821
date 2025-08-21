import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routes'
import pagesRouter from './pages'
import { getToken } from '@/utils/auth'


const Router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [...pagesRouter],
})
// 获取原型对象push函数
const originalPush = VueRouter.prototype.push

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
// 路由前置守卫
Router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // 访问登录页面 直接放行
    // if (to.path === '/login') {
    //     return next()
    // }
    // const tokenStr = getToken()
    // // 没有token， 强制转到login页面
    // if (!tokenStr) {
    //     return next('/login')
    // }
    next()
});

export default Router
