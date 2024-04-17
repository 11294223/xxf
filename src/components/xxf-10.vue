<template>
  <div class="body">
    <img id="barcode1" ref="barcode1" style="display: none;">
    <div class="canvas">
      <canvas id="bottomCanvas" :width=width :height=height ref="bottomCanvas"></canvas> <!-- 底层Canvas -->
      <canvas id="dgxCanvas" :width=width :height=height ref="dgxCanvas"></canvas> <!-- 等高线Canvas -->
      <canvas id="munCanvas" :width=width :height=height ref="munCanvas"></canvas> <!-- 钱数Canvas -->
      <canvas id="munPYCanvas" :width=width :height=height ref="munPYCanvas"></canvas> <!-- 钱数拼音Canvas -->
      <canvas id="topCanvas" :width=width :height=height ref="topCanvas"></canvas> <!-- 上层Canvas -->
    </div>
    <div class="tool">
      <div class="winInfo">
        <!--        <span>本次中奖金额：<h3>¥{{ munSum }}</h3></span>-->
        <!--        <span>当前本中奖金额：<h3>¥{{ pageMun }}</h3></span>-->
        <!--        <span>当前页中奖金额：<h3>¥{{ currentMun }}</h3></span>-->
        <el-button type="primary" @click="changePage" style="margin-top: 20px;">换一本</el-button>
      </div>
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
    <div class="exp">
      <Xxf20Exp></Xxf20Exp>
    </div>
  </div>
</template>

<script>
import {pinyin} from "pinyin-pro";
import baseData from "@/js/data";
import {fillTextWithSpacing} from '@/utils/canvasUtils'
import {
  createFullPool,
  createProbPool,
  numberToChinese,
  getRandom,
  upsetArr,
  munSplit,
  fillZero,
} from '@/utils/CommonUtils'
import JsBarcode from 'jsbarcode'
import Xxf20Exp from "@/components/xxf-20-exp.vue";

