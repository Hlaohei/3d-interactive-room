<template>
  <div
    ref="fgSelectRef"
    class="fg-select"
    v-ClickSelect
    :class="{ 'fg-select_active': showOption }"
  >
    <input
      type="text"
      :value="selectValue"
      :disabled="disabled"
      :placeholder="placeholder"
      readonly
    />
    <i class="fg-select-icon iconfont icon-arow_down"></i>

    <Transition name="select-fade">
      <div
        class="fg-select-option"
        v-if="showOption && options && options.length > 0"
        :style="selectOptionStyle"
      >
        <ul>
          <li
            v-for="(item, index) in options"
            :key="index"
            class="item-li"
            :class="{
              'item-li_active': activeIndex == index,
              'item-li_disabled': item.disabled,
            }"
            @click="change(item, index)"
          >
            {{ item[labelFiled] }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => [],
  },
  labelFiled: {
    type: String,
    default: "label",
  },
  valueFiled: {
    type: String,
    default: "value",
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue", "change", "rechange"]);

let fgSelectRef = ref(null);
let selectValue = ref(props.modelValue);
let activeIndex = ref(-1);
let showOption = ref(false);

const vClickSelect = {
  beforeMount(el) {
    const handler = (e) => {
      if (!props.disabled) {
        if (
          el.contains(e.target) &&
          e.target.className.indexOf("item-li") == -1
        ) {
          showOption.value = true;
        } else {
          if (e.target.className.indexOf("item-li_disabled") == -1) {
            showOption.value = false;
          }
        }
      }
    };
    document.addEventListener("click", handler);
  },
};

const selectOptionStyle = computed(() => {
  if (fgSelectRef.value) {
    const dom = fgSelectRef.value.getBoundingClientRect();

    return {
      top: `${dom.height + 8}px`,
    };
  }
});

const change = (item, index) => {
  if (!item.disabled && selectValue.value != item[props.labelFiled]) {
    // console.log(item, index);
    activeIndex.value = index;
    selectValue.value = item.value;
    emit("update:modelValue", item[props.valueFiled]);
    emit("change", item);
  }
};

const getCurrentItem = () => {
  if (props.options !== null && props.options !== undefined) {
    props.options.forEach((item, index) => {
      if (item[props.valueFiled] == props.modelValue) {
        selectValue.value = item[props.labelFiled];
        activeIndex.value = index;
        emit("rechange", item);
      }
    });
  }
};
getCurrentItem();

watch(
  () => props.modelValue,
  (val) => {
    // console.log("props.modelValue 变化", val);
    getCurrentItem();
  }
);
</script>

<style lang="scss" scoped>
.fg-select {
  @apply inline-block min-h-[2.5rem] min-w-[150px] relative box-border;

  input {
    @apply rounded-2xl w-full h-full outline-none truncate bg-transparent
      pb-[1px] sm:pb-[2px] px-3 sm:px-4 pr-8 sm:pr-8 text-white text-opacity-90 
      cursor-pointer box-border
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
  .fg-select-icon {
    @apply absolute right-3 top-1/2 -translate-y-1/2 text-base
      text-white opacity-10 pointer-events-none duration-200;
  }
  &.fg-select_active {
    .fg-select-icon {
      @apply rotate-180;
    }
  }

  .fg-select-option {
    @include glass-bg-dark(1);
    @apply rounded-2xl overflow-hidden w-full h-auto py-2 absolute z-40;
    // top: 0;

    li {
      @apply w-full py-2 px-3 sm:px-4 
        text-white text-opacity-60 text-sm sm:text-base
        list-none truncate cursor-pointer;

      &:hover {
        @apply bg-white bg-opacity-10 text-white text-opacity-90;
      }

      &.item-li_disabled {
        @apply bg-white bg-opacity-5 text-white text-opacity-10 cursor-no-drop;
      }
      &.item-li_active {
        @apply bg-white bg-opacity-10 text-white text-opacity-90;
      }
    }
  }
}

.select-fade-enter-active {
  transform-origin: top center;
  animation: selectFade 0.3s;
}
.select-fade-leave-active {
  transform-origin: top center;
  animation: selectFade 0.2s reverse;
}
@keyframes selectFade {
  from {
    opacity: 0;
    transform: scaleY(0.2);
  }
  to {
    opacity: 1;
  }
}
</style>
