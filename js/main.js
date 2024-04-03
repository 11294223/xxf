function addScript(url){
    document.write("<script language=javascript src=./Convert_Pinyin.js></script>");
}
function xxf20_init() {
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

    let page = 25;
    let pageArr = Array.from(pageBaseArr);
    for (let i = 0; i < page - pageBaseArr.length; i++) {
        pageArr.push(0);
    }
    console.log(pageArr);
    pageArr = upsetArr(pageArr);

    console.log(numberToChinese(20))
    console.log(numberToChinese(100))
    console.log(numberToChinese(102))
    console.log(numberToChinese(1020))
    console.log(numberToChinese(35))
    console.log(numberToChinese(57))
    console.log(numberToChinese(357))
    console.log(numberToChinese(350))

}

function createFullPool(probArr) {
    let pool = [];
    for (let i = 0; i < probArr.length; i++) {
        for (let j = 0; j < probArr[i]; j++) {
            pool.push(i);
        }
    }
    pool = upsetArr(pool);
    return pool;
}

function createProbPool(probArr) {
    let pool = [];
    for (let i = 1; i < probArr.length; i++) {
        let tmpArr = [];
        for (let j = 0; j < probArr[i]; j++) {
            tmpArr.push(getRandom(0, probArr[0]));
        }
        pool.push(tmpArr);
    }
    return pool;
}

function getRandom(min, max) {
    let tmp = Math.random() * (max - min) + min
    return parseInt(tmp);
}

function upsetArr(arr) {
    arr.sort(() => Math.random() - 0.5);
    arr.sort(() => Math.random() - 0.4);
    arr.sort(() => Math.random() - 0.3);
    arr.sort(() => Math.random() - 0.2);
    arr.sort(() => Math.random() - 0.1);
    return arr;
}

function numberToChinese(num) {
    const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万', '十万', '百万', '千万'];
    let str = '';
    num = num.toString();
    for (let i = 0; i < num.length; i++) {
        str += chineseNumbers[num[i]] + units[num.length - i - 1];
    }
    return str;
}
