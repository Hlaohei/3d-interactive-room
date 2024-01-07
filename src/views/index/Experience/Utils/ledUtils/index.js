import ledBaseArray from "./ledBaseArray";

/**
 * 将二维数组中的1替换为color的颜色，0不替换，返回最终值
 * @param {*} baseArray 值为 0或1 的基础数组
 * @param {*} color 替换的颜色
 * @returns
 */
export const replaceBaseArrayColor = (baseArray, color) => {
  const baseArrayCopy = JSON.parse(JSON.stringify(baseArray));
  for (let i = 0; i < baseArrayCopy.length; i++) {
    for (let j = 0; j < baseArrayCopy[i].length; j++) {
      if (baseArrayCopy[i][j] === 1) {
        baseArrayCopy[i][j] = color;
      }
    }
  }
  return baseArrayCopy;
};

/**
 * 数字转为基础数组
 * 固定显示位数，每个数字中间插入一列空白
 * @param {*} num 转换的数字 正整数
 * @param {*} len 显示位数 0：不限制 大于0：限制传入的位数
 * @param {*} enableZeroPadding 是否需要补0
 * @returns
 */
export const numToArray = (num, len = 0, enableZeroPadding = false) => {
  if (!Number.isInteger(num) || !Number.isInteger(len) || num < 0 || len < 0) {
    return [];
  }

  // 转换成字符串，方便拼接
  const numStr = num.toString();
  let paddedStr = "";
  let numArray = [];

  if (len === 1) {
    // len=1，直接返回对应的个位数基础数组
    return ledBaseArray[num % 10];
  } else if (len > 1 && numStr.length >= len) {
    // 数字超过位数，只保留设定的位数
    numArray = numStr.split("").slice(-len);
  } else if (enableZeroPadding && numArray.length < len) {
    // 判断是否需要补0，如果不需要，就不补，但最大位数不能超过len，如果需要，就补，最大位数同样不超过len
    paddedStr = numStr.padStart(len, "0");
    numArray = paddedStr.split("");
  } else {
    numArray = numStr.split("");
  }

  const resultArray = numArray.flatMap((item) => [
    ...ledBaseArray[item],
    ...ledBaseArray.numBlank,
  ]);
  resultArray.pop();

  return resultArray;
};

/**
 * 获取当前时间的基础数组
 * @returns 时间基础数组
 */
export const getTimeArray = () => {
  // 获取当前时间
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 将时分秒转换成对应的数组
  const hoursArray = numToArray(hours, 2, true);
  const minutesArray = numToArray(minutes, 2, true);
  const secondsArray = numToArray(seconds, 2, true);

  const colon = [
    ...ledBaseArray.numBlank,
    ...ledBaseArray.numColon,
    ...ledBaseArray.numBlank,
  ];

  return [...hoursArray, ...colon, ...minutesArray, ...colon, ...secondsArray];
};

/**
 * 获取当前星期的基础数组
 * @param {*} opts 参数，比如color、otherColor
 * @returns
 */
export const getWeekArray = (
  opts = {
    color: "#33dd77",
    otherColor: "#228855",
  }
) => {
  let week = new Date().getDay();
  if (week === 0) week = 7;

  let weekData = [];
  for (let i = 1; i <= 7; i++) {
    const color = i === week ? opts.color : opts.otherColor;
    weekData.push([color], [color], [color], [0]);
  }
  weekData.pop();
  return weekData;
};

/**
 * 合并最终数组
 * @param {*} sourceArray 源数组 比如 [40][9] 的数组
 * @param {*} arrays 需要合并的数组及合并位置 [col列位置, row行位置, array]
 */
export const mergeIntoArray = (sourceArray, arrays) => {
  const sourceArrayCopy = JSON.parse(JSON.stringify(sourceArray));

  arrays.forEach((item, index) => {
    const { col, row, array } = item;

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        sourceArrayCopy[col + i][row + j] = array[i][j];
      }
    }
  });

  return sourceArrayCopy;
};

export default {
  replaceBaseArrayColor,
  numToArray,
  getTimeArray,
  getWeekArray,
  mergeIntoArray,
};
