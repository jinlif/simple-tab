// src/utils/persistState.js
export default function createChromePersistedState(options = {}) {
  const key = options.key || "vuex-state";
  const paths = options.paths || [];

  // 从 chrome.storage 读取状态
  async function loadState() {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || {});
      });
    });
  }

  // 保存状态到 chrome.storage
  function saveState(state) {
    const stateToSave = paths.length
      ? paths.reduce((acc, path) => {
          const segments = path.split(".");
          let current = state;

          for (const segment of segments) {
            if (!current) break;
            current = current[segment];
          }

          if (current !== undefined) {
            acc[path] = current;
          }

          return acc;
        }, {})
      : state;

    chrome.storage.local.set({ [key]: stateToSave });
  }

  // 深度合并对象，正确处理数组
  function mergeState(target, source) {
    // 处理非对象类型
    if (
      typeof target !== "object" ||
      target === null ||
      typeof source !== "object" ||
      source === null
    ) {
      return source !== undefined ? source : target;
    }

    // 处理数组
    if (Array.isArray(target)) {
      // 如果源是数组，直接替换
      if (Array.isArray(source)) {
        return source;
      }

      // 如果源是对象（可能是存储时的路径表示）
      const newArray = [...target];
      Object.keys(source).forEach((key) => {
        const index = parseInt(key);
        if (!isNaN(index) && index >= 0 && index < newArray.length) {
          newArray[index] = mergeState(newArray[index], source[key]);
        } else {
          // 非数字索引，作为对象属性处理
          newArray[key] = source[key];
        }
      });
      return newArray;
    }

    // 处理普通对象
    const result = { ...target };
    Object.keys(source).forEach((key) => {
      if (source[key] !== undefined) {
        result[key] = mergeState(target[key], source[key]);
      }
    });
    return result;
  }

  // 返回 Vuex 插件
  return (store) => {
    // 初始化时恢复状态
    loadState().then((savedState) => {
      if (savedState && Object.keys(savedState).length > 0) {
        let mergedState;

        if (paths.length) {
          // 处理指定路径的情况
          mergedState = { ...store.state };

          Object.entries(savedState).forEach(([path, value]) => {
            const segments = path.split(".");
            let current = mergedState;

            for (let i = 0; i < segments.length - 1; i++) {
              const segment = segments[i];

              // 如果下一个 segment 是数字，则当前应该是数组
              const nextIsNumber = !isNaN(parseInt(segments[i + 1]));

              if (nextIsNumber && !Array.isArray(current[segment])) {
                current[segment] = [];
              } else if (
                !nextIsNumber &&
                typeof current[segment] !== "object"
              ) {
                current[segment] = {};
              }

              if (!current[segment]) {
                current[segment] = nextIsNumber ? [] : {};
              }

              current = current[segment];
            }

            // 只覆盖已存在的值
            const lastSegment = segments[segments.length - 1];
            if (current[lastSegment] !== undefined) {
              current[lastSegment] = value;
            }
          });
        } else {
          // 处理整个状态的情况
          mergedState = mergeState(store.state, savedState);
        }

        store.replaceState(mergedState);
      }
    });

    // 监听状态变化并保存
    store.subscribe((mutation, state) => {
      saveState(state);
    });
  };
}
