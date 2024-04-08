<template>
  <div class="body">
    <el-button>Default</el-button>
    <canvas id="bottomCanvas" :width=width :height=height ref="bottomCanvas"></canvas> <!-- 底层Canvas -->
    <canvas id="dgxCanvas" :width=width :height=height ref="dgxCanvas"></canvas> <!-- 等高线Canvas -->
    <canvas id="munCanvas" :width=width :height=height ref="munCanvas"></canvas> <!-- 钱数Canvas -->
    <canvas id="munPYCanvas" :width=width :height=height ref="munPYCanvas"></canvas> <!-- 钱数拼音Canvas -->
    <canvas id="topCanvas" :width=width :height=height ref="topCanvas"></canvas> <!-- 上层Canvas -->
  </div>
</template>

<script>
import {pinyin} from "pinyin-pro";
import baseData from "@/js/data";
import {fillTextWithSpacing} from '@/utils/canvasUtils'
import {createFullPool, createProbPool, numberToChinese, getRandom, upsetArr, munSplit} from '@/utils/CommonUtils'

export default {
  name: 'Xxf-20',
  data() {
    return {
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
      currentPage: 0, // 当前页
      chanceNum: 25, // 中奖机会
      pageArr: [], // 当前本每页的奖金数额
      iconIndexArr: [], // 图标下标数组
    }
  },
  created() {
    this.dataInit();
  },
  mounted() {
    this.canvasInit();
  },
  methods: {
    canvasInit() {
      let bottomCanvas = this.$refs.bottomCanvas;
      let bottomCtx = bottomCanvas.getContext('2d');
      let topCanvas = this.$refs.topCanvas;
      let topCtx = topCanvas.getContext('2d');
      let dgxCanvas = this.$refs.dgxCanvas;
      let dgxCtx = dgxCanvas.getContext('2d');
      let munCanvas = this.$refs.munCanvas;
      let munCtx = munCanvas.getContext('2d');
      let munPYCanvas = this.$refs.munPYCanvas;
      let munPYCtx = munPYCanvas.getContext('2d');

      //设置画布参数
      munCtx.font = '700 14px Arial';
      munCtx.textBaseline = 'top';
      munCtx.textAlign = "center";

      munPYCtx.font = '500 8px "Lucida Console", "Courier New", monospace';
      munPYCtx.textBaseline = 'top';
      munPYCtx.textAlign = "center";

      //加载等高线
      let dgxIndex = getRandom(0, 4);
      dgxCtx.globalAlpha = 0.3;
      let gdxImg = new Image();
      gdxImg.src = require('@/assets/dgx' + dgxIndex + '.png'); // 等高线
      gdxImg.onload = () => {
        dgxCtx.drawImage(gdxImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载刮奖层
      let playImg = new Image();
      playImg.src = require('@/assets/xxf-20-play.png');
      playImg.onload = () => {
        topCtx.drawImage(playImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载底层图片
      let bottomImage = new Image();
      bottomImage.src = require('@/assets/xxf_20.jpg'); // 底层图片路径
      bottomImage.onload = () => {
        bottomCtx.drawImage(bottomImage, 0, 0, this.width, this.height);

        //加载灰色背景
        let bgImg = new Image();
        bgImg.src = require('@/assets/xxf-20-bg.png');
        bgImg.onload = () => {
          bottomCtx.drawImage(bgImg, this.playX, this.playY, this.playWidth, this.playHeight);
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
            fillTextWithSpacing(munCtx, "¥" + mun, this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55, -1);
            fillTextWithSpacing(munPYCtx, pinyin(numberToChinese(currentMunArr[i]), {toneType: 'none'}).replaceAll(" ", "").toUpperCase(),
                this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 48 + yi * 55, -0.5);
          }
        }

      };


      let isDown = false;
      // 鼠标按下事件
      topCanvas.addEventListener('mousedown', () => {
        isDown = true;
        topCtx.globalCompositeOperation = 'destination-out';
      });

      // 鼠标松开事件
      topCanvas.addEventListener('mouseup', () => {
        isDown = false;
      });

      // 鼠标移动事件
      topCanvas.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        let x = event.offsetX;
        let y = event.offsetY;
        // 绘制擦除效果
        topCtx.beginPath();
        topCtx.arc(x, y, 10, 0, Math.PI * 2, false); // 使用圆形笔触
        topCtx.fill();
        topCtx.closePath();
      });
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

  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
