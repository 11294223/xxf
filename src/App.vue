<template>
  <el-container>
    <el-aside width="200px">

    </el-aside>
    <el-container>
      <el-header height="100px">

      </el-header>
      <el-main width="1000px">
        <xxf20/>
      </el-main>
      <el-footer height="100px">

      </el-footer>
    </el-container>
    <el-container>
      <el-aside width="200px">

      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import xxf20 from './components/xxf-20.vue'

export default {
  name: 'App',
  components: {
    xxf20
  }
}
</script>

<style>

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

</style>
