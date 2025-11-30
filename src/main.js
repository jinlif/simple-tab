import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/css/main.css";

// 在页面加载和窗口缩放时执行
function setRem() {
  const designWidth = 1920;
  const screenWidth =
    document.documentElement.clientWidth || document.body.clientWidth;

  // 计算根字体大小（屏幕宽度 ÷ 设计稿宽度 × 基准值）
  const rem = (screenWidth / designWidth) * 100;

  // 设置根字体
  document.documentElement.style.fontSize = rem + "px";
}

// 初始化
setRem();

// 窗口缩放时重新计算
window.addEventListener("resize", setRem);

createApp(App).use(store).use(ElementPlus).mount("#app");
