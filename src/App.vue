<template>
  <el-container>
    <a class="gitHub" href="https://github.com/you">
      <img :src="require('@/assets/git.png')" alt="Fork me on GitHub" >
    </a>
    <el-aside style="width: 20vw;height: 100vh;">
      <Thanks></Thanks>
    </el-aside>
    <el-main style="width: 80vw;height: 100vh;">
      <el-row>
        <el-col :span="2" style="height: 100%;">
          <choiceMenu/>
        </el-col>
        <el-col :span="22" style="height: 100%;">
          <router-view/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import choiceMenu from "@/components/choiceMenu.vue";
import Thanks from "@/components/com-thanks.vue";
export default {
  name: 'App',
  components: {
    choiceMenu,
    Thanks
  }
}
</script>

<style scoped>
* {
  margin: 0;
}
.gitHub{
  position: absolute;
  z-index: 1;
  right: 16px;
}
</style>
