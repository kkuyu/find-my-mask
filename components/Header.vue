<template>
  <div>
    <strong>Header</strong>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">index</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/company/아미">/company/:id</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/product/코엔보황사마스크">/product/:id</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header',
};
</script>
