<template>
  <div class="body">
    <div class="canvas">
      <canvas id="bottomCanvas" :width=width :height=height ref="bottomCanvas"></canvas> <!-- 底层Canvas -->
      <canvas id="dgxCanvas" :width=width :height=height ref="dgxCanvas"></canvas> <!-- 等高线Canvas -->
      <canvas id="munCanvas" :width=width :height=height ref="munCanvas"></canvas> <!-- 钱数Canvas -->
      <canvas id="munPYCanvas" :width=width :height=height ref="munPYCanvas"></canvas> <!-- 钱数拼音Canvas -->
      <canvas id="topCanvas" :width=width :height=height ref="topCanvas"></canvas> <!-- 上层Canvas -->
    </div>
    <div class="tool">
      <div class="choicePage">
        <div style="margin-top: 20px;">
          <span>选择编号：</span>
          <div style="margin-top: 10px;">
            <el-input-number v-model="currentPage" :min="0" step-strictly :max="chanceNum"
                             @change="inputChange"></el-input-number>
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
          <el-button :disabled="guadao==1" bg text circle class="el-icon-guadao1" @click="guadao1"/>
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
import {pinyin} from "pinyin-pro";
import baseData from "@/js/data";
import {fillTextWithSpacing} from '@/utils/canvasUtils'
import {createFullPool, createProbPool, numberToChinese, getRandom, upsetArr, munSplit} from '@/utils/CommonUtils'

