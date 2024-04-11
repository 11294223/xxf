<template>
  <div class="body">
    <div class="canvas">

    </div>
    <div class="tool">
      <div class="choicePage">
        <div style="margin-top: 20px;">
          <span>选择编号：</span>
          <div style="margin-top: 10px;">
            <el-input-number v-model="currentPage" :min="0" :max="chanceNum"></el-input-number>
            <el-button type="primary" style="margin-left: 10px;">确定</el-button>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button type="info" @click="prePage">上一张</el-button>
          <el-button type="info" @click="nextPage">下一张</el-button>
        </div>
      </div>
      <div class="choiceTool">
        <span style="width: 220px;">好运工具：</span>
        <div class="sliderDiv">
          <el-image :src="require('@/assets/guadao-1.png')" style="width: 20px;height: 20px;"></el-image>
          <div style="width: 170px;margin-left: 20px;">
            <el-slider v-model="guaDaoSize" size="" :marks="guaDao1Marks" :min="5" :step="5"/>
          </div>
        </div>
        <div class="sliderDiv">
          <el-image :src="require('@/assets/guadao-2.png')" style="width: 20px;height: 20px;"></el-image>
          <div style="width: 170px;margin-left: 20px;">
            <el-slider v-model="guaDaoSize" size="" :marks="guaDao1Marks" :min="5" :step="5"/>
          </div>
        </div>
        <div class="sliderDiv">
          <el-image :src="require('@/assets/guadao-3.png')" style="width: 20px;height: 20px;"></el-image>
          <div style="width: 170px;margin-left: 20px;">
            <el-slider v-model="guaDaoSize" size="" :marks="guaDao1Marks" :min="5" :step="5"/>
          </div>
        </div>
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
      guaDaoSize: 0,
      guaDao1Marks: {5: '指甲', 20: '硬币', 40: '起子', 70: '小刮刀', 100: '大铲子'},

    }
  },
  methods: {
    prePage() {
      if (this.currentPage != 0) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage != this.chanceNum - 1) {
        this.currentPage++;
      }
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
  width: 250px;
}

.choicePage {
  width: 250px;
  height: 300px;
  background: beige;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.choiceTool {
  width: 250px;
  height: 300px;
  background: bisque;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.sliderDiv {
  width: 220px;
  height: 50px;
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.el-slider__marks-text{
  font-size: 12px;
}
</style>
