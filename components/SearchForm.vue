<template>
  <ValidationObserver ref="observer" v-slot="{}" tag="form" novalidate @submit.prevent="onSubmit">
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div">
      <select name="" id="" :value="formValue.category" @change="formStructure.category.onChange" required="required">
        <template v-for="item in formStructure.category.options">
          <option :value="item.value" :key="item.value">{{ item.text }}</option>
        </template>
      </select>
    </ValidationProvider>
    <ValidationProvider v-if="formValue.category === 'company'" v-slot="{}" :rules="{ required: true, max: 3000 }" tag="div">
      <label for="company">업체명</label>
      <input :value="formValue.company" type="text" id="company" required="required" @input="formStructure.company.onInput" />
    </ValidationProvider>
    <ValidationProvider v-if="formValue.category === 'product'" v-slot="{}" :rules="{ required: true, max: 200 }" tag="div">
      <label for="product">제품명</label>
      <input :value="formValue.product" type="text" id="product" required="required" @input="formStructure.product.onInput" />
    </ValidationProvider>
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div">
      <span>분류</span>
      <template v-for="item in formStructure.drugCode.options">
        <div :key="item.value">
          <input type="radio" v-model="formValue.drugCode" :id="item.value" :value="item.value" required />
          <label :for="item.value">{{ item.text }}</label>
        </div>
      </template>
    </ValidationProvider>
    <button type="submit">검색</button>
  </ValidationObserver>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api';
import convert from 'xml-js';

export default {
  name: 'SearchForm',
  props: {
    formData: {
      type: Object,
      required: true,
      default: () => ({
        category: '',
        drugCode: '',
        company: '',
        product: '',
      }),
    },
  },
  setup(props, context) {
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
        onChange: (event) => {
          formValue.value.category = event.target.value;
          if (formValue.value.category === 'company') {
            formValue.value.product = '';
          }
          if (formValue.value.category === 'product') {
            formValue.value.company = '';
          }
        },
      },
      drugCode: {
        options: [
          {
            required: true,
            value: '32100',
            text: '수술용(덴탈)',
          },
          {
            required: false,
            value: '32200',
            text: '보건용',
          },
          {
            required: false,
            value: '32300',
            text: '비말차단용',
          },
        ],
      },
      company: {
        onInput: (event) => {
          formValue.value.company = event.target.value;
        },
      },
      product: {
        onInput: (event) => {
          formValue.value.product = event.target.value;
        },
      },
    });

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
      onSubmit,
    };
  },
};
</script>
