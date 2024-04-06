<template>
  <div class="body">
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
      munArr: ['800,000', '5,000', '1,000', 500, 200, 100, 50, 40, 30, 20],
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
      let dgxIndex = this.getRandom(0, 4);
      dgxCtx.globalAlpha = 0.3;
      let gdxImg = new Image();
      gdxImg.src = require('@/assets/dgx' + dgxIndex + '.png'); // 等高线
      gdxImg.onload = () => {
        dgxCtx.drawImage(gdxImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载刮奖层
      let playImg = new Image();
      playImg.src = require('@/assets/xxf-20-play.png'); // 上层图片路径
      playImg.onload = () => {
        // topCtx.drawImage(playImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载底层图片
      let bottomImage = new Image();
      bottomImage.src = require('@/assets/xxf_20.jpg'); // 底层图片路径
      bottomImage.onload = () => {
        bottomCtx.drawImage(bottomImage, 0, 0, this.width, this.height);

        //加载背景
        let bgImg = new Image();
        bgImg.src = require('@/assets/xxf-20-bg.png'); // 等高线
        bgImg.onload = () => {
          bottomCtx.drawImage(bgImg, this.playX, this.playY, this.playWidth, this.playHeight);
        };

        // 生成当前页的奖金数组
        let currentMunArr = []
        let munIndex = -1;
        if (this.pageArr[this.currentPage] != 0) {
          munIndex = this.getRandom(0, this.chanceNum)
          currentMunArr[munIndex] = this.pageArr[this.currentPage];
        }
        for (let i = 0; i < this.chanceNum; i++) {
          if (i == munIndex) {
            continue;
          }
          currentMunArr[i] = this.munArr[this.getRandom(0, this.munArr.length)];
        }


        //生成当前页的图标数组
        this.iconIndexArr = this.upsetArr(this.iconIndexArr);
        let tmpIconIndexArr = [];
        for (let i = 0; i < this.chanceNum; i++) {
          if (i == munIndex) {
            tmpIconIndexArr[i] = 'xi';
          } else {
            tmpIconIndexArr[i] = this.iconIndexArr[i];
          }
        }
        let iconImgArr = [];
        for (let i = 0; i < tmpIconIndexArr.length; i++) {
          let iconImg = new Image();
          if (tmpIconIndexArr[i] != 'xi') {
            iconImg.src = require('@/assets/icon/' + tmpIconIndexArr[i] + '.png');
            iconImgArr.push(iconImg);
          } else {
            iconImg.src = require('@/assets/xi2.png');
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
            munCtx.fillText("¥" + currentMunArr[i], this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55);
            // munCtx.letterSpacingText("¥" + currentMunArr[i], this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55, -1);
            let mun = currentMunArr[i].toString();
            mun = mun.replaceAll(",", "");
            munPYCtx.fillText(pinyin(this.numberToChinese(mun), {toneType: 'none'}).replaceAll(" ", "").toUpperCase(),
                this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 48 + yi * 55);
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


      let basePool = this.createFullPool(baseProb);
      let pageBaseArr = baseArr[basePool[this.getRandom(0, 100)]];
      console.log(pageBaseArr);

      let extPool = this.createProbPool(extProd);
      let extNum = this.getRandom(0, extProd[0]);
      let extPrice = 0;
      for (let i = 0; i < extPool.length; i++) {
        let tmpArr = extPool[i];
        if (tmpArr.indexOf(extNum) != -1) {
          extPrice = extArr[i];
          break;
        }
      }
      console.log(extPrice);

      let topPool = this.createProbPool(topProb);
      let topNum = this.getRandom(0, topProb[0]);
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
      console.log(this.pageArr);
      this.pageArr = this.upsetArr(this.pageArr);

      //随机出icon下标数组
      for (let i = 1; i <= baseData.data().iconNum; i++) {
        this.iconIndexArr.push(i);
      }
      this.iconIndexArr = this.upsetArr(this.iconIndexArr);
      console.log(this.iconIndexArr);
    },

    createFullPool(probArr) {
      let pool = [];
      for (let i = 0; i < probArr.length; i++) {
        for (let j = 0; j < probArr[i]; j++) {
          pool.push(i);
        }
      }
      pool = this.upsetArr(pool);
      return pool;
    },

    createProbPool(probArr) {
      let pool = [];
      for (let i = 1; i < probArr.length; i++) {
        let tmpArr = [];
        for (let j = 0; j < probArr[i]; j++) {
          tmpArr.push(this.getRandom(0, probArr[0]));
        }
        pool.push(tmpArr);
      }
      return pool;
    },

    getRandom(min, max) {
      let tmp = Math.random() * (max - min) + min
      return parseInt(tmp);
    },

    upsetArr(arr) {
      arr.sort(() => Math.random() - 0.5);
      arr.sort(() => Math.random() - 0.4);
      arr.sort(() => Math.random() - 0.3);
      arr.sort(() => Math.random() - 0.2);
      arr.sort(() => Math.random() - 0.1);
      return arr;
    },

    numberToChinese(num) {
      const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const units = ['', '十', '百', '千', '万'];
      let numStr = num.toString();
      let chineseStr = '';

      let flag = false;
      if (numStr.length > 5 && numStr.length < 9) {
        flag = true;
        if (numStr.length > 5) {
          numStr = numStr.replaceAll("0000", "");
        }
      }

      for (let i = 0; i < numStr.length; i++) {
        let num = Number(numStr[i]);
        let unit = units[numStr.length - i - 1];
        if (unit === '千' && num === 0 && chineseStr.slice(-1) !== '千') {
          chineseStr += '零';
        }
        if (num !== 0 || unit === '万') {
          chineseStr += chineseNumbers[num] + unit;
        }
      }
      chineseStr = chineseStr.replace("万零", '万');
      if (flag) {
        chineseStr += "万"
      }
      return chineseStr;
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

.body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>