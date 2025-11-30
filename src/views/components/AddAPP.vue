<template>
  <div class="glass-panel">
    <i class="fa-solid fa-plus"></i>
  </div>
</template>

<style scoped>
.glass-panel {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(0.4rem);
  -webkit-backdrop-filter: blur(0.4rem);
  border-radius: 0.08rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 2;
  color: white;
  text-align: center;
  font-size: 0.28rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>