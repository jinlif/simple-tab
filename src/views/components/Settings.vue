<template>
  <div>
    <div class="settings-title">百度翻译API配置：</div>
    <el-form label-width="auto" label-position="left">
      <el-form-item label="App Id:">
        <el-input v-model="appId" />
      </el-form-item>
      <el-form-item label="App Key:">
        <el-input v-model="appKey" type="password" show-password />
      </el-form-item>
    </el-form>
    <!-- <div class="settings-title">主题：</div> -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const appId = computed({
  get() {
    return store.state.translateApp.appId;
  },
  set(value) {
    store.commit("CHANGE_TRANSLATE_CONFIG", {
      appId: value,
      appKey: appKey.value,
    });
  },
});
const appKey = computed({
  get() {
    return store.state.translateApp.appKey;
  },
  set(value) {
    store.commit("CHANGE_TRANSLATE_CONFIG", {
      appId: appId.value,
      appKey: value,
    });
  },
});
</script>

<style scoped>
.settings-title {
  font-size: 16px;
  color: rgb(2, 59, 117);
  padding: 8px 0 16px;
  position: relative;
  font-weight: bold;
}

.settings-title::before {
  content: "";
  display: block;
  position: absolute;
  width: 6px;
  border-radius: 2px;
  height: 14px;
  background: #369b64;
  left: -10px;
  top: 14px;
}
</style>