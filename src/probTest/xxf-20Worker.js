import {createFullPool, createProbPool, fillZero, getRandom, upsetArr} from "@/utils/CommonUtils";
import baseData from "@/js/data";

let times200 = 0
let times500 = 0
let times1000 = 0
let times5000 = 0
let times800000 = 0
let testNum = 10;

this.onmessage = function (num) {
    console.log('onmessage')
    testNum = num;
    start();
}

function start() {
    console.log('worker')
    for (let i = 0; i < testNum; i++) {
        if (i % 1000 == 0) {
            console.log('已完成', i + 1, '次测试')
        }
        let res = dataInit();
        let extPriceArr = Array.from(res.extPriceArr);
        for (let j = 0; j < extPriceArr.length; j++) {
            if (extPriceArr[j] == 200) {
                times200++;
            } else if (extPriceArr[j] == 500) {
                times500++;
            } else if (extPriceArr[j] == 1000) {
                times1000++;
            }
        }
        let topPrice = res.topPrice;
        if (topPrice == 5000) {
            times5000++;
        } else if (topPrice == 800000) {
            times800000++;
        }
    }
    //返回子线程测试结果
    this.postMessage({
        times200: times200,
        times500: times500,
        times1000: times1000,
        times5000: times5000,
        times800000: times800000
    });
}

function dataInit() {
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


    let extPool = createProbPool(extProd);
    let extNumArr = [];
    let extPriceArr = [];
    for (let i = 0; i < 8; i++) {
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

    //返回数据(用于调试和概率统计)
    return {
        pageBaseArr: pageBaseArr,
        extPriceArr: extPriceArr,
        topPrice: topPrice
    };
}
