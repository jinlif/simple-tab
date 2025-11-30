<template>
  <div style="height: 100%">
    <video
      class="video-bg"
      src="../assets//dynamic//background.mp4"
      autoplay
      muted
      loop
      playsinline
      tabindex="-1"
    ></video>
    <div class="container">
      <SearchInput />
      <div class="component-wrapper">
        <AndroidDesktop>
          <template #addApp>
            <AddAPP />
          </template>
          <template #translate><BaiduTranslate /> </template>
        </AndroidDesktop>
      </div>
      <i class="fa-solid fa-gear settings" @click="drawer = true"></i>
    </div>
    <el-drawer v-model="drawer" :with-header="false" :size="420">
      <Settings />
    </el-drawer>
  </div>
</template>
  
<script setup>
import SearchInput from "./components/SearchInput.vue";
import BaiduTranslate from "./components/BaiduTranslate.vue";
import AndroidDesktop from "./components/AndroidDesktop.vue";
import AddAPP from "./components/AddAPP.vue";
import Settings from "./components/Settings.vue";
import { ref } from "vue";

const drawer = ref(false);
</script>

<style scoped>
.video-bg {
  position: fixed; /* 固定定位，不随滚动条移动 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 置于内容层下方 */
  object-fit: cover; /* 视频铺满容器，保持比例 */
  transition: transform 0.5s ease-in-out;
}
.container {
  position: relative;
  width: 80%;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem 0;
  margin: auto;
}

.component-wrapper {
  height: calc(100% - 1.2rem);
  overflow-y: auto;
}
/* component-wrapper不显示滚动条 */
.component-wrapper::-webkit-scrollbar {
  display: none;
}
.settings {
  position: fixed;
  right: 0.2rem;
  top: 0.2rem;
  cursor: pointer;
  font-size: 0.18rem;
  transition: transform 0.5s linear;
}

.settings:hover {
  color: rgb(19, 124, 209);
  transform: rotate(180deg);
  transform-origin: center;
}
</style>
      
<style>
.hover-event {
  transition: transform 0.2s linear;
}

.hover-event:hover {
  transition: transform 0.3s ease-in-out;
  transform: translateY(-3px);
}
</style>