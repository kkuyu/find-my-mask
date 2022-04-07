<template>
  <ValidationObserver ref="observer" v-slot="{}" tag="form" id="form-search" class="form-observer" novalidate @submit.prevent="onSubmit">
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div" class="form-provider">
      <span class="hidden">분류</span>
      <div class="radio-tab">
        <div class="radio-tab-inner">
          <template v-for="item in formStructure.category.options">
            <input :key="`input-${item.value}`" type="radio" v-model="formValue.category" :id="item.value" :value="item.value" required />
            <label :key="`label-${item.value}`" :for="item.value">{{ item.text }}</label>
          </template>
          <span class="hint" />
        </div>
      </div>
    </ValidationProvider>
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div" class="form-provider">
      <label for="keyword" class="hidden">검색어</label>
      <div class="input-form">
        <div ref="keywordInput">
          <input :value="formValue.keyword" type="text" id="keyword" required="required" maxlength="3000" autocomplete="off" @input="formStructure.keyword.onInput" />
          <button v-if="formValue.keyword.length" type="button" class="btn-reset" @click="keywordReset">
            <font-awesome-icon :icon="['fas', 'times-circle']" aria-label="리셋" />
          </button>
        </div>
        <SearchKeyword ref="keywordList" :class="{ show: showKeywordList }"> </SearchKeyword>
        <button type="submit" class="btn-submit" :disabled="isLoading">
          <font-awesome-icon :icon="['fas', 'search']" aria-label="검색" />
        </button>
      </div>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, defineComponent, PropType, Ref, WritableComputedRef } from '@nuxtjs/composition-api';
import { ValidationObserver } from 'vee-validate';

import SearchKeyword from '@/components/SearchKeyword.vue';
import { SearchFormData } from '@/types/view';

interface FormStructure {
  category: {
    options: {
      value: string;
      text: string;
    }[];
  };
  keyword: {
    onInput: (event: KeyboardEvent) => void;
  };
}

