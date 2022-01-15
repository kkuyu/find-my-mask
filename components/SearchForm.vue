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
    <ValidationProvider v-slot="{}" :rules="{ required: true, max: 3000 }" tag="div">
      <label for="keyword">검색어</label>
      <input :value="formValue.keyword" type="text" id="keyword" required="required" @input="formStructure.keyword.onInput" />
      <SearchKeyword />
    </ValidationProvider>
    <button type="submit" :disabled="formData.isLoading">검색</button>
    <slot name="recentlyKeyword" />
  </ValidationObserver>
</template>

<script>
import { ref, computed, useStore } from '@nuxtjs/composition-api';

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

    return {
      observer,
      formValue,
      formStructure,
      keywordRemoveAll,
      keywordClick,
      keywordRemove,
      toggleSaveMode,
      onSubmit,
    };
  },
};
</script>
