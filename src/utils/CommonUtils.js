/**
 * 创建100%概率随机池
 * @param probArr
 * @returns {*|*[]}
 */
export function createFullPool(probArr) {
    let pool = [];
    for (let i = 0; i < probArr.length; i++) {
        for (let j = 0; j < probArr[i]; j++) {
            pool.push(i);
        }
    }
    pool = upsetArr(pool);
    return pool;
}

/**
 * 创建概率随机池
 * @param probArr
 * @returns {*[]}
 */
export function createProbPool(probArr) {
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

/**
 * 获取一个随机数
 * @param min
 * @param max
 * @returns {number}
 */
export function getRandom(min, max) {
    let tmp = Math.random() * (max - min) + min
    return parseInt(tmp);
}

/**
 * 打乱数组
 * @param arr
 * @returns {*}
 */
export function upsetArr(arr) {
    arr.sort(() => Math.random() - 0.5);
    arr.sort(() => Math.random() - 0.4);
    arr.sort(() => Math.random() - 0.3);
    arr.sort(() => Math.random() - 0.2);
    arr.sort(() => Math.random() - 0.1);
    return arr;
}

/**
 * 将数字变成大写数字例如 1200 -> 一千二百
 * @param num
 * @returns {string}
 */
export function numberToChinese(num) {
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
}

/**
 * 金额分割
 * @param mun
 * @param munSplitArr
 * @param maxNum
 * @param res
 * @returns {*[]}
 */
export function munSplit(mun, munSplitArr, maxNum, res = []) {
    if (!(('mun' + mun) in munSplitArr)) {
        res.push(mun);
        return res;
    }
    if (getRandom(1, 3) == 1) {
        res.push(mun);
        return res;
    }
    let tmpRes = munSplitArr['mun' + mun];
    for (let i = 0; i < tmpRes.length; i++) {
        if (('mun' + tmpRes[i]) in munSplitArr) {
            if (res.length + tmpRes.length > maxNum) {
                return res;
            } else {
                munSplit(tmpRes[i], munSplitArr, maxNum, res);
            }
        } else {
            res.push(tmpRes[i]);
        }
    }
    return res;
}

/**
 * 前补零函数
 * @param str 字符串
 * @param number 需要的位数
 */
export function fillZero(str, number) {
    str = String(str)
    if (str.length < number) {
        let sub = number - str.length;
        for (let i = 0; i < sub; i++) {
            str = '0' + str;
        }
        return str;
    } else {
        return str;
    }
}