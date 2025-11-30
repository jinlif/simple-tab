<template>
  <HomeView />
</template>

<script>
import HomeView from "./views/HomeView.vue";

export default {
  name: "App",
  components: {
    HomeView,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  height: 100vh;
  font-size: 0.16rem;
}

.el-icon {
  width: 16px !important;
  height: 16px !important;
  line-height: 16px !important;
}
</style>
