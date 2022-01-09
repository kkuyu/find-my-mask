<template>
  <div>
    <strong>Header</strong>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">index</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/32200">/drugCode</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/32200/아미">/drugCode/company</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/32200/아미/코엔보황사마스크">/drugCode/company/product</NuxtLink>
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
