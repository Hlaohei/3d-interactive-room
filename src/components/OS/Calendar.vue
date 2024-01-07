<template>
  <transition name="calendarTransition">
    <div
      class="os-calendar-box"
      :style="{
        left: left === 0 ? '50%' : left + 'px',
      }"
    >
      <div class="calendar-operate-box">
        <span class="calendar-title">{{ dateText }}</span>

        <div class="calendar-operate">
          <transition name="operateBtnTransition">
            <button v-show="!isToday" :disabled="isToday" @click="currentDate">
              今
            </button>
          </transition>

          <button @click="changeMonth('prev')">
            <i class="iconfont icon-arow_left"></i>
          </button>

          <button @click="changeMonth('next')">
            <i class="iconfont icon-arow_right"></i>
          </button>
        </div>
      </div>

      <div class="calendar-grid calendar-header">
        <span
          v-for="(item, index) in weekMapZh"
          :key="index"
          class="calendar-grid-item calendar-header-item"
          :class="{ gray: index === 0 || index === 6 }"
        >
          {{ item }}
        </span>
      </div>

      <div
        class="calendar-grid calendar-content"
        :data-month="date.getMonth() + 1"
      >
        <div
          v-for="(item, index) in calendarTable"
          :key="index"
          class="calendar-grid-item calendar-content-item"
          :class="{
            gray: !item.isCurrentMonth,
            active: isActive(item),
          }"
        >
          {{ item.day }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { weekMapZh, generateCalendar } from "./calendar";

const props = defineProps({
  left: Number,
});

const isAllTrue = (arr, fn = (p) => Boolean(p)) => arr.every(fn);

const date = ref(new Date());
const calendarTable = computed(() => generateCalendar(date.value));
const dateText = computed(() => {
  return `${date.value.getFullYear()}年 ${date.value.getMonth() + 1}月`;
});

const isToday = computed(() => {
  const current = new Date();
  const validArr = [
    date.value.getFullYear() === current.getFullYear(),
    date.value.getMonth() === current.getMonth(),
    date.value.getDay() === current.getDay(),
  ];
  return isAllTrue(validArr);
});
/**
 * 当天日期高亮显示, 兼容切换日期：
 * 年月日都要对上才能高亮
 * ps: 日历可能会显示下月/上月的同样日期， 仅当月日期高亮
 */
const isActive = (item) => {
  return isAllTrue([
    item.day === date.value.getDate(),
    item.isCurrentMonth,
    item.month === new Date().getMonth(),
    item.year === new Date().getFullYear(),
  ]);
};
// 切换到今天
const currentDate = () => {
  date.value = new Date();
};
// 切换月份, 上个月 or 下个月
const changeMonth = (type) => {
  let month = 0;
  let year = 1970;
  if (type === "prev") {
    month = date.value.getMonth() === 0 ? 11 : date.value.getMonth() - 1;
    year =
      month === 11 ? date.value.getFullYear() - 1 : date.value.getFullYear();
  } else {
    month = date.value.getMonth() === 11 ? 0 : date.value.getMonth() + 1;
    year =
      month === 0 ? date.value.getFullYear() + 1 : date.value.getFullYear();
  }

  if (month === new Date().getMonth()) {
    currentDate();
    return;
  }

  date.value.setDate(1);
  date.value.setMonth(month);
  date.value.setFullYear(year);

  date.value = new Date(date.value);
};
</script>

<style lang="scss" scoped>
.os-calendar-box {
  @include glass-bg-dark(1);
  @apply absolute bottom-14 left-1/2 -translate-x-1/2
    rounded-xl p-4 w-64
    overflow-auto
    z-[49]
    select-none;

  .calendar-operate-box {
    @apply flex justify-between items-center gap-2
      text-white text-opacity-80 tracking-wide
      mb-2;

    .calendar-title {
      @apply text-xl;
    }

    .calendar-operate {
      @apply flex items-center justify-center gap-1;

      button {
        @include glass-bg-dark(0);
        @apply flex items-center justify-center
          h-6 aspect-square
          rounded-lg
          text-white text-opacity-60;
        transition: all 0.3s;

        &:hover,
        &.active {
          background-color: rgba($color: #ffffff, $alpha: 0.1);
        }
        &:active {
          background-color: rgba($color: #ffffff, $alpha: 0.2);
          transform: scale(0.95);
        }
      }

      button,
      i {
        @apply text-xs;
      }
    }
  }

  .calendar-grid {
    @apply grid grid-cols-7;

    .calendar-grid-item {
      @apply h-8 aspect-square
        text-center leading-8
        text-white text-opacity-60;

      &.gray {
        @apply text-opacity-20;
      }

      &.active {
        @apply text-opacity-100 shadow-md
          rounded-full;
        background-color: rgba($color: #ffffff, $alpha: 0.1);
      }
    }
  }
  .calendar-content {
    @apply relative;

    &::after {
      content: attr(data-month);
      @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        text-8xl text-black text-opacity-10;
    }
  }
}

.calendarTransition-enter-active {
  animation: calendarTransition 0.3s;
}
.calendarTransition-leave-active {
  animation: calendarTransition 0.2s reverse;
}
@keyframes calendarTransition {
  from {
    opacity: 0;
    transform: translate(-50%, 10%) scale(0.8);
  }
  to {
    opacity: 1;
  }
}

.operateBtnTransition-enter-active {
  animation: operateBtnTransition 0.3s;
}
.operateBtnTransition-leave-active {
  animation: operateBtnTransition 0.3s reverse;
}
@keyframes operateBtnTransition {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
  }
}
</style>