export default {
  name: 'Xxf-10',
  components:{
    Xxf20Exp
  },
  data() {
    return {
      munSum: 0,// 本次中奖金额
      pageMun: 0,// 当前本中奖金额
      currentMun: 0,// 当前页中奖金额
      alreadySafe: [],// 已经兑奖的页码
      currentPage: 0, // 当前页
      chanceNum: 25, // 中奖机会
      guaDaoSize: 0,
      guaDao1Marks: {5: '硬币', 20: '指甲', 40: '起子', 70: '小刮刀', 100: '大铲子'},
      guadao: 1,
      width: 400,
      height: 800,
      playWidth: 270,
      playHeight: 285,
      playX: 65,
      playY: 311,
      safeWidth: 167,
      safeHeight: 43,
      safeX: 20.8,
      safeY: 740.3,
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
      pageNumber: '',
      hostUrl: 'xxf.yiycm.cn',
      startSafeData: [],
      endSafeData: [],
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
    // this.canvasInit();
    // this.drawCanvas();
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
        firstMove = true;
        this.computeMun();
        setTimeout(() => {
          topCtx.globalCompositeOperation = 'source-over';
          p1 = {};
          p2 = {};
        }, 20)
      });

      //鼠标离开事件
      topCanvas.addEventListener('mouseleave', () => {
        if (isDown) {
          this.computeMun();
          firstMove = true;
          setTimeout(() => {
            isDown = false;
            topCtx.globalCompositeOperation = 'source-over';
            p1 = {};
            p2 = {};
          }, 20)
        }
      });

      // 鼠标移动事件
      topCanvas.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        let x = event.offsetX;
        let y = event.offsetY;
        setTimeout(() => {
          if (firstMove) {     //第一次触发 只记录p1点
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
          let firstX = p1.x, firstY = p1.y;   //第一个圆的位置
          let n = (p2.x - p1.x) / num;//每个圆心之间的间距
          for (let i = 0; i < num; i++) {   //依次在这条直线上画 num 个圆
            topCtx.beginPath();
            if (this.guadao == 1) {
              let guadaoWidth = 270 * (this.guaDaoSize / 150);
              topCtx.fillRect(firstX - (guadaoWidth / 2), firstY - 5, guadaoWidth, 5);
            } else if (this.guadao == 2) {
              let guadaoWidth = 270 * (this.guaDaoSize / 150);
              topCtx.fillRect(firstX - 5, firstY - (guadaoWidth / 2), 5, guadaoWidth);
            } else if (this.guadao == 3) {
              let guadaoRadius = this.guaDaoSize;
              topCtx.arc(firstX, firstY, guadaoRadius, 0, Math.PI * 2, false);
            }
            topCtx.fill();
            topCtx.closePath();
            firstX += n;
            firstY = k * firstX + b;
          }
          p1.x = p2.x;
          p1.y = p2.y;
        }, 5);
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
        dgxCtx.drawImage(gdxImg, this.playX, this.playY, this.playWidth, this.playHeight);
      };

      // 加载刮奖层
      let playImg = new Image();
      playImg.src = require('@/assets/xxf-20-play.png');
      playImg.onload = () => {
        topCtx.globalCompositeOperation = 'source-over';
        topCtx.drawImage(playImg, this.playX, this.playY, this.playWidth, this.playHeight);
        // topCtx.fillRect(this.playX, this.playY, this.playWidth, this.playHeight);
      };

      //加载安保区
      let safeImg = new Image();
      safeImg.src = require('@/assets/xxf-20-safe.png');
      safeImg.onload = () => {
        topCtx.globalCompositeOperation = 'source-over';
        topCtx.drawImage(safeImg, this.safeX, this.safeY, this.safeWidth, this.safeHeight);
        this.startSafeData = this.topCtx.getImageData(this.safeX, this.safeY, this.safeWidth, this.safeHeight).data;
      }

      JsBarcode("#barcode1", this.pageNumber + '1' + fillZero(this.currentPage, 2) + '-3', {
        format: "CODE39",//条形码的格式
        width: 1,//线宽
        height: 5,//条码高度
        lineColor: "#000",//线条颜色
        displayValue: false,//是否显示文字
        margin: 0,//设置条形码周围的空白区域
      })
      let base64 = this.$refs.barcode1.src;

      // 加载底层图片
      let bottomImage = new Image();
      bottomImage.src = require('@/assets/xxf_20.jpg'); // 底层图片路径
      bottomImage.onload = () => {
        //恢复默认值
        bottomCtx.fillStyle = 'black';
        bottomCtx.font = '10px sans-serif';
        bottomCtx.textBaseline = 'alphabetic';
        bottomCtx.textAlign = "start";
        bottomCtx.drawImage(bottomImage, 0, 0, this.width, this.height);

        //编码和条形码
        let barCodeImage = new Image();
        barCodeImage.src = base64;
        bottomCtx.fillStyle = 'white';
        bottomCtx.fillRect(210, 754, 170, 32);
        bottomCtx.drawImage(barCodeImage, 220, 760, 150, 10);
        bottomCtx.fillStyle = 'black';
        fillTextWithSpacing(bottomCtx, this.pageNumber + '1' + fillZero(this.currentPage, 2) + '-3',
            220, 780, 0.5);

        //保安区底色
        bottomCtx.fillStyle = 'white';
        bottomCtx.fillRect(this.safeX, this.safeY, this.safeWidth, this.safeHeight);
        //保安区条形码和网址
        bottomCtx.drawImage(barCodeImage, this.safeX + 5, this.safeY + 10, 155, 10);
        bottomCtx.fillStyle = 'black';
        bottomCtx.font = '700 16px Arial';
        bottomCtx.textBaseline = 'top';
        bottomCtx.textAlign = "center";
        fillTextWithSpacing(bottomCtx, this.hostUrl, this.safeX + 85, this.safeY + 25, 1);

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
            let tmpCurrentMun = String(currentMunArr[i] / 2);
            //随机是否出现双喜
            if (tmpCurrentMun.indexOf('.') == -1 && getRandom(0, 3) == 2) {
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
            // fillTextWithSpacing(munCtx, "" + mun, this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 35 + yi * 55, -1);
            fillTextWithSpacing(munPYCtx, pinyin(numberToChinese(currentMunArr[i]), {toneType: 'none'}).replaceAll(" ", "").toUpperCase(),
                this.playX + 28.5 + xi * 53, this.playY + 4 + 1 * 48 + yi * 55, -0.5);
          }
        }

        //调试打印
        // console.log('tmpIconIndexArr', tmpIconIndexArr)
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
      let extProd = [100000, 4, 8, 20];

      let topArr = [800000, 5000];
      let topProb = [12500000, 1, 50];


      let basePool = createFullPool(baseProb);
      let pageBaseArr = baseArr[basePool[getRandom(0, 100)]];


      let extPool = createProbPool(extProd);
      let extNumArr = [];
      let extPriceArr = [];
      for (let i = 0; i < 2; i++) {
        extNumArr.push(getRandom(0, extProd[0]));
      }
      for (let i = 0; i < extPool.length; i++) {
        let tmpArr = extPool[i];
        for (let j = 0; j < extNumArr.length; j++) {
          if (tmpArr.indexOf(extNumArr[j]) != -1) {
            extPriceArr.push(extArr[i]);
          }
        }
      }

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

      this.pageArr = Array.from(pageBaseArr);
      if (extPriceArr.length != 0) {
        this.pageArr = this.pageArr.concat(extPriceArr);
      }
      if (topPrice != 0) {
        this.pageArr.push(topPrice);
      }
      for (let i = 0; i < this.pageNum - pageBaseArr.length; i++) {
        this.pageArr.push(0);
      }
      this.pageArr = upsetArr(this.pageArr);

      //随机出icon下标数组
      for (let i = 1; i <= baseData.data().iconNum; i++) {
        this.iconIndexArr.push(i);
      }
      this.iconIndexArr = upsetArr(this.iconIndexArr);

      //随机生成编号
      this.pageNumber = 'J0791-' + getRandom(22, 25) + fillZero(getRandom(0, 100), 3)
          + '-' + fillZero(getRandom(0, 10000000), 7) + '-';

      //调试打印
      // console.log('pageBaseArr', pageBaseArr);
      // console.log('extPrice', extPrice);
      // console.log('topPrice', topPrice);
      // console.log('pageArr', this.pageArr);
    },
    /**
     * 计算奖金
     */
    computeMun() {
      //计算擦除率
      this.endSafeData = this.topCtx.getImageData(this.safeX, this.safeY, this.safeWidth, this.safeHeight).data;
      let erasedPixels = 0;
      // 遍历像素数据并计算擦除的像素
      for (let i = 0; i < this.endSafeData.length; i += 3) {
        if (this.endSafeData[i + 3] < this.startSafeData[i + 3]) {
          erasedPixels++;
        }
      }
      // 计算擦除率
      const totalPixels = this.safeWidth * this.safeHeight;
      const eraseRate = erasedPixels / totalPixels;
      if (eraseRate > 0.7) {
        this.topCtx.fillRect(this.safeX, this.safeY, this.safeWidth, this.safeHeight);
        let tmpMun = this.pageArr[this.currentPage]
        this.currentMun = tmpMun;
        if (this.alreadySafe.indexOf(this.currentPage) == -1) {
          this.munSum += tmpMun;
          this.pageMun += tmpMun;
          this.alreadySafe.push(this.currentPage);
        }
      }
    },
    //重置数据
    resetData() {
      this.pageMun = 0;// 当前本中奖金额
      this.currentMun = 0;// 当前页中奖金额
      this.alreadySafe = [];// 已经兑奖的页码
      this.currentPage = 0; // 当前页
      this.pageArr = []; // 当前本每页的奖金数额
      this.iconIndexArr = []; // 图标下标数组
      this.pageNumber = '';
      this.startSafeData = [];
      this.endSafeData = [];
    },
    /**
     * 换一本
     */
    changePage() {
      this.resetData();
      this.dataInit();
      this.drawCanvas();
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
        this.currentMun = 0;
      }
    },
    /**
     * 下一张
     */
    nextPage() {
      if (this.currentPage != this.pageNum - 1) {
        this.currentPage++;
        this.drawCanvas();
        this.currentMun = 0;
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
  width: 1000px;
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

.exp {
  width: 350px;
  background-color: cornsilk;
}

.winInfo {
  width: 250px;
  height: 250px;
  background: aliceblue;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.winInfo span {
  width: 220px;
  margin-top: 10px;
}

.choicePage {
  width: 250px;
  height: 250px;
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

/*兼容多个浏览器,超出换行*/
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  *word-wrap: break-word;
  *white-space: normal;
}
</style>
