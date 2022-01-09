<template>
  <div>
    <strong>index</strong>
    <button @click="getMasks">조회!</button>
  </div>
</template>

<script>
import convert from 'xml-js';

export default {
  name: 'Index',
  setup(props, context) {
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
      getMasks,
    };
  },
};
</script>
