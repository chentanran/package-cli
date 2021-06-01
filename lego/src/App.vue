<template>
  <div>
    <Editor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import Home from './components/Home.vue'
import Editor from './components/Editor.vue'

export default defineComponent({
  name: 'App',
  components: {
    // Home
    Editor
  }
});
</script>

<style>
</style>
