<template>
  <div class="android-desktop">
    <transition-group name="app-move" tag="div" class="grid-container">
      <div
        v-for="(app, index) in apps"
        :key="app.id"
        class="grid-item"
        :class="[
          'size-' + app.size,
          {
            dragging: index === draggingIndex,
            'hover-event': !app.noHoverEvent,
          },
        ]"
        :draggable="!app.isNotDrag"
        @dragstart="handleDragStart(index)"
        @dragover.prevent="handleDragOver($event, index)"
        @drop="handleDrop($event)"
        @click="handleIconClick(app)"
        @contextmenu="handleRightClick($event, app)"
      >
        <img class="icon-img icon" v-if="app.img" :src="app.img" alt="" />
        <div class="icon" v-else-if="app.component">
          <slot :name="app.component">
            {{ app.name.charAt(0) }}
          </slot>
        </div>
        <div
          v-else
          class="icon icon-text"
          :style="{
            '--icon-bg': app.bg,
          }"
        >
          <slot :name="app.component">
            {{ app.name.charAt(0) }}
          </slot>
        </div>
        <div class="app-name">{{ app.name }}</div>
      </div>
    </transition-group>

    <ContextMenu
      :position="contextMenu.position"
      :isVisible="contextMenu.isVisible"
      :selectedApp="contextMenu.selectedApp"
      @set-size="setSize"
      @delete-app="deleteApp"
      @edit-app="editApp"
    />
    <NewTag
      :update-time="updateTime"
      :isEdit="isEdit"
      :selectedApp="editAppItem"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import ContextMenu from "./ContextMenu.vue";
import NewTag from "./NewTag.vue";
import { useStore } from "vuex";

const store = useStore();

// 应用数据
const apps = computed(() => store.state.apps);

// 拖拽状态
const draggingIndex = ref(null);
// 目标位置索引
const targetIndex = ref(null);
// 右键菜单状态
const contextMenu = reactive({
  isVisible: false,
  position: { x: 0, y: 0 },
  selectedApp: null,
});

const editAppItem = ref(null);

const isEdit = ref(false);

const updateTime = ref(0);

// 处理图标点击 - 设置尺寸
const handleIconClick = (app) => {
  if (app.id === "add-icon") {
    updateTime.value = Date.now();
    isEdit.value = false;
    return;
  }
  if (app.address) {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        // 创建新标签，位置为当前标签的索引
        chrome.tabs.create({
          url: app.address,
          index: activeTab.index, // 这会使新标签出现在当前标签左侧
          active: true, // 设置为true则新标签会变为活动状态
        });
      });
    } catch {
      window.open(app.address, "_blank");
    }
  }
};

// 处理拖拽开始
const handleDragStart = (index) => {
  draggingIndex.value = index;
};

// 处理拖拽经过
const handleDragOver = (e, index) => {
  e.preventDefault();
  targetIndex.value = index;
};

// 处理放置 - 顺位补位逻辑
const handleDrop = (e) => {
  e.preventDefault();

  if (
    (draggingIndex.value !== null &&
      draggingIndex.value === targetIndex.value) ||
    apps.value[targetIndex.value].isNotDrag
  ) {
    draggingIndex.value = null;
    targetIndex.value = null;
    return;
  }

  if (draggingIndex.value !== null && targetIndex.value !== null) {
    // 提交 Vuex 状态
    store.commit("DRAG_APP", {
      draggingIndex: draggingIndex.value,
      targetIndex: targetIndex.value,
    });

    // 重置状态
    draggingIndex.value = null;
    targetIndex.value = null;
  }
};

// 处理右键点击
const handleRightClick = (e, app) => {
  e.preventDefault();
  if (app.hiddenContent) {
    return;
  }
  contextMenu.isVisible = true;
  contextMenu.position = { x: e.clientX, y: e.clientY };
  contextMenu.selectedApp = app;
};

// 设置尺寸（通过菜单）
const setSize = (size) => {
  if (contextMenu.selectedApp) {
    contextMenu.selectedApp.size = size;
  }
  contextMenu.isVisible = false;
};

