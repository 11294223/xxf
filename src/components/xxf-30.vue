<template>
  <div class="body">
    <img :src="require('@/assets/xxf_30-dev.jpg')" style="width: 350px;height: 875px;">
  </div>
</template>

<script>

export default {
  name: 'Xxf-30',
  components:{

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

  },
  mounted() {

  },
  methods: {

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
  height: 875px;
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
