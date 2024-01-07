<template>
  <div class="app-sys-calculator-box" tabindex="0" @keydown="handleKeyDown">
    <div class="result-box">
      <span>{{ previousExpression }}</span>
      <span>{{ currentExpression }}</span>
    </div>

    <div class="buttons">
      <button class="operator col-span-2" @click="clear">C</button>
      <button class="operator" @click="deleteLastChar">
        <i class="iconfont icon-backspace"></i>
      </button>
      <button class="operator" @click="appendToExpression('/')">÷</button>

      <button @click="appendToExpression('7')">7</button>
      <button @click="appendToExpression('8')">8</button>
      <button @click="appendToExpression('9')">9</button>
      <button class="operator" @click="appendToExpression('*')">×</button>

      <button @click="appendToExpression('4')">4</button>
      <button @click="appendToExpression('5')">5</button>
      <button @click="appendToExpression('6')">6</button>
      <button class="operator" @click="appendToExpression('-')">-</button>

      <button @click="appendToExpression('1')">1</button>
      <button @click="appendToExpression('2')">2</button>
      <button @click="appendToExpression('3')">3</button>
      <button class="operator" @click="appendToExpression('+')">+</button>

      <button @click="appendToExpression('0')">0</button>
      <button @click="appendToExpression('.')">.</button>
      <button class="operator col-span-2" @click="calculate">=</button>
    </div>
  </div>
</template>

<script setup>
const currentExpression = ref("");
const previousExpression = ref("");

const appendToExpression = (value) => {
  currentExpression.value += value;
};

const deleteLastChar = () => {
  currentExpression.value = currentExpression.value.toString().slice(0, -1);
};

const calculate = () => {
  try {
    previousExpression.value = currentExpression.value;
    currentExpression.value = eval(currentExpression.value);
  } catch (error) {
    currentExpression.value = "Error";
  }
};

const clear = () => {
  previousExpression.value = "";
  currentExpression.value = "";
};

const handleKeyDown = (event) => {
  const key = event.key;
  const validKeysRegex = /^[0-9/*+\-.=]|Backspace|Delete|Enter$/;
  if (validKeysRegex.test(key)) {
    event.preventDefault();
    switch (key) {
      case "Backspace":
      case "Delete":
        deleteLastChar();
        break;
      case "Enter":
      case "=":
        calculate();
        break;
      default:
        appendToExpression(key);
        break;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-sys-calculator-box {
  @apply text-white text-opacity-80
    w-full h-full;
  backdrop-filter: $glass-bg-blur-dark;

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .result-box {
    @apply flex flex-col
      h-[100px]
      text-3xl text-right tracking-wide;

    span {
      @apply block p-2 truncate;

      &:nth-child(1) {
        @apply text-lg text-white text-opacity-60;
      }
    }
  }

  .buttons {
    @apply grid grid-cols-4 gap-1
      p-2;
    height: calc(100% - 100px);

    button {
      @apply bg-black bg-opacity-20 rounded-md
        select-none;
      transition: all 0.3s;

      &.operator {
        @apply bg-opacity-10;
      }

      &:hover,
      &.active {
        background-color: rgba($color: #ffffff, $alpha: 0.1);
      }
      &:active {
        background-color: rgba($color: #ffffff, $alpha: 0.2);
        transform: scale(0.8);
      }
    }
  }
}
</style>
