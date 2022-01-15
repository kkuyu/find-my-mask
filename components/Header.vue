<template>
  <div>
    <nav>
      <NuxtLink :to="{ path: '/', query: {} }"><font-awesome-icon :icon="['fab', 'slack-hash']" />Find My Mask</NuxtLink>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header',
};
</script>
