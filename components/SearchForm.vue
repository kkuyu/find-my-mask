<template>
  <ValidationObserver ref="observer" v-slot="{}" tag="form" class="form-observer" novalidate @submit.prevent="onSubmit">
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
            <font-awesome-icon :icon="['fas', 'times-circle']" />
            <span class="hidden">리셋</span>
          </button>
        </div>
        <SearchKeyword ref="keywordList" :class="{ show: showKeywordList }"> </SearchKeyword>
        <button type="submit" class="btn-submit" :disabled="formData.isLoading">
          <font-awesome-icon :icon="['fas', 'search']" />
          <span class="hidden">검색</span>
        </button>
      </div>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { ref, computed, nextTick, useStore, onMounted, onUnmounted } from '@nuxtjs/composition-api';

import SearchKeyword from '@/components/SearchKeyword';

export default {
  name: 'SearchForm',
  props: {
    formData: {
      type: Object,
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
    const store = useStore();
    const $route = computed(() => context.root.$route);
    const $router = context.root.$router;

    const observer = ref();
    const keywordInput = ref();
    const keywordList = ref();

    const showKeywordList = ref(false);

    const formValue = computed({
      get() {
        return props.formData;
      },
      set(value) {
        context.emit('input', value);
      },
    });

    const formStructure = ref({
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
        onInput: (event) => {
          formValue.value.keyword = event.target.value;
        },
      },
    });

    const keywordReset = ($event) => {
      formValue.value.keyword = '';
      keywordInput.value.querySelector('input').focus();
    };

    const keywordClick = ($event, keyword) => {
      if ($route.value.query[props.formData.category] === keyword.text) return false;

      $router.push({
        path: '/search',
        query: {
          [props.formData.category]: keyword.text,
        },
      });
    };

    const keywordRemove = ($event, keyword) => {
      store.commit('search/removeKeyword', keyword);
    };

    const keywordRemoveAll = ($event) => {
      store.commit('search/removeRecentlyList');
    };

    const toggleSaveMode = ($event) => {
      store.commit('search/changeSaveMode', !store.state.search.isSaveMode);
    };

    const onSubmit = () => {
      observer.value
        .validate()
        .then((response) => {
          if (response) {
            // console.log('valid');
            context.emit('validSubmit');
          } else {
            // console.log('invalid', observer.value.fields);
            const keys = Object.keys(observer.value.fields);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              const value = observer.value.fields[key];
              if (value.valid === false) {
                observer.value.refs[key].$el.querySelector('input').focus();
                break;
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const onInputFocusIn = (event) => {
      showKeywordList.value = true;
    };

    const onInputFocusOut = (event) => {
      if (!keywordList.value.$el.contains(event.relatedTarget)) {
        showKeywordList.value = false;
      }
    };

    const onListFocusIn = (event) => {
      //
    };

    const onListFocusOut = (event) => {
      if (event.relatedTarget === null) {
        nextTick(() => {
          keywordInput.value.querySelector('input').focus();
        });
        return;
      }
      if (!keywordList.value.$el.contains(event.relatedTarget) && !keywordInput.value.contains(event.relatedTarget)) {
        showKeywordList.value = false;
      }
    };

    onMounted(() => {
      if (keywordInput.value) {
        keywordInput.value.addEventListener('focusin', onInputFocusIn);
        keywordInput.value.addEventListener('focusout', onInputFocusOut);
      }
      if (keywordList.value) {
        keywordList.value.$el.addEventListener('focusin', onListFocusIn);
        keywordList.value.$el.addEventListener('focusout', onListFocusOut);
      }
    });

    onUnmounted(() => {
      if (keywordInput.value) {
        keywordInput.value.removeEventListener('focusin', onInputFocusIn);
        keywordInput.value.removeEventListener('focusout', onInputFocusOut);
      }
      if (keywordList.value) {
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
      keywordRemoveAll,
      keywordClick,
      keywordRemove,
      toggleSaveMode,
      onSubmit,
    };
  },
};
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
