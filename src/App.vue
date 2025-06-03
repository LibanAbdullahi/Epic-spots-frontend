<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="pb-16">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script> 