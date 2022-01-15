<template>
  <div>
    <h1>
      <NuxtLink :to="{ path: '/', query: {} }"><font-awesome-icon :icon="['fab', 'slack-hash']" />Find My Mask</NuxtLink>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Header',
};
</script>
