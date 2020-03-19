<template>
  <div>
    <el-button type="danger" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>

</style>
