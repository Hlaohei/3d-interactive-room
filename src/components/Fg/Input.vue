<template>
  <div
    class="fg-input"
    :class="styleClass"
    @mouseenter="isEnter = true"
    @mouseleave="isEnter = false"
  >
    <input
      ref="inputRef"
      :type="inputType"
      class="fg-input__inner"
      :class="{
        '!pr-9':
          (clearable && isClearable && isEnter) ||
          isShowEye ||
          isShowSuffixIcon,
        '!pl-9': isShowPrefixIcon,
      }"
      :value="modelValue"
      :disabled="disabled"
      v-bind="attrs"
      @input="changeInputValue"
      @change="change"
    />

    <div
      v-if="clearable && isClearable"
      v-show="isEnter"
      class="fg-input__suffix cursor-pointer"
      @click="clearValue"
    >
      <i class="iconfont icon-error2 text-lg"></i>
    </div>

    <div
      v-if="isShowEye"
      class="fg-input__suffix cursor-pointer"
      @click="changePasswordType"
    >
      <i v-if="!isCloseEyeIcon" class="iconfont icon-eye-close text-lg"></i>
      <i v-else class="iconfont icon-eye text-lg"></i>
    </div>

    <div v-if="isShowPrefixIcon" class="fg-input__prefix">
      <i class="iconfont text-lg text-white" :class="prefixIcon"></i>
    </div>
    <div v-if="isShowSuffixIcon" class="fg-input__suffix cursor-default">
      <i class="iconfont text-lg text-white" :class="suffixIcon"></i>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String | Number,
  disabled: Boolean,
  clearable: Boolean,
  showPassword: Boolean,
  prefixIcon: String,
  suffixIcon: String,
});
const emit = defineEmits(["update:modelValue", "change"]);

const inputRef = ref();
const attrs = useAttrs();

let isEnter = ref(false);
let isClearable = ref(false);

const styleClass = computed(() => {
  return {
    "is-disabled": props.disabled,
  };
});

if (props.modelValue) isClearable.value = true;
const changeInputValue = (event) => {
  // 有内容才显示清除图标
  if (event.target.value) {
    isClearable.value = true;
  } else {
    isClearable.value = false;
  }

  emit("update:modelValue", event.target.value);
};

// 清除内容
const clearValue = () => {
  isClearable.value = false;
  inputRef.value.value = "";
  emit("update:modelValue", "");
  emit("change", "");
};

// 密码眼睛图标，默认闭上
let inputType = ref("text");
let isCloseEyeIcon = ref(false);

if (props.showPassword) {
  console.log(inputRef);
  inputType.value = "password";
}

const isShowEye = computed(() => {
  return props.showPassword && props.modelValue && !props.clearable;
});

const changePasswordType = () => {
  if (inputType.value == "password") {
    isCloseEyeIcon.value = true;
    inputType.value = attrs.type || "text";
  } else {
    inputType.value = "password";
    isCloseEyeIcon.value = false;
  }
};

// 前后 icon
const isShowPrefixIcon = computed(() => {
  return props.prefixIcon;
});
const isShowSuffixIcon = computed(() => {
  return props.suffixIcon && !props.clearable && !props.showPassword;
});

// 对外改变事件，当输入框失去焦点和按回车时触发并返回
const change = (event) => {
  emit("change", event.target.value);
};
</script>

<style lang="scss" scoped>
.fg-input {
  @apply inline-block min-h-[2.5rem] min-w-[150px] h-full w-full 
    relative box-border;

  .fg-input__inner {
    @apply w-full h-full outline-none truncate bg-transparent rounded-2xl
      pb-[1px] sm:pb-[2px] px-3 sm:px-4 text-white text-opacity-90 
      text-sm sm:text-base duration-200;
    @include glass-bg-dark(1);

    &::placeholder {
      @apply text-white text-opacity-40;
    }
    &:hover {
      @apply border-opacity-30;
    }
    &:focus {
      @apply border-opacity-50;
    }
  }

  &.is-disabled {
    .fg-input__inner {
      @apply bg-white bg-opacity-5 text-white text-opacity-10 cursor-not-allowed;

      &::placeholder {
        @apply text-white text-opacity-5;
      }
    }
  }

  .fg-input__prefix,
  .fg-input__suffix {
    @apply h-full absolute top-0 flex
      items-center justify-center text-white opacity-50 text-lg duration-200;
  }
  .fg-input__prefix {
    @apply left-3;
  }
  .fg-input__suffix {
    @apply right-3;
  }
}
</style>
