export const weekMapZh = ["日", " 一", "二", "三", "四", "五", "六"];

const calendarGrid = 42; // 7 * 6宫格;

/**
 * 是否为闰年
 * @param year
 * @returns
 */
const isLeap = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 100 === 0;
};

/**
 * 获取[month]月有几天
 * @param year
 * @param month
 * @returns
 */
const getDays = (year, month) => {
  const feb = isLeap(year) ? 29 : 28;
  const daysPerMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[month];
};

/**
 * 获取下个月/上个月有多少天
 * @param date
 * @param type "next" | "last"
 * @returns
 */
const getNextOrLastMonthDays = (date, type) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (type === "last") {
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastYear = lastMonth === 11 ? year - 1 : year;
    return {
      year: lastYear,
      month: lastMonth,
      days: getDays(lastYear, lastMonth),
    };
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = nextMonth === 0 ? year + 1 : year;
  return {
    year: nextYear,
    month: nextMonth,
    days: getDays(nextYear, nextMonth),
  };
};

export const generateCalendar = (date) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  // 当月天数
  const days = getDays(currentYear, currentMonth);
  // 获取上月末尾天数和下月开头的天数，用于填补当月日历空白
  const {
    days: lastMonthDays,
    year: lastMonthYear,
    month: lastMonth,
  } = getNextOrLastMonthDays(date, "last");
  const { year: nextMonthYear, month: nextMonth } = getNextOrLastMonthDays(
    date,
    "next"
  );
  // 1号是星期几
  const weekIndex = new Date(`${currentYear}/${currentMonth + 1}/1`).getDay();
  // 显示在当月末尾的下月天数
  const trailDays = calendarGrid - weekIndex - days;
  let trailVal = 0;
  const calendarTable = [];
  for (let i = 0; i < calendarGrid; i++) {
    // 补充上月天数
    if (i < weekIndex) {
      calendarTable[i] = {
        year: lastMonthYear,
        month: lastMonth,
        day: lastMonthDays - weekIndex + i + 1,
        isCurrentMonth: false,
      };
      // 补充下月天数
    } else if (i >= days + weekIndex) {
      if (trailVal < trailDays) {
        trailVal += 1;
      }
      calendarTable[i] = {
        year: nextMonthYear,
        month: nextMonth,
        day: trailVal,
        isCurrentMonth: false,
      };
    }
  }
  // 填充当月日期
  for (let d = 1; d <= days; d++) {
    calendarTable[weekIndex + d - 1] = {
      year: currentYear,
      month: currentMonth,
      day: d,
      isCurrentMonth: true,
    };
  }

  return calendarTable;
};

export default {
  weekMapZh,
  generateCalendar,
};
