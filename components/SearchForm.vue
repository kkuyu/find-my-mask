<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="onSubmit">
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div">
      <select name="" id="" :value="formData.category.value" @change="($event) => (formData.category.value = $event.target.value)">
        <template v-for="item in formData.category.options">
          <option :value="item.value" :key="item.value">{{ item.text }}</option>
        </template>
      </select>
    </ValidationProvider>
    <ValidationProvider v-if="formData.category.value === 'company'" v-slot="{}" :rules="{ required: true, max: 3000 }" tag="div">
      <label for="company">업체명</label>
      <input v-model="formData.company.value" type="text" id="company" />
    </ValidationProvider>
    <ValidationProvider v-if="formData.category.value === 'product'" v-slot="{}" :rules="{ required: true, max: 200 }" tag="div">
      <label for="product">제품명</label>
      <input v-model="formData.product.value" type="text" id="product" />
    </ValidationProvider>
    <ValidationProvider v-slot="{}" :rules="{ required: true }" tag="div">
      <span>분류</span>
      <template v-for="item in formData.drugCode.options">
        <div :key="item.value">
          <input type="radio" v-model="formData.drugCode.value" :id="item.value" :value="item.value" />
          <label :for="item.value">{{ item.text }}</label>
        </div>
      </template>
    </ValidationProvider>
    <button type="submit" :disabled="invalid">검색</button>
  </ValidationObserver>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import convert from 'xml-js';

export default {
  name: 'SearchForm',
  setup(props, context) {
    const observer = ref();
    const formData = ref({
      category: {
        value: 'company',
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
      drugCode: {
        value: '32100',
        options: [
          {
            value: '32100',
            text: '수술용(덴탈)',
          },
          {
            value: '32200',
            text: '보건용',
          },
          {
            value: '32300',
            text: '비말차단용',
          },
        ],
      },
      company: {
        value: '',
      },
      product: {
        value: '',
      },
    });

    const getResult = (data) => {
      let result = {};
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];
        result[key] = value.value;
      }
      return result;
    };

    const onSubmit = () => {
      observer.value
        .validate()
        .then((response) => {
          console.log(response);
          if (response) {
            console.log('valid');
            context.emit('validSubmit', getResult(formData.value));
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
      formData,
      onSubmit,
    };
  },
};
</script>
