<template>
  <el-dialog
    v-model="dialogVisible"
    title="Shipping address"
    width="7.5rem"
    :align-center="true"
  >
    <div class="liquid-container">
      <div class="liquid-background"></div>
      <div class="glass-panel">
        <el-form>
          <el-form-item label="网址">
            <el-input
              v-model="address"
              placeholder="请输入网址"
              @blur="handleAddressBlur"
            ></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="localName" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <div class="avatar-container">
              <template v-if="autoAvatar.length">
                <div
                  v-for="(item, index) in autoAvatar"
                  :key="index"
                  class="avatar-item avatar-img-item"
                  :class="{
                    selected: selectedAvatar === 'auto_' + index,
                  }"
                  @click="selectAvatar('auto_' + index)"
                >
                  <img :src="item" class="avatar-image" alt="头像" />
                </div>
              </template>

              <div
                class="avatar-item text-avatar"
                :class="{
                  selected: selectedAvatar === 'text-icon',
                }"
                :style="{ backgroundColor: localColor }"
                @click="selectAvatar('text-icon')"
              >
                <span>{{ localName.charAt(0) || "A" }}</span>
              </div>
              <div
                class="avatar-item custom-avatar"
                :class="{
                  selected:
                    selectedAvatar === 'custom' && customAvatar !== null,
                  hasAvatar: customAvatar !== null,
                }"
                @click="selectAvatar('custom')"
              >
                <img
                  v-if="customAvatar !== null"
                  :src="customAvatar"
                  class="avatar-image"
                  alt="头像"
                />
                <div v-else class="fake-input" @click="uploadAvatar">
                  <i class="fa-solid fa-plus"></i>
                  <span> 上传</span>
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*,.svg,image/svg+xml"
                    multiple
                    style="display: none"
                    @change="handleFileUpload"
                  />
                </div>
                <!-- 删除图标 -->
                <div class="delete-icon">
                  <i
                    class="fa-solid fa-trash-can"
                    @click.stop.prevent="handleDelete"
                  ></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="selectedAvatar === 'text-icon'" label="图标颜色">
            <el-color-picker
              v-model="localColor"
              :show-alpha="true"
              :predefine="predefineColors"
            />
          </el-form-item>
        </el-form>
        <div class="close-icon" @click="dialogVisible = false">
          <i class="fa-solid fa-xmark"></i>
        </div>
        <div class="save-btn">
          <button
            class="custom-btn gradient-effect"
            @click="createRipple($event, 'gradient')"
            @mouseover="createParticles($event, 'gradient')"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { getSiteInfo } from "@/utils/getSiteInfo.js";

const store = useStore();

const address = ref("");
const localName = ref("");
const localColor = ref("#90ee90");

const autoAvatar = ref([]);

const selectedAvatar = ref(null);
const customAvatar = ref(null);
const fileInput = ref(null);

const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);

const selectAvatar = (id) => {
  if (id === "custom" && customAvatar.value === null) {
    return;
  }
  selectedAvatar.value = id;
};

const props = defineProps({
  updateTime: {
    type: Number,
    default: 0,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedApp: {
    type: Object,
    default: null,
  },
});

const uploadAvatar = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  processFiles(files);
  event.target.value = ""; // 重置input
};

const processFiles = (files) => {
  if (!files.length) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.match("image.*")) {
      ElMessage.error("只能上传图片文件");
      continue;
    }

    compressImage(file);
  }
};

const compressImage = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 设置画布大小为64x64
      canvas.width = 64;
      canvas.height = 64;

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, 64, 64);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      customAvatar.value = compressedDataUrl;
    };
  };

  reader.readAsDataURL(file);
};

const handleDelete = () => {
  customAvatar.value = null;
};

const dialogVisible = ref(false);

