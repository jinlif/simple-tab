import { createStore } from "vuex";
import createChromePersistedState from "../utils/createState";

export default createStore({
  state: {
    icon: "baidu",
    searchServerLink: "https://www.baidu.com/s?wd={query}",
    fromlang: "auto",
    targetlang: "zh",
    apps: [
      {
        id: "translate",
        component: "translate",
        name: "翻译",
        size: "3x5",
        noHoverEvent: true,
        hiddenContent: true,
        isNotDrag: true,
      },
      {
        id: "add-icon",
        name: "添加",
        size: "1x1",
        component: "addApp",
        hiddenContent: true,
        isNotDrag: true,
      },
    ],
    translateApp: {
      appId: "",
      appKey: "",
    },
  },
  mutations: {
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },
    CHANGE_ICON(state, icon) {
      state.icon = icon;
    },
    CHANGE_SEARCH_SERVER_LINK(state, link) {
      state.searchServerLink = link;
    },
    CHANGE_FROM_LANG(state, lang) {
      state.fromlang = lang;
    },
    CHANGE_TARGET_LANG(state, lang) {
      state.targetlang = lang;
    },
    ADD_APP(state, app) {
      state.apps.splice(state.apps.length - 1, 0, app);
    },
    REMOVE_APP(state, appId) {
      state.apps = state.apps.filter((app) => app.id !== appId);
    },
    EDIT_APP(state, app) {
      const index = state.apps.findIndex((a) => a.id === app.id);
      if (index !== -1) {
        state.apps[index] = app;
      }
    },
    DRAG_APP(state, { draggingIndex, targetIndex }) {
      const draggedApp = state.apps[draggingIndex];

      // 从原位置移除应用
      state.apps.splice(draggingIndex, 1);

      // 插入到新位置
      state.apps.splice(targetIndex, 0, draggedApp);
    },
    CHANGE_TRANSLATE_CONFIG(state, config) {
      state.translateApp = config;
    },
  },
  actions: {
    changeIcon({ commit }, icon) {
      commit("CHANGE_ICON", icon);
    },
    changeSearchServerLink({ commit }, link) {
      commit("CHANGE_SEARCH_SERVER_LINK", link);
    },
    changeFromLang({ commit }, lang) {
      commit("CHANGE_FROM_LANG", lang);
    },
    changeTargetLang({ commit }, lang) {
      commit("CHANGE_TARGET_LANG", lang);
    },
  },
  getters: {
    getIcon(state) {
      return state.icon;
    },
    getSearchServerLink(state) {
      return state.searchServerLink;
    },
    getFromLang(state) {
      return state.fromlang;
    },
    getTargetLang(state) {
      return state.targetlang;
    },
  },
  plugins: window?.chrome?.storage
    ? [createChromePersistedState({ key: "kerte-new-simple-tab" })]
    : [],
});
