<template>
  <div class="search-container" @click.stop.prevent>
    <div class="search-box">
      <!-- Logo在输入框内部左侧 -->
      <div
        class="logo-container"
        @click.stop.prevent="
          showSearchChoose = !showSearchChoose;
          showSuggestions = false;
        "
      >
        <img
          :src="require(`../../assets/images/search/search_icon_${icon}.png`)"
          alt=""
          class="logo"
        />
      </div>

      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          placeholder="输入关键词搜索..."
          v-model="query"
          autocomplete="off"
          @input="getSuggestions"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter="performSearch"
          @keydown.esc="closeSuggestions"
          @focus="showSearchChoose = false"
          @blur="showSuggestions = false"
          ref="searchInput"
        />
        <div class="search-icon" @click="performSearch">
          <i class="fas fa-search"></i>
        </div>
      </div>
    </div>

    <!-- 悬浮提示框（绝对定位） -->
    <transition name="collapse">
      <div class="suggestions-container" v-if="showSuggestions">
        <ul class="suggestions-list" v-if="suggestions.length > 0">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
            :class="{ active: activeIndex === index }"
            @click="selectSuggestion(suggestion)"
            @mousedown.prevent
          >
            <span v-html="highlightMatch(suggestion.text, query)"></span>
          </li>
        </ul>
        <div class="empty-state" v-else>
          <i class="fas fa-search"></i>
          <p>没有找到相关提示</p>
        </div>
      </div>
    </transition>

    <transition name="collapse">
      <div class="suggestions-container search-list" v-if="showSearchChoose">
        <template v-for="item in searchList" :key="item.name">
          <div
            class="search-item hover-event"
            @click="handleChangeSearch(item)"
          >
            <img
              :src="
                require(`../../assets/images/search/search_icon_${item.icon}.png`)
              "
            />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from "vue";

import { useStore } from "vuex";

const icon = computed(() => store.getters.getIcon);
const searchTipLink = "https://movetab.jianyueku.com/api/s/kw?kw={query}";
const searchServerLink = computed(() => store.getters.getSearchServerLink);

const searchList = [
  {
    href: "https://www.google.com/search?q={query}",
    name: "谷歌",
    icon: "google",
  },
  {
    href: "https://www.baidu.com/s?wd={query}",
    name: "百度",
    icon: "baidu",
  },
  {
    href: "https://bing.com/search?q={query}",
    name: "必应",
    icon: "bing",
  },
  {
    href: "https://www.sogou.com/web?query={query}",
    name: "搜狗",
    icon: "sougou",
  },
];

const store = useStore();
const query = ref("");
const activeIndex = ref(-1);
const searchInput = ref(null);
const showSuggestions = ref(false);
const showSearchChoose = ref(false);

// 提示数据
const suggestions = ref([]);

// 获取提示
const getSuggestions = async () => {
  if (query.value.trim().length === 0) {
    showSuggestions.value = false;
    suggestions.value = [];
    return;
  }
  activeIndex.value = -1;
  const res = await fetch(searchTipLink.replace("{query}", query.value));
  const { g = [] } = await res.json();
  suggestions.value = g.map((item) => ({ text: item.q, id: item.q }));
  showSuggestions.value = query.value.length > 0;
  showSearchChoose.value = false;
};

// 关闭提示
const closeSuggestions = () => {
  showSuggestions.value = false;
};

