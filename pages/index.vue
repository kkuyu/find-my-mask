<template>
  <div>
    <strong>index</strong>
    <button @click="getMasks">조회!</button>

    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="onSubmit">
      <ValidationProvider v-slot="{ valid, failedRules }" :rules="{ required: true }">
        <input v-model="inputA" type="text" />
        <div>valid {{ valid }}</div>
        <div>failedRules {{ failedRules }}</div>
      </ValidationProvider>
      <ValidationProvider v-slot="{ valid, failedRules }" :rules="{ required: true, max: 7 }">
        <input v-model="inputB" type="text" />
        <div>valid {{ valid }}</div>
        <div>failedRules {{ failedRules }}</div>
      </ValidationProvider>
      <button type="submit">{{ invalid }}</button>
    </ValidationObserver>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import convert from 'xml-js';

export default {
  name: 'Index',
  setup(props, context) {
    const observer = ref();
    const inputA = ref();
    const inputB = ref();

    const onSubmit = () => {
      observer.value
        .validate()
        .then((response) => {
          console.log(response);
          if (response) {
            console.log('valid');
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

    const getMasks = async () => {
      const params = {
        item_name: encodeURIComponent('마스크'),
        pageNo: 1,
        numOfRows: 10,
      };
      const response = context.root.$api.mask.getMasks(params);

      response
        .then((response) => {
          const data = convert.xml2json(response.data, {
            compact: true,
            spaces: 4,
          });
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      observer,
      inputA,
      inputB,
      onSubmit,
      getMasks,
    };
  },
};
</script>
