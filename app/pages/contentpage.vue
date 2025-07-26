<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/contentpage').first())

useSeoMeta({
   title: home.value?.title,
   description: home.value?.description
})
</script>

<template>
   <ContentRenderer v-if="home" :value="home" />
   <div v-else>Home not found(( Try again or contact administrator</div>
</template>
