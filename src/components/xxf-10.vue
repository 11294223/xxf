<template>
  <div class="body">
    <div class="canvas">

    </div>
    <div class="tool">
      <div class="choicePage">
        <div>
          <span>选择编号：</span>
          <div style="width: 250px;margin-top: 10px;">
            <el-input-number v-model="currentPage" :min="0" :max="chanceNum"></el-input-number>
            <el-button type="primary" style="margin-left: 10px;">确定</el-button>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button type="info">上一张</el-button>
          <el-button type="info">下一张</el-button>
        </div>
      </div>
      <div class="choiceTool">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "xxf-10",
  data() {
    return {
      chanceNum: 25,
      currentPage: 0,
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
}

.body {
  width: 700px;
  height: 800px;
  display: flex;
}

.canvas {
  width: 400px;
  height: 800px;
  background: burlywood;
}

.tool {
  width: 300px;
}

.choicePage {
  width: 300px;
  height: 300px;
  background: beige;
  display: flex;
  justify-items: center;
  align-items: center;
}

.choiceTool {
  width: 300px;
  height: 300px;
  background: bisque;
}
</style>
