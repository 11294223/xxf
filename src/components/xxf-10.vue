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
        <div style="margin-top: 10px;">
          <el-button :disabled="guadao==1" bg text circle class="el-icon-guadao1" ref="guadao1" @click="guadao1"/>
          <el-button :disabled="guadao==2" bg text circle class="el-icon-guadao2" @click="guadao2"/>
          <el-button :disabled="guadao==3" bg text circle class="el-icon-guadao3" @click="guadao3"/>
        </div>
        <div class="sliderDiv">
          <el-slider v-model="guaDaoSize" :marks="guaDao1Marks" :show-tooltip="false" :min="5" :step="5"/>
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
      guadao: 1,
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
    },
    guadao1() {
      this.guadao = 1;
    },
    guadao2() {
      this.guadao = 2;
    },
    guadao3() {
      this.guadao = 3;
    },
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
  width: 200px;
  height: 35px;
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.el-icon-guadao1 {
  background: url('@/assets/guadao-1.png') center no-repeat;
  background-size: cover;
}

.el-icon-guadao1:hover {
  background: url('@/assets/guadao-1.png') center no-repeat;
  background-size: cover;
}

.el-icon-guadao2 {
  background: url('@/assets/guadao-2.png') center no-repeat;
  background-size: cover;
}

.el-icon-guadao2:hover {
  background: url('@/assets/guadao-2.png') center no-repeat;
  background-size: cover;
}

.el-icon-guadao3 {
  background: url('@/assets/guadao-3.png') center no-repeat;
  background-size: cover;
}

.el-icon-guadao3:hover {
  background: url('@/assets/guadao-3.png') center no-repeat;
  background-size: cover;
}

.el-slider__marks-text {
  font-size: 12px;
}
</style>