export default {
  name: 'Xxf-10',
  data() {
    return {
      currentPage: 0, // 当前页
      chanceNum: 25, // 中奖机会
      guaDaoSize: 0,
      guaDao1Marks: {5: '指甲', 20: '硬币', 40: '起子', 70: '小刮刀', 100: '大铲子'},
      guadao: 1,
      width: 400,
      height: 800,
      playWidth: 270,
      playHeight: 285,
      playX: 65,
      playY: 311,
      munArr: [800000, 5000, 1000, 500, 200, 100, 50, 40, 30, 20],
      munSplitArr: {
        mun40: [20, 20],
        mun50: [20, 30],
        mun100: [50, 50],
        mun200: [100, 100],
        mun500: [200, 200, 100],
        mun1000: [500, 500]
      }, // 金额拆分数组
      pageNum: 25, // 页数
      pageArr: [], // 当前本每页的奖金数额
      iconIndexArr: [], // 图标下标数组
      bottomCtx: null,
      topCtx: null,
      dgxCtx: null,
      munCtx: null,
      munPYCtx: null,
    }
  },
  created() {
    this.dataInit();
  },
  mounted() {
    let bottomCanvas = this.$refs.bottomCanvas;
    this.bottomCtx = bottomCanvas.getContext('2d');
    let topCanvas = this.$refs.topCanvas;
    this.topCtx = topCanvas.getContext('2d');
    let dgxCanvas = this.$refs.dgxCanvas;
    this.dgxCtx = dgxCanvas.getContext('2d');
    let munCanvas = this.$refs.munCanvas;
    this.munCtx = munCanvas.getContext('2d');
    let munPYCanvas = this.$refs.munPYCanvas;
    this.munPYCtx = munPYCanvas.getContext('2d');
    this.canvasInit();
    this.drawCanvas();
  },
  methods: {
    canvasInit() {
      let topCanvas = this.$refs.topCanvas;
      let topCtx = this.topCtx;
      let munCtx = this.munCtx;
      let munPYCtx = this.munPYCtx;

      //设置画布参数
      munCtx.font = '700 14px Arial';
      munCtx.textBaseline = 'top';
      munCtx.textAlign = "center";

      munPYCtx.font = '500 8px "Lucida Console", "Courier New", monospace';
      munPYCtx.textBaseline = 'top';
      munPYCtx.textAlign = "center";

      let isDown = false;
      let firstMove = true;
      let p1 = {}, p2 = {};
      // 鼠标按下事件
      topCanvas.addEventListener('mousedown', () => {
        isDown = true;
        topCtx.globalCompositeOperation = 'destination-out';
      });

      // 鼠标松开事件
      topCanvas.addEventListener('mouseup', () => {
        isDown = false;
        setTimeout(() => {
          topCtx.globalCompositeOperation = 'source-over';
          p1 = {};
          p2 = {};
        }, 20)
        firstMove = true;
      });

      //鼠标离开事件
      topCanvas.addEventListener('mouseleave', () => {
        if (isDown) {
          setTimeout(() => {
            isDown = false;
            topCtx.globalCompositeOperation = 'source-over';
            p1 = {};
            p2 = {};
            firstMove = true;
          }, 20)
        }
      });

      // 鼠标移动事件
      topCanvas.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        let x = event.offsetX;
        let y = event.offsetY;
        console.log(x + "===" + y)
        setTimeout(() => {
          if (firstMove) {     //第一次触发 只记录p1点
            console.log("firstMove")
            firstMove = false;
            p1.x = x;
            p1.y = y;
            return;
          }
          p2.x = x;
          p2.y = y;
          let k = (p2.y - p1.y) / (p2.x - p1.x);   // p1 p2直线斜率
          let b = p1.y - k * p1.x;                 //y = kx + b 的 b
          let d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); //两点之间的距离
          let num = d * 0.2;   //两点之间要画多少个圆才能看起来像条平滑直线，0.2 是平均每像素的距离 画0.2个圆，100像素的距离画20个圆足够
          //注意 这里圆点半径为15 - 25像素适应
          console.log(p1)
          console.log(p2)
          console.log(k)
          console.log(b)
          console.log(d)
          console.log(num)
          let firstX = p1.x, firstY = p1.y;   //第一个圆的位置
          let n = (p2.x - p1.x) / num;//每个圆心之间的间距
          for (let i = 0; i < num; i++) {   //依次在这条直线上画 num 个圆
            topCtx.beginPath();
            topCtx.fillRect(firstX - 135, firstY - 5, 270, 5);
            // topCtx.ellipse(firstX, firstY, 400, 6, 0, Math.PI * 0, Math.PI * 1, false);
            // topCtx.arc(firstX, firstY, 25, 0, 2 * Math.PI);
            // topCtx.arc(firstX, firstY, 10, 0, Math.PI * 2, false);
            topCtx.fill();
            topCtx.closePath();
            firstX += n;
            firstY = k * firstX + b;
          }
          p1.x = p2.x;
          p1.y = p2.y;
          // p1 = p2;  //最后 将p2 赋给 p1
        }, 5);


        // 绘制擦除效果
        // topCtx.beginPath();
        // // topCtx.arc(x, y, 10, 0, Math.PI * 2, false); // 使用圆形笔触
        // // topCtx.ellipse(x, y, 400, 6, 0, Math.PI * 0, Math.PI * 1, false); // 使用椭圆笔触
        // topCtx.fillRect(x - 135, y - 5, 270, 5);
        // topCtx.fill();
        // topCtx.closePath();
      });
    },

    drawCanvas() {
      let bottomCtx = this.bottomCtx;
      let topCtx = this.topCtx;
      let dgxCtx = this.dgxCtx;
      let munCtx = this.munCtx;
      let munPYCtx = this.munPYCtx;

      //清空之前内容
      bottomCtx.clearRect(0, 0, this.width, this.height);
      topCtx.clearRect(0, 0, this.width, this.height);
      dgxCtx.clearRect(0, 0, this.width, this.height);
      munCtx.clearRect(0, 0, this.width, this.height);
      munPYCtx.clearRect(0, 0, this.width, this.height);

      //加载等高线
      let dgxIndex = getRandom(0, 4);
      dgxCtx.globalAlpha = 0.3;
      let gdxImg = new Image();
      gdxImg.src = require('@/assets/dgx' + dgxIndex + '.png'); // 等高线
      gdxImg.onload = () => {
        // dgxCtx.drawImage(gdxImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载刮奖层
      let playImg = new Image();
      playImg.src = require('@/assets/xxf-20-play.png');
      playImg.onload = () => {
        // topCtx.drawImage(playImg, this.playX, this.playY, this.playWidth, this.playHeight);
        topCtx.fillRect(this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载底层图片
      let bottomImage = new Image();
      bottomImage.src = require('@/assets/xxf_20.jpg'); // 底层图片路径
      bottomImage.onload = () => {
        // bottomCtx.drawImage(bottomImage, 0, 0, this.width, this.height);

        //加载灰色背景
        let bgImg = new Image();
        bgImg.src = require('@/assets/xxf-20-bg.png');
        bgImg.onload = () => {
          // bottomCtx.drawImage(bgImg, this.playX, this.playY, this.playWidth, this.playHeight);
        };

        // 生成当前页的奖金数组
        let tmpMunArr = Array.from(this.munArr);
        let currentMunArr = [];
        let munIndexArr = [];
        let splitMunArr = [];
        if (this.pageArr[this.currentPage] != 0) {
          splitMunArr = munSplit(this.pageArr[this.currentPage], this.munSplitArr, this.chanceNum);
          for (let i = 0; i < splitMunArr.length; i++) {
            let tmpRandom = getRandom(0, this.chanceNum);
            if (munIndexArr.indexOf(tmpRandom) != -1) {
              i--;
              continue;
            }
            munIndexArr[i] = tmpRandom;
            currentMunArr[tmpRandom] = splitMunArr[i];
          }
        }
        for (let i = 0; i < this.chanceNum; i++) {
          if (munIndexArr.indexOf(i) != -1) {
            continue;
          }
          let tmpMun = tmpMunArr[getRandom(0, tmpMunArr.length)];
          currentMunArr[i] = tmpMun;
          let tmpMunIndex = tmpMunArr.indexOf(tmpMun);
          //去除出现过的额外奖金
          if (tmpMun >= 200) {
            tmpMunArr.splice(tmpMunIndex, 1);
          }
        }

        //生成当前页的图标数组
        this.iconIndexArr = upsetArr(this.iconIndexArr);
        let tmpIconIndexArr = [];
        for (let i = 0; i < this.chanceNum; i++) {
          if (munIndexArr.indexOf(i) != -1) {
            //随机是否出现双喜
            if (getRandom(0, 3) == 2) {
              tmpIconIndexArr[i] = 'xi2';
              currentMunArr[i] /= 2;
            } else {
              tmpIconIndexArr[i] = 'xi';
            }
          } else {
            tmpIconIndexArr[i] = this.iconIndexArr[i];
          }
        }

        let iconImgArr = [];
        for (let i = 0; i < tmpIconIndexArr.length; i++) {
          let iconImg = new Image();
          if (tmpIconIndexArr[i] == 'xi') {
            iconImg.src = require('@/assets/xi.png');
            iconImgArr.push(iconImg);
          } else if (tmpIconIndexArr[i] == 'xi2') {
            iconImg.src = require('@/assets/xi2.png');
            iconImgArr.push(iconImg);
          } else {
            iconImg.src = require('@/assets/icon/' + tmpIconIndexArr[i] + '.png');
            iconImgArr.push(iconImg);
          }
        }
        for (let i = 0, xi = 0, yi = 0; i < this.chanceNum; i++, xi++) {
          if (xi > 4) {
            yi++;
            xi = 0;
          }
          iconImgArr[i].onload = () => {
            bottomCtx.drawImage(iconImgArr[i], this.playX + 10 + xi * 53, this.playY + 5 + yi * 55, 35, 35);
            let mun = currentMunArr[i];
            if (mun == 800000) {
              mun = '800,000';
            } else if (mun == 5000) {
              mun = '5,000';
            } else if (mun == 1000) {
              mun = '1,000';
            }
            // fillTextWithSpacing(munCtx, "¥" + mun, this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55, -1);
            fillTextWithSpacing(munCtx, "" + mun, this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55, -1);
            fillTextWithSpacing(munPYCtx, pinyin(numberToChinese(currentMunArr[i]), {toneType: 'none'}).replaceAll(" ", "").toUpperCase(),
                this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 48 + yi * 55, -0.5);
          }
        }
      };
    },
    dataInit() {
      let baseArr = [
        [100, 50, 50, 40, 40, 20, 20],
        [100, 50, 50, 40, 20, 20],
        [100, 50, 40, 20, 20, 20, 20],
        [100, 50, 40, 40, 20, 20, 20],
        [50, 50, 40, 40, 20, 20, 20, 20, 20],
        [50, 50, 40, 40, 40, 20, 20, 20],
        [50, 40, 40, 40, 20, 20, 20, 20, 20],
        [50, 40, 40, 20, 20, 20, 20, 20, 20, 20],
        [100, 50, 20, 20, 20, 20, 20, 20, 20],
        [50, 40, 40, 30, 20, 20, 20, 20, 20, 20]
      ];
      let baseProb = [5, 5, 10, 10, 15, 10, 10, 20, 10, 5];

      let extArr = [1000, 500, 200];
      let extProd = [10000, 4, 8, 20];

      let topArr = [800000, 5000];
      let topProb = [2500000, 1, 50];


      let basePool = createFullPool(baseProb);
      let pageBaseArr = baseArr[basePool[getRandom(0, 100)]];
      console.log(pageBaseArr);

      let extPool = createProbPool(extProd);
      let extNum = getRandom(0, extProd[0]);
      let extPrice = 0;
      for (let i = 0; i < extPool.length; i++) {
        let tmpArr = extPool[i];
        if (tmpArr.indexOf(extNum) != -1) {
          extPrice = extArr[i];
          break;
        }
      }
      console.log(extPrice);

      let topPool = createProbPool(topProb);
      let topNum = getRandom(0, topProb[0]);
      let topPrice = 0;
      for (let i = 0; i < topPool.length; i++) {
        let tmpArr = topPool[i];
        if (tmpArr.indexOf(topNum) != -1) {
          topPrice = topArr[i];
          break;
        }
      }
      console.log(topPrice);

      this.pageArr = Array.from(pageBaseArr);
      if (extPrice != 0) {
        this.pageArr.push(extPrice);
      }
      if (topPrice != 0) {
        this.pageArr.push(topPrice);
      }
      for (let i = 0; i < this.pageNum - pageBaseArr.length; i++) {
        this.pageArr.push(0);
      }
      this.pageArr = upsetArr(this.pageArr);
      console.log(this.pageArr);

      //随机出icon下标数组
      for (let i = 1; i <= baseData.data().iconNum; i++) {
        this.iconIndexArr.push(i);
      }
      this.iconIndexArr = upsetArr(this.iconIndexArr);
    },
    /**
     * 跳转到指定页
     */
    inputChange() {
      this.drawCanvas();
    },
    /**
     * 上一张
     */
    prePage() {
      if (this.currentPage != 0) {
        this.currentPage--;
        this.drawCanvas();
      }
    },
    /**
     * 下一张
     */
    nextPage() {
      if (this.currentPage != this.chanceNum - 1) {
        this.currentPage++;
        this.drawCanvas();
      }
    },
    /**
     * 第一种刮刀
     */
    guadao1() {
      this.guadao = 1;
    },
    /**
     * 第二种刮刀
     */
    guadao2() {
      this.guadao = 2;
    },
    /**
     * 第三种刮刀
     */
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

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.body {
  width: 700px;
  height: 800px;
  display: flex;
}

.canvas {
  width: 400px;
  height: 800px;
  position: relative;
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