// 删除应用
const deleteApp = () => {
  if (contextMenu.selectedApp) {
    store.commit("REMOVE_APP", contextMenu.selectedApp.id);
  }
  contextMenu.isVisible = false;
};

const editApp = () => {
  editAppItem.value = contextMenu.selectedApp;
  isEdit.value = true;
  updateTime.value = Date.now();
};

// 关闭菜单
const closeMenu = () => {
  contextMenu.isVisible = false;
};

// 点击其他地方关闭菜单
onMounted(() => {
  document.addEventListener("click", closeMenu);
});
</script>

<style>
.grid-container {
  --grid-size: 0.8rem;
  --grid-gap: 0.1rem;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    calc(var(--grid-size) + var(--grid-gap))
  );
  grid-template-rows: calc(var(--grid-size) + var(--grid-gap));
  grid-auto-columns: calc(var(--grid-size) + var(--grid-gap));
  grid-auto-rows: calc(var(--grid-size) + var(--grid-gap));
  gap: 0.18rem;
}

.grid-item {
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.1rem;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  box-sizing: border-box;
  --icon-bg: #ace6b3;
}

.grid-item.dragging {
  opacity: 0.6;
  transform: scale(0.98);
  box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.4);
}

.grid-item.over {
  border: 0.02rem dashed #4fc3f7;
  background: rgba(79, 195, 247, 0.2);
}

.grid-item.size-1x1 {
  grid-row: span 1;
  grid-column: span 1;
}

.grid-item.size-1x2 {
  grid-row: span 1;
  grid-column: span 2;
}

.grid-item.size-2x1 {
  grid-row: span 2;
  grid-column: span 1;
}

.grid-item.size-2x2 {
  grid-row: span 2;
  grid-column: span 2;
}

.grid-item.size-2x3 {
  grid-row: span 2;
  grid-column: span 3;
}

.grid-item.size-3x3 {
  grid-row: span 3;
  grid-column: span 3;
}

.grid-item.size-3x4 {
  grid-row: span 3;
  grid-column: span 4;
}

.grid-item.size-3x5 {
  grid-row: span 3;
  grid-column: span 5;
}

.icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.08rem;
  transition: transform 0.3s ease;
  font-size: 0.16rem;
  user-select: none;
}

.icon-text {
  background: var(--icon-bg);
  font-size: 0.32rem;
  color: #fff;
  box-shadow: 0.07rem 0.07rem 0.2rem rgba(0, 0, 0, 0.2);
}
.icon-img {
  background: #fff;
  box-shadow: 0.07rem 0.07rem 0.2rem rgba(0, 0, 0, 0.2);
}

.app-name {
  text-align: center;
  font-size: 0.16rem;
  color: #e1f5fe;
  position: absolute;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  bottom: -0.16rem;
}

.context-menu {
  position: fixed;
  background: rgba(30, 30, 40, 0.95);
  border-radius: 0.12rem;
  box-shadow: 0 0.08rem 0.3rem rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(0.1rem);
  z-index: 1000;
  min-width: 2rem;
  overflow: hidden;
  border: 0.01rem solid rgba(255, 255, 255, 0.1);
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.02s ease;
  pointer-events: none;
}

.context-menu.visible {
  transform: scale(1);
  opacity: 1;
  pointer-events: all;
}

.menu-item {
  padding: 0.12rem 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.12rem;
  transition: background 0.2s;
  font-size: 0.16rem;
  color: #e0f7fa;
}

.menu-item:hover {
  background: rgba(33, 150, 243, 0.3);
}

.menu-item i {
  width: 0.2rem;
  text-align: center;
  color: #4fc3f7;
}

.menu-divider {
  height: 0.01rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.05rem 0;
}

.add-button:hover {
  background: rgba(33, 150, 243, 0.5);
  transform: translateY(-0.03rem);
  box-shadow: 0 0.05rem 0.15rem rgba(33, 150, 243, 0.3);
}

.app-move {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>