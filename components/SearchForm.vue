<template>
  <ValidationObserver ref="observer" v-slot="{}" tag="form" novalidate @submit.prevent="onSubmit">
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div">
      <span>분류</span>
      <template v-for="item in formStructure.category.options">
        <div :key="item.value">
          <input type="radio" v-model="formValue.category" :id="item.value" :value="item.value" required />
          <label :for="item.value">{{ item.text }}</label>
        </div>
      </template>
    </ValidationProvider>
    <ValidationProvider v-slot="{ failedRules, invalid }" :rules="{ required: true, min: 2, max: 3000 }" tag="div">
      <label for="keyword">검색어</label>
      <div ref="keywordInput">
        <input
          :value="formValue.keyword"
          type="text"
          id="keyword"
          required="required"
          autocomplete="off"
          @input="formStructure.keyword.onInput"
          :aria-invalid="invalid"
          aria-describedby="keyword-feedback"
        />
        <button v-if="formValue.keyword.length" @click="keywordReset">리셋</button>
      </div>
      <div v-show="invalid" id="keyword-feedback">
        <span v-if="failedRules.required || failedRules.min">2글자 이상 입력해주세요.</span>
        <span v-else-if="failedRules.max">3000자 이하 입력해주세요</span>
      </div>
      <SearchKeyword v-show="showKeywordList" ref="keywordList" />
    </ValidationProvider>
    <button type="submit" :disabled="formData.isLoading">검색</button>
    <slot name="recentlyKeyword" />
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
            value: 'company',
            text: '업체명',
          },
          {
            value: 'product',
            text: '제품명',
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
        path: '/',
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
          console.log(response);
          if (response) {
            console.log('valid');
            context.emit('validSubmit');
          } else {
            console.log('invalid', observer.value.fields);
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
