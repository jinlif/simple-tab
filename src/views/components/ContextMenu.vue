<template>
  <div class="context-menu" :class="{ visible: isVisible }" :style="menuStyle">
    <div class="menu-item" @click="setSize('1x1')">
      <i class="fas fa-square"></i>
      <span>1×1</span>
    </div>
    <div class="menu-item" @click="setSize('1x2')">
      <i class="fas fa-arrows-alt-h"></i>
      <span>1×2</span>
    </div>
    <div class="menu-item" @click="setSize('2x2')">
      <i class="fas fa-th-large"></i>
      <span>2×2</span>
    </div>
    <div class="menu-item" @click="setSize('2x3')">
      <i class="fas fa-grip"></i>
      <span>2×3</span>
    </div>
    <div class="menu-item" @click="setSize('3x3')">
      <i class="fas fa-table-cells"></i>
      <span>3×3</span>
    </div>
    <!-- <div class="menu-item" @click="setSize('3x4')">
      <i class="fas fa-th-list"></i>
      <span>3×4</span>
    </div> -->
    <div class="menu-divider"></div>
    <div class="menu-item" @click="editApp" style="color: #66fff2">
      <i class="fa-solid fa-pen-to-square"></i>
      <span>修改应用</span>
    </div>
    <div class="menu-item" @click="deleteApp" style="color: #ff9e80">
      <i class="fas fa-trash-alt"></i>
      <span>删除应用</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  position: {},
  isVisible: false,
  selectedApp: {},
});
const emit = defineEmits(["set-size", "delete-app", "edit-app"]);

const menuStyle = computed(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`,
}));

const setSize = (size) => {
  emit("set-size", size);
};

const deleteApp = () => {
  emit("delete-app");
};

const editApp = () => {
  emit("edit-app");
};
</script>