export default defineComponent({
  name: 'SearchForm',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    },
    formData: {
      type: Object as PropType<SearchFormData>,
      required: true,
      default: () => ({
        category: '',
        keyword: '',
      }),
    },
  },
  components: {
    SearchKeyword,
  },
  setup(props, context) {
    const observer: Ref<InstanceType<typeof ValidationObserver> | null> = ref(null);
    const keywordInput: Ref<HTMLDivElement | null> = ref(null);
    const keywordList: Ref<InstanceType<typeof SearchKeyword> | null> = ref(null);

    const showKeywordList: Ref<boolean> = ref(false);

    const formValue: WritableComputedRef<SearchFormData> = computed({
      get() {
        return props.formData;
      },
      set(value) {
        context.emit('input', value);
      },
    });

    const formStructure: Ref<FormStructure> = ref({
      category: {
        options: [
          {
            value: 'product',
            text: '제품명',
          },
          {
            value: 'company',
            text: '업체명',
          },
        ],
      },
      keyword: {
        onInput: (event: KeyboardEvent) => {
          if (!(event.target instanceof HTMLInputElement)) return;
          formValue.value.keyword = event.target.value;
        },
      },
    });

    const keywordReset = ($event: MouseEvent): void => {
      if (!(keywordInput.value instanceof HTMLDivElement)) return;

      formValue.value.keyword = '';

      const inputEl = keywordInput.value?.querySelector('input');
      inputEl && inputEl.focus();
    };

    const onSubmit = async ($event: SubmitEvent): Promise<void> => {
      if (!observer.value) return;

      const response: boolean = await observer.value.validate();

      try {
        if (response) {
          context.emit('validSubmit');
          return;
        }
        const keys = Object.keys(observer.value.fields);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = observer.value.fields[key];
          if (value.valid === false) {
            const inputEl = observer.value.refs[key].$el?.querySelector('input');
            inputEl && inputEl.focus();
            break;
          }
        }
      } catch (error: unknown) {
        console.log(error);
      }
    };

    const onInputFocusIn = (event: FocusEvent): void => {
      showKeywordList.value = true;
    };

    const onInputFocusOut = (event: FocusEvent): void => {
      if (!(keywordList.value?.$el instanceof HTMLDivElement)) return;

      if (!event.relatedTarget) {
        showKeywordList.value = false;
      } else if (!(event.relatedTarget instanceof HTMLElement)) {
        showKeywordList.value = false;
      } else if (!keywordList.value.$el.contains(event.relatedTarget)) {
        showKeywordList.value = false;
      }
    };

    const onListFocusIn = (event: FocusEvent): void => {
      //
    };

    const onListFocusOut = (event: FocusEvent): void => {
      if (!event.relatedTarget) {
        nextTick(() => {
          const inputEl = keywordInput.value?.querySelector('input');
          inputEl && inputEl.focus();
        });

        showKeywordList.value = false;
        return;
      }

      if (!(event.relatedTarget instanceof HTMLElement)) {
        showKeywordList.value = false;
      } else if (!keywordList.value?.$el.contains(event.relatedTarget) && !keywordInput.value?.contains(event.relatedTarget)) {
        showKeywordList.value = false;
      }
    };

    onMounted(() => {
      if (keywordInput.value && keywordInput.value instanceof HTMLDivElement) {
        keywordInput.value.addEventListener('focusin', onInputFocusIn);
        keywordInput.value.addEventListener('focusout', onInputFocusOut);
      }
      if (keywordList.value && keywordList.value.$el instanceof HTMLDivElement) {
        keywordList.value.$el.addEventListener('focusin', onListFocusIn);
        keywordList.value.$el.addEventListener('focusout', onListFocusOut);
      }
    });

    onUnmounted(() => {
      if (keywordInput.value && keywordInput.value instanceof HTMLDivElement) {
        keywordInput.value.removeEventListener('focusin', onInputFocusIn);
        keywordInput.value.removeEventListener('focusout', onInputFocusOut);
      }
      if (keywordList.value && keywordList.value.$el instanceof HTMLDivElement) {
        keywordList.value.$el.removeEventListener('focusin', onListFocusIn);
        keywordList.value.$el.removeEventListener('focusout', onListFocusOut);
      }
    });

    return {
      observer,
      keywordInput,
      keywordList,
      showKeywordList,
      formValue,
      formStructure,
      keywordReset,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-observer {
  background-color: var(--color-white);
  border-radius: 0.5rem;
}
.form-provider {
  position: relative;
  & + & {
    border-top: 0.125rem solid var(--color-bg);
  }
}

.radio-tab {
  display: block;
  padding: 0.5rem 0;
  text-align: center;
  &-inner {
    position: relative;
    display: inline-flex;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -10rem;
    width: 10rem;
    height: 2.25rem;
    font-size: 1rem;
    color: var(--color-black);
    transition: font-weight 0.15s ease-in;
    cursor: pointer;
    z-index: 2;
  }
  input[type='radio'] {
    width: 10rem;
    height: 2.25rem;
    &:checked + label {
      font-weight: 700;
    }
    &[id='product']:checked ~ .hint {
      transform: translateX(-100%);
    }
    &[id='company']:checked ~ .hint {
      transform: translateX(0%);
    }
  }
  .hint {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 50%;
    background-color: var(--color-secondary);
    border-radius: 0.5rem;
    transform: translateX(-100%);
    transition: transform 0.25s ease-out;
    z-index: 1;
  }
}

.input-form {
  input {
    width: 100%;
    padding: 1.25rem 3.75rem;
    font-size: 1.25rem;
    border: none;
    box-sizing: border-box;
  }
  .btn-submit {
    position: absolute;
    top: 0.625rem;
    left: 0.75rem;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-secondary);
  }
  .btn-reset {
    position: absolute;
    top: 0.625rem;
    right: 0.75rem;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-secondary);
  }
}
</style>
