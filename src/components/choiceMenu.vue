<template>
  <div class="content">
    <div class="btnList">
      <router-link to="/xxf-10">
        <el-button class="el-button" type="primary" size="large" round>10元面值</el-button>
      </router-link>
      <router-link to="/xxf-20">
        <el-button class="el-button" type="success" size="large" round>20元面值</el-button>
      </router-link>
      <router-link to="/xxf-30">
        <el-button class="el-button" type="warning" size="large" round>30元面值</el-button>
      </router-link>
      <router-link to="/xxf-50">
        <el-button class="el-button" type="danger" size="large" round>50元面值</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "choiceMenu"
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.el-button {
  margin-top: 20px;
}

.content {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btnList {
  text-align: center;
}
</style>
