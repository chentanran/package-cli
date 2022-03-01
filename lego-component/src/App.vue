<template>
  <div id="nav">
    <hello-world></hello-world>
  </div>
</template>

<script lang="ts">
  import { defineComponent, getCurrentInstance, inject, onMounted } from "vue";
  export default defineComponent({
    setup() {
      console.log(inject('test'))
      onMounted(() => {
        getCurrentInstance()?.appContext.config.globalProperties.$echo()
      })
    }
  })
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
