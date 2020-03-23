import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import('../views/login/Login')
const home = () => import('../views/home/Home')
const welcome = () => import('../views/home/Welcome')
const users = () => import('../views/user/Users')
const roles = () => import('../views/right/Roles')
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login,
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/roles',
        component: roles
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//全局路由守卫，如果用户未登录，则不可以访问其他页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login'){
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){
    return next('/login')
  }
  next()
})

export default router