const scrollToActive = () => {
  const activeItem = document.querySelector(".suggestion-item.active");
  if (activeItem) {
    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
};

let moveTimeStamp = 0;
// 向下移动选择
const moveDown = (e) => {
  if (e.timeStamp - moveTimeStamp < 100 || suggestions.value.length === 0) {
    return;
  }
  moveTimeStamp = e.timeStamp;
  activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
  nextTick(() => scrollToActive());
};

// 向上移动选择
const moveUp = (e) => {
  if (e.timeStamp - moveTimeStamp < 100 || suggestions.value.length === 0) {
    return;
  }
  moveTimeStamp = e.timeStamp;

  activeIndex.value =
    (activeIndex.value - 1 + suggestions.value.length) %
    suggestions.value.length;
  scrollToActive();
};

// 执行搜索
const performSearch = () => {
  if (suggestions.value.length > 0 && activeIndex.value >= 0) {
    // 如果有选中的提示项
    query.value = suggestions.value[activeIndex.value].text;
  }
  activeIndex.value = -1;
  showSuggestions.value = false;
  handleSearch();
};

// 选择提示项
const selectSuggestion = (suggestion) => {
  query.value = suggestion.text;
  activeIndex.value = -1;
  showSuggestions.value = false;
  handleSearch();
};

const handleChangeSearch = (item) => {
  showSearchChoose.value = false;
  store.dispatch("changeIcon", item.icon);
  store.dispatch("changeSearchServerLink", item.href);
};

const handleSearch = () => {
  nextTick(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        // 创建新标签，位置为当前标签的索引
        chrome.tabs.create({
          url: searchServerLink.value.replace("{query}", query.value),
          index: activeTab.index, // 这会使新标签出现在当前标签左侧
          active: true, // 设置为true则新标签会变为活动状态
        });
      });
    } catch {
      window.open(
        searchServerLink.value.replace("{query}", query.value),
        "_blank"
      );
    }
  });
};

// 高亮匹配文本
const highlightMatch = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const hiddenSuggest = () => {
  showSearchChoose.value = false;
  showSuggestions.value = false;
};

document.addEventListener("click", hiddenSuggest);

onBeforeUnmount(() => {
  document.removeEventListener("click", hiddenSuggest);
});
</script>

<style>
.search-container {
  max-width: 6.5rem;
  margin: 0 auto 0.5rem;
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.84);
  border-radius: 0.16rem;
  box-shadow: 0 0.15rem 0.35rem rgba(0, 0, 0, 0.25);
  overflow: hidden;
  height: 0.7rem;
  position: relative;
  transition: all 0.3s ease;
  border: none;
}

.search-box:hover {
  background: rgba(255, 255, 255, 0.96);
}

.search-box:focus-within {
  background: (255, 255, 255, 0.96);
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0 0.2rem;
  height: 100%;
}

.logo-container:hover {
  background: rgba(180, 180, 180, 0.2);
  cursor: pointer;
}

.logo {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  font-weight: bold;
}

.search-input-container {
  flex: 1;
  position: relative;
  height: 100%;
}

.search-input {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0 0.6rem 0 0.15rem;
  border: none;
  font-size: 0.18rem;
  outline: none;
  background: transparent;
}

.search-icon {
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.22rem;
  cursor: pointer;
  transition: all 0.3s;
}

.search-icon:hover {
  color: #4caf50;
  transform: translateY(-50%) scale(1.1);
}

/* 悬浮提示框样式 - 绝对定位 */
.suggestions-container {
  position: absolute;
  top: calc(100% + 0.08rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.12rem;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.suggestions-list {
  list-style: none;
  padding: 0.1rem 0;
  margin: 0;
  max-height: 3rem;
  overflow-y: auto;
}
/* 隐藏suggestions-list滚动条 */
.suggestions-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.suggestion-item {
  padding: 0.14rem 0.25rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  position: relative;
}

.suggestion-item i {
  margin-right: 0.15rem;
  color: #6c757d;
  width: 0.24rem;
  text-align: center;
  font-size: 0.18rem;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-item.active {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 500;
}

.suggestion-item.active i {
  color: #4caf50;
}

.suggestion-item .highlight {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 0.02rem 0;
  border-radius: 0.03rem;
}

.search-list {
  display: flex;
  padding: 0.12rem;
  flex-wrap: wrap;
  column-gap: 0.12rem;
}

.search-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 0.14rem;
  cursor: pointer;
}

.search-item img {
  width: 0.45rem;
  height: 0.45rem;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.5s ease;
  max-height: 5rem;
  opacity: 1;
  transform: translateY(0);
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-0.1rem);
}

.empty-state {
  padding: 0.25rem;
  color: #6c757d;
  text-align: center;
  font-size: 0.16rem;
}

.empty-state i {
  font-size: 0.24rem;
  margin-bottom: 0.1rem;
  display: block;
  color: #adb5bd;
}
</style>