function createRipple(event, type) {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter / 100}rem`;
  circle.style.left = `${
    (event.clientX - button.getBoundingClientRect().left - radius) / 100
  }rem`;
  circle.style.top = `${
    (event.clientY - button.getBoundingClientRect().top - radius) / 100
  }rem`;
  circle.classList.add("ripple");

  // 根据按钮类型设置涟漪颜色
  if (type === "neon") {
    circle.style.background = "rgba(100, 200, 255, 0.7)";
  } else if (type === "gradient") {
    circle.style.background = "rgba(255, 255, 255, 0.7)";
  } else if (type === "3d") {
    circle.style.background = "rgba(255, 255, 255, 0.7)";
  } else if (type === "glass") {
    circle.style.background = "rgba(255, 255, 255, 0.5)";
  } else {
    circle.style.background = "rgba(255, 255, 255, 0.6)";
  }

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  // 创建粒子效果
  createParticles(event, type);
  handleSave();
}

const handleAddressBlur = async () => {
  autoAvatar.value = [];
  let curAddress = address.value;
  if (curAddress === "") {
    return;
  }
  if (!isValidUrl(curAddress)) {
    ElMessage.error("请输入合法的网址");
    return;
  }
  try {
    if (!window.chrome) {
      return;
    }
    window.chrome.runtime.sendMessage(
      { action: "fetchSiteInfo", url: curAddress },
      async (response) => {
        console.log(response);
        if (response.html) {
          getSiteInfo(response)
            .then(({ title, icon }) => {
              autoAvatar.value = icon.splice(0, Math.min(icon.length, 3));
              localName.value = title;
            })
            .catch((e) => {
              console.error(e);
            });
        }
      }
    );
  } catch (e) {
    console.error("获取标签信息失败", e);
  }
};

const handleSave = () => {
  if (localName.value === "") {
    ElMessage.error("请输入标签名");
    return;
  }
  if (address.value === "") {
    ElMessage.error("请输入标签地址");
    return;
  }
  if (!isValidUrl(address.value)) {
    ElMessage.error("请输入合法的网址");
    return;
  }
  let img = null;
  if (selectedAvatar.value === null) {
    img = autoAvatar.value[0] || customAvatar.value;
  } else {
    if (selectedAvatar.value === "custom") {
      img = customAvatar.value;
    } else if (selectedAvatar.value.startsWith("auto_")) {
      img = autoAvatar.value[selectedAvatar.value.split("_")[1]];
    }
  }
  let host = address.value;
  if (!host.startsWith("http")) {
    host = "http://" + host;
  }
  if (props.isEdit) {
    store.commit("EDIT_APP", {
      ...props.selectedApp,
      name: localName.value,
      bg: localColor.value,
      address: host,
      img,
    });
  } else {
    store.commit("ADD_APP", {
      id: Date.now().toString(32),
      name: localName.value,
      bg: localColor.value,
      address: host,
      size: "1x1",
      img,
    });
  }
  dialogVisible.value = false;
  localName.value = "";
  address.value = "";
  localColor.value = "#4b6cb7";
  selectedAvatar.value = null;
  autoAvatar.value = [];
  customAvatar.value = null;
};

const isValidUrl = (input) => {
  let s = input.trim();
  // 如果用户只是粘贴域名或没有 scheme，加上 https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    s = "https://" + s;
  }
  // 最小保证：有效 URL
  try {
    const u = new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

function createParticles(event, type) {
  const button = event.currentTarget;
  const particlesCount = 15;
  const colors = {
    neon: ["#64c8ff", "#5f9fff", "#a0f0ff"],
    gradient: ["#ff7e5f", "#feb47b", "#86a8e7", "#7f7fd5"],
    "3d": ["#ff416c", "#ff4b2b"],
    glass: ["rgba(255,255,255,0.8)", "rgba(200,200,255,0.6)"],
    custom: ["#64c8ff", "#ff7e5f", "#86a8e7"],
  }[type] || ["#64c8ff", "#ff7e5f", "#86a8e7"];

  for (let i = 0; i < particlesCount; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");

    // 随机大小
    const size = Math.random() * 5 + 3;
    particle.style.width = `${size / 100}rem`;
    particle.style.height = `${size / 100}rem`;

    // 随机颜色
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;

    // 随机位置
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 随机方向
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty("--tx", `${tx / 100}rem`);
    particle.style.setProperty("--ty", `${ty / 100}rem`);

    particle.style.left = `${x / 100}rem`;
    particle.style.top = `${y / 100}rem`;

    button.appendChild(particle);

    // 动画结束后移除元素
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

const handleColose = () => {
  if (props.isEdit) {
    dialogVisible.value = false;
    localName.value = "";
    address.value = "";
    localColor.value = "#4b6cb7";
    selectedAvatar.value = null;
    autoAvatar.value = [];
    customAvatar.value = null;
  }
};

watch(
  () => dialogVisible.value,
  (val) => {
    if (!val) {
      handleColose();
    }
  }
);

watch(
  () => props.updateTime,
  (val) => {
    if (val) {
      dialogVisible.value = true;
      if (props.isEdit) {
        const selectedApp = props.selectedApp;
        address.value = selectedApp.address;
        localColor.value = selectedApp.bg;
        localName.value = selectedApp.name;
        customAvatar.value = null;
        autoAvatar.value = [];
        if (selectedApp.img) {
          if (selectedApp.img.startsWith("http")) {
            autoAvatar.value = [selectedApp.img];
            selectedAvatar.value = "auto_0";
          } else {
            customAvatar.value = selectedApp.img;
            selectedAvatar.value = "custom";
          }
        } else {
          selectedAvatar.value = "text-icon";
        }
      }
    }
  }
);
</script>

<style>
.el-dialog {
  padding: 0 !important;
}

.el-dialog__header {
  display: none;
}

/* 液态玻璃容器 */
.el-dialog .liquid-container {
  position: relative;
  width: 100%;
  height: 4.5rem;
  overflow: hidden;
  border-radius: 0.08rem;
}

/* 液态玻璃背景层 */
.el-dialog .liquid-background {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    rgba(109, 3, 109, 0.8),
    rgba(7, 58, 58, 0.8),
    rgba(90, 33, 10, 0.8),
    rgba(3, 70, 3, 0.8)
  );
  background-size: 200% 200%;
  animation: gradientMove 15s ease infinite;
  filter: blur(80px);
  transform: rotate(30deg);
  opacity: 0.8;
}

/* 玻璃面板 */
.el-dialog .glass-panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(60px);
  -webkit-backdrop-filter: blur(60px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0.08rem 0.32rem rgba(0, 0, 0, 0.2);
  z-index: 2;
  color: white;
  text-align: center;
  padding: 0.28rem 0.3rem;
  padding-top: 0.5rem;
}

/* 动画 */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
    transform: rotate(30deg) translate(0, 0);
  }

  25% {
    background-position: 100% 50%;
    transform: rotate(35deg) translate(-5%, -5%);
  }

  50% {
    background-position: 50% 100%;
    transform: rotate(25deg) translate(5%, 5%);
  }

  75% {
    background-position: 100% 0%;
    transform: rotate(35deg) translate(-5%, 0);
  }

  100% {
    background-position: 0% 50%;
    transform: rotate(30deg) translate(0, 0);
  }
}

.glass-panel .avatar-container {
  display: flex;
  gap: 0.2rem;
  overflow-x: auto;
  padding-top: 0.05rem;
}

.avatar-item {
  position: relative;
  flex: 0 0 auto;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.08rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0.04rem 0.08rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.avatar-img-item {
  background: #fff;
}

.avatar-item:hover {
  transform: translateY(-0.05rem);
}

.avatar-item.selected {
  border: 0.03rem solid #4b6cb7;
}

.avatar-item.selected::after {
  content: "";
  position: absolute;
  bottom: 0.05rem;
  right: 0.05rem;
  width: 0.2rem;
  height: 0.2rem;
  background-color: #4b6cb7;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.avatar-item.selected::before {
  content: "\f00c";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  position: absolute;
  bottom: 0.05rem;
  right: 0.05rem;
  width: 0.2rem;
  height: 0.2rem;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.1rem;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: white;
}

.custom-avatar {
  background: #acacac;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.14rem;
}

.delete-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.18rem;
}

.hasAvatar:hover .delete-icon {
  display: flex;
}

.delete-icon .fa-solid:hover {
  color: rgb(103, 167, 231);
}

.close-icon {
  position: absolute;
  right: 0.15rem;
  top: 0.1rem;
  color: #fff;
  font-size: 0.18rem;
  cursor: pointer;
  transition: transform 0.5s linear;
}

.close-icon:hover {
  color: #07e;
  transform: rotate(180deg);
  transform-origin: center;
}

.custom-btn {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.1rem 0.4rem;
  font-size: 0.16rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.02rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  transition: all 0.4s ease;
  transform: perspective(5rem) translateZ(0);
  box-shadow: 0 0.05rem 0.15rem rgba(0, 0, 0, 0.3);
}

/* 渐变效果 */
.gradient-effect {
  background: linear-gradient(45deg, #a83518, #c56e2c, #4068b1, #7f7fd5);
  background-size: 300% 300%;
  color: #fff;
  border: none;
}

.gradient-effect:hover {
  transform: translateY(-0.05rem) scale(1.05) perspective(5rem) rotateX(-10deg);
  box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.4);
  animation: gradientShift 4s ease infinite;
}

.particle {
  position: absolute;
  width: 0.1rem;
  height: 0.1rem;
  border-radius: 50%;
  pointer-events: none;
  animation: particleAnim 1s ease-out forwards;
}

@keyframes particleAnim {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(1);
    opacity: 0;
  }
}

/* 涟漪效果 */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  transform: scale(0);
  animation: rippleEffect 0.6s linear;
  pointer-events: none;
}

@keyframes rippleEffect {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.save-btn {
  position: absolute;
  bottom: 0.25rem;
  width: 100%;
  display: flex;
  justify-content: center;
  width: calc(100% - 0.6rem);
}

.fake-input {
  font-size: 0.18rem;
}
</style>
