<template>
  <!--整体容器-->
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <!--logo-->
        <img src="../../assets/icon.png" alt="">
        <!--标题-->
        <span>商城后台管理系统</span>
      </div>
      <!--退出按钮-->
      <el-button type="danger" @click="logout">退出登录</el-button>
    </el-header>
    <!--侧边栏容器-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-collapse" @click="changeCollapse">
        <i :class="collIcon"></i>
        </div>
        <!--菜单区-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path">
          <!--一级菜单-->
          <el-submenu v-for="(item, index) in menuList" :index="item.id + ''" :key="index">
            <!--一级菜单模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item v-for="(subItem, index) in item.children" :index="'/' + subItem.path" :key="index">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      内容主区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {request} from '../../network/request'
  export default {
    name: 'Home',
    data() {
      return {
        menuList: [],
        iconObj: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-s-opportunity',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-data'
        },
        isCollapse: false,
        collIcon: 'el-icon-caret-left'
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      logout () {
        window.sessionStorage.clear()
        this.$router.replace('/login')
      },
      getMenuList(){
        request({
          url: '/menus',
        }).then(({data: res}) => {
          //console.log(res)
          if (res.meta.status == 200){
            this.menuList = res.data;
            //console.log(this.menuList)
          }else{
            this.$message.error('菜单数据获取失败')
          }
        })
      },
      changeCollapse() {
        this.isCollapse = !this.isCollapse
        if (this.isCollapse){
          this.collIcon = 'el-icon-caret-right'
        }else {
          this.collIcon = 'el-icon-caret-left'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    display: flex;
    background-color: #373d41;
    justify-content: space-between;
    padding-left: 0;
    color: #fff;
    align-items: center;
    font-size: 20px;

    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-radio-group{
    margin-bottom: 0;
  }
  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #EAEDF1;
  }
  .el-menu{
    border: 0;
  }
  .toggle-collapse{
    font-size: 25px;
    align-items: center;
    color: #fff;
    text-align: center;
  }
</style>
