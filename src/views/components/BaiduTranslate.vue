<template>
  <div class="translate-wrapper">
    <div class="from-lang lang-container">
      <el-select v-model="fromlang" filterable @change="changeLang('from')">
        <el-option-group
          v-for="group in languageList"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
      <div class="translate-container">
        <el-input
          v-model="translateText"
          resize="none"
          type="textarea"
          :placeholder="hasAPPID ? '输入文本' : '请先配置百度翻译API'"
          :disabled="!hasAPPID"
          @input="handleTranslate"
        />
      </div>
    </div>
    <div class="target-lang lang-container">
      <el-select v-model="targetlang" filterable @change="changeLang('target')">
        <el-option-group
          v-for="group in languageList"
          :key="group.label"
          :label="group.label"
        >
          <template v-for="item in group.options">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-if="item.value !== 'auto'"
            />
          </template>
        </el-option-group>
      </el-select>
      <div class="translate-container" @click.stop.prevent="handleCopy">
        <span class="translate-result">{{ translateResult || "翻译" }}</span>
      </div>
    </div>
    <div class="swap-icon" @click="handleSwap">
      <i class="fa-solid fa-right-left"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { MD5 } from "../../utils/md5";
import { debounce } from "lodash-es";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

const store = useStore();

const fromlang = ref("auto");
const targetlang = ref("zh");
const translateText = ref("");
const translateResult = ref("");

const appId = computed(() => {
  return store.state.translateApp.appId;
});

const appKey = computed(() => {
  return store.state.translateApp.appKey;
});

const hasAPPID = computed(() => {
  return appId.value && appKey.value;
});

onMounted(() => {
  fromlang.value = store.state.fromlang;
  targetlang.value = store.state.targetlang;
});

const changeLang = (type) => {
  if (type === "from") {
    store.commit("CHANGE_FROM_LANG", fromlang.value);
  } else {
    store.commit("CHANGE_TARGET_LANG", targetlang.value);
  }
};

const handleSwap = () => {
  if (fromlang.value === "auto") {
    ElMessage.error("源语言为自动检测状态，不支持切换语言");
    return;
  }
  [fromlang.value, targetlang.value] = [targetlang.value, fromlang.value];
  changeLang("from");
  changeLang("target");
};

const languageList = [
  {
    label: "A",
    options: [
      {
        group: "A",
        label: "阿拉伯语",
        value: "ara",
      },
      {
        group: "A",
        label: "爱尔兰语",
        value: "gle",
      },
      {
        group: "A",
        label: "奥克语",
        value: "oci",
      },
      {
        group: "A",
        label: "阿尔巴尼亚语",
        value: "alb",
      },
      {
        group: "A",
        label: "阿尔及利亚阿拉伯语",
        value: "arq",
      },
      {
        group: "A",
        label: "阿肯语",
        value: "aka",
      },
      {
        group: "A",
        label: "阿拉贡语",
        value: "arg",
      },
      {
        group: "A",
        label: "阿姆哈拉语",
        value: "amh",
      },
      {
        group: "A",
        label: "阿萨姆语",
        value: "asm",
      },
      {
        group: "A",
        label: "艾马拉语",
        value: "aym",
      },
      {
        group: "A",
        label: "阿塞拜疆语",
        value: "aze",
      },
      {
        group: "A",
        label: "阿斯图里亚斯语",
        value: "ast",
      },
      {
        group: "A",
        label: "奥塞梯语",
        value: "oss",
      },
      {
        group: "A",
        label: "爱沙尼亚语",
        value: "est",
      },
      {
        group: "A",
        label: "奥杰布瓦语",
        value: "oji",
      },
      {
        group: "A",
        label: "奥里亚语",
        value: "ori",
      },
      {
        group: "A",
        label: "奥罗莫语",
        value: "orm",
      },
    ],
  },
  {
    label: "B",
    options: [
      {
        group: "B",
        label: "波兰语",
        value: "pl",
      },
      {
        group: "B",
        label: "波斯语",
        value: "per",
      },
      {
        group: "B",
        label: "布列塔尼语",
        value: "bre",
      },
      {
        group: "B",
        label: "巴什基尔语",
        value: "bak",
      },
      {
        group: "B",
        label: "巴斯克语",
        value: "baq",
      },
      {
        group: "B",
        label: "巴西葡萄牙语",
        value: "pot",
      },
      {
        group: "B",
        label: "白俄罗斯语",
        value: "bel",
      },
      {
        group: "B",
        label: "柏柏尔语",
        value: "ber",
      },
      {
        group: "B",
        label: "邦板牙语",
        value: "pam",
      },
      {
        group: "B",
        label: "保加利亚语",
        value: "bul",
      },
      {
        group: "B",
        label: "北方萨米语",
        value: "sme",
      },
      {
        group: "B",
        label: "北索托语",
        value: "ped",
      },
      {
        group: "B",
        label: "本巴语",
        value: "bem",
      },
      {
        group: "B",
        label: "比林语",
        value: "bil",
      },
      {
        group: "B",
        label: "比斯拉马语",
        value: "bis",
      },
      {
        group: "B",
        label: "俾路支语",
        value: "bal",
      },
      {
        group: "B",
        label: "冰岛语",
        value: "ice",
      },
      {
        group: "B",
        label: "波斯尼亚语",
        value: "bos",
      },
      {
        group: "B",
        label: "博杰普尔语",
        value: "bho",
      },
    ],
  },
  {
    label: "C",
    options: [
      {
        group: "C",
        label: "楚瓦什语",
        value: "chv",
      },
      {
        group: "C",
        label: "聪加语",
        value: "tso",
      },
    ],
  },
  {
    label: "D",
    options: [
      {
        group: "D",
        label: "丹麦语",
        value: "dan",
      },
      {
        group: "D",
        label: "德语",
        value: "de",
      },
      {
        group: "D",
        label: "鞑靼语",
        value: "tat",
      },
      {
        group: "D",
        label: "掸语",
        value: "sha",
      },
      {
        group: "D",
        label: "德顿语",
        value: "tet",
      },
      {
        group: "D",
        label: "迪维希语",
        value: "div",
      },
      {
        group: "D",
        label: "低地德语",
        value: "log",
      },
    ],
  },
  {
    label: "E",
    options: [
      {
        group: "E",
        label: "俄语",
        value: "ru",
      },
    ],
  },
  {
    label: "F",
    options: [
      {
        group: "F",
        label: "法语",
        value: "fra",
      },
      {
        group: "F",
        label: "菲律宾语",
        value: "fil",
      },
      {
        group: "F",
        label: "芬兰语",
        value: "fin",
      },
      {
        group: "F",
        label: "梵语",
        value: "san",
      },
      {
        group: "F",
        label: "弗留利语",
        value: "fri",
      },
      {
        group: "F",
        label: "富拉尼语",
        value: "ful",
      },
      {
        group: "F",
        label: "法罗语",
        value: "fao",
      },
    ],
  },
  {
    label: "G",
    options: [
      {
        group: "G",
        label: "盖尔语",
        value: "gla",
      },
      {
        group: "G",
        label: "刚果语",
        value: "kon",
      },
      {
        group: "G",
        label: "高地索布语",
        value: "ups",
      },
      {
        group: "G",
        label: "高棉语",
        value: "hkm",
      },
      {
        group: "G",
        label: "格兰兰语",
        value: "kal",
      },
      {
        group: "G",
        label: "格鲁吉亚语",
        value: "geo",
      },
      {
        group: "G",
        label: "古吉拉特语",
        value: "guj",
      },
      {
        group: "G",
        label: "古希腊语",
        value: "gra",
      },
      {
        group: "G",
        label: "古英语",
        value: "eno",
      },
      {
        group: "G",
        label: "瓜拉尼语",
        value: "grn",
      },
    ],
  },
  {
    label: "H",
    options: [
      {
        group: "H",
        label: "韩语",
        value: "kor",
      },
      {
        group: "H",
        label: "荷兰语",
        value: "nl",
      },
      {
        group: "H",
        label: "胡帕语",
        value: "hup",
      },
      {
        group: "H",
        label: "哈卡钦语",
        value: "hak",
      },
      {
        group: "H",
        label: "海地语",
        value: "ht",
      },
      {
        group: "H",
        label: "黑山语",
        value: "mot",
      },
      {
        group: "H",
        label: "豪萨语",
        value: "hau",
      },
    ],
  },
  {
    label: "J",
    options: [
      {
        group: "J",
        label: "吉尔吉斯语",
        value: "kir",
      },
      {
        group: "J",
        label: "加利西亚语",
        value: "glg",
      },
      {
        group: "J",
        label: "加拿大法语",
        value: "frm",
      },
      {
        group: "J",
        label: "加泰罗尼亚语",
        value: "cat",
      },
      {
        group: "J",
        label: "捷克语",
        value: "cs",
      },
    ],
  },
  {
    label: "K",
    options: [
      {
        group: "K",
        label: "卡拜尔语",
        value: "kab",
      },
      {
        group: "K",
        label: "卡纳达语",
        value: "kan",
      },
      {
        group: "K",
        label: "卡努里语",
        value: "kau",
      },
      {
        group: "K",
        label: "卡舒比语",
        value: "kah",
      },
      {
        group: "K",
        label: "康瓦尔语",
        value: "cor",
      },
      {
        group: "K",
        label: "科萨语",
        value: "xho",
      },
      {
        group: "K",
        label: "科西嘉语",
        value: "cos",
      },
      {
        group: "K",
        label: "克里克语",
        value: "cre",
      },
      {
        group: "K",
        label: "克里米亚鞑靼语",
        value: "cri",
      },
      {
        group: "K",
        label: "克林贡语",
        value: "kli",
      },
      {
        group: "K",
        label: "克罗地亚语",
        value: "hrv",
      },
      {
        group: "K",
        label: "克丘亚语",
        value: "que",
      },
      {
        group: "K",
        label: "克什米尔语",
        value: "kas",
      },
      {
        group: "K",
        label: "孔卡尼语",
        value: "kok",
      },
      {
        group: "K",
        label: "库尔德语",
        value: "kur",
      },
    ],
  },
  {
    label: "L",
    options: [
      {
        group: "L",
        label: "拉丁语",
        value: "lat",
      },
      {
        group: "L",
        label: "老挝语",
        value: "lao",
      },
      {
        group: "L",
        label: "罗马尼亚语",
        value: "rom",
      },
      {
        group: "L",
        label: "拉特加莱语",
        value: "lag",
      },
      {
        group: "L",
        label: "拉脱维亚语",
        value: "lav",
      },
      {
        group: "L",
        label: "林堡语",
        value: "lim",
      },
      {
        group: "L",
        label: "林加拉语",
        value: "lin",
      },
      {
        group: "L",
        label: "卢干达语",
        value: "lug",
      },
      {
        group: "L",
        label: "卢森堡语",
        value: "ltz",
      },
      {
        group: "L",
        label: "卢森尼亚语",
        value: "ruy",
      },
      {
        group: "L",
        label: "卢旺达语",
        value: "kin",
      },
      {
        group: "L",
        label: "立陶宛语",
        value: "lit",
      },
      {
        group: "L",
        label: "罗曼什语",
        value: "roh",
      },
      {
        group: "L",
        label: "罗姆语",
        value: "ro",
      },
      {
        group: "L",
        label: "逻辑语",
        value: "loj",
      },
    ],
  },
  {
    label: "M",
    options: [
      {
        group: "M",
        label: "马来语",
        value: "may",
      },
      {
        group: "M",
        label: "缅甸语",
        value: "bur",
      },
      {
        group: "M",
        label: "马拉地语",
        value: "mar",
      },
      {
        group: "M",
        label: "马拉加斯语",
        value: "mg",
      },
      {
        group: "M",
        label: "马拉雅拉姆语",
        value: "mal",
      },
      {
        group: "M",
        label: "马其顿语",
        value: "mac",
      },
      {
        group: "M",
        label: "马绍尔语",
        value: "mah",
      },
      {
        group: "M",
        label: "迈蒂利语",
        value: "mai",
      },
      {
        group: "M",
        label: "曼克斯语",
        value: "glv",
      },
      {
        group: "M",
        label: "毛里求斯克里奥尔语",
        value: "mau",
      },
      {
        group: "M",
        label: "毛利语",
        value: "mao",
      },
      {
        group: "M",
        label: "孟加拉语",
        value: "ben",
      },
      {
        group: "M",
        label: "马耳他语",
        value: "mlt",
      },
      {
        group: "M",
        label: "苗语",
        value: "hmn",
      },
    ],
  },
  {
    label: "N",
    options: [
      {
        group: "N",
        label: "挪威语",
        value: "nor",
      },
      {
        group: "N",
        label: "那不勒斯语",
        value: "nea",
      },
      {
        group: "N",
        label: "南恩德贝莱语",
        value: "nbl",
      },
      {
        group: "N",
        label: "南非荷兰语",
        value: "afr",
      },
      {
        group: "N",
        label: "南索托语",
        value: "sot",
      },
      {
        group: "N",
        label: "尼泊尔语",
        value: "nep",
      },
    ],
  },
  {
    label: "P",
    options: [
      {
        group: "P",
        label: "葡萄牙语",
        value: "pt",
      },
      {
        group: "P",
        label: "旁遮普语",
        value: "pan",
      },
      {
        group: "P",
        label: "帕皮阿门托语",
        value: "pap",
      },
      {
        group: "P",
        label: "普什图语",
        value: "pus",
      },
    ],
  },
  {
    label: "Q",
    options: [
      {
        group: "Q",
        label: "齐切瓦语",
        value: "nya",
      },
      {
        group: "Q",
        label: "契维语",
        value: "twi",
      },
      {
        group: "Q",
        label: "切罗基语",
        value: "chr",
      },
    ],
  },
  {
    label: "R",
    options: [
      {
        group: "R",
        label: "日语",
        value: "jp",
      },
      {
        group: "R",
        label: "瑞典语",
        value: "swe",
      },
    ],
  },
  {
    label: "S",
    options: [
      {
        group: "S",
        label: "萨丁尼亚语",
        value: "srd",
      },
      {
        group: "S",
        label: "萨摩亚语",
        value: "sm",
      },
      {
        group: "S",
        label: "塞尔维亚 - 克罗地亚语",
        value: "sec",
      },
      {
        group: "S",
        label: "塞尔维亚语",
        value: "srp",
      },
      {
        group: "S",
        label: "桑海语",
        value: "sol",
      },
      {
        group: "S",
        label: "僧伽罗语",
        value: "sin",
      },
      {
        group: "S",
        label: "世界语",
        value: "epo",
      },
      {
        group: "S",
        label: "书面挪威语",
        value: "nob",
      },
      {
        group: "S",
        label: "斯洛伐克语",
        value: "sk",
      },
      {
        group: "S",
        label: "斯洛文尼亚语",
        value: "slo",
      },
      {
        group: "S",
        label: "斯瓦希里语",
        value: "swa",
      },
      {
        group: "S",
        label: "塞尔维亚语（西里尔）",
        value: "src",
      },
      {
        group: "S",
        label: "索马里语",
        value: "som",
      },
      {
        group: "S",
        label: "苏格兰语",
        value: "sco",
      },
    ],
  },
  {
    label: "T",
    options: [
      {
        group: "T",
        label: "泰语",
        value: "th",
      },
      {
        group: "T",
        label: "土耳其语",
        value: "tr",
      },
      {
        group: "T",
        label: "塔吉克语",
        value: "tgk",
      },
      {
        group: "T",
        label: "泰米尔语",
        value: "tam",
      },
      {
        group: "T",
        label: "他加禄语",
        value: "tgl",
      },
      {
        group: "T",
        label: "提格里尼亚语",
        value: "tir",
      },
      {
        group: "T",
        label: "泰卢固语",
        value: "tel",
      },
      {
        group: "T",
        label: "突尼斯阿拉伯语",
        value: "tua",
      },
      {
        group: "T",
        label: "土库曼语",
        value: "tuk",
      },
    ],
  },
  {
    label: "W",
    options: [
      {
        group: "W",
        label: "乌克兰语",
        value: "ukr",
      },
      {
        group: "W",
        label: "瓦隆语",
        value: "wln",
      },
      {
        group: "W",
        label: "威尔士语",
        value: "wel",
      },
      {
        group: "W",
        label: "文达语",
        value: "ven",
      },
      {
        group: "W",
        label: "沃洛夫语",
        value: "wol",
      },
      {
        group: "W",
        label: "乌尔都语",
        value: "urd",
      },
    ],
  },
  {
    label: "X",
    options: [
      {
        group: "X",
        label: "西班牙语",
        value: "spa",
      },
      {
        group: "X",
        label: "希伯来语",
        value: "heb",
      },
      {
        group: "X",
        label: "希腊语",
        value: "el",
      },
      {
        group: "X",
        label: "匈牙利语",
        value: "hu",
      },
      {
        group: "X",
        label: "西弗里斯语",
        value: "fry",
      },
      {
        group: "X",
        label: "西里西亚语",
        value: "sil",
      },
      {
        group: "X",
        label: "希利盖农语",
        value: "hil",
      },
      {
        group: "X",
        label: "下索布语",
        value: "los",
      },
      {
        group: "X",
        label: "夏威夷语",
        value: "haw",
      },
      {
        group: "X",
        label: "新挪威语",
        value: "nno",
      },
      {
        group: "X",
        label: "西非书面语",
        value: "nqo",
      },
      {
        group: "X",
        label: "信德语",
        value: "snd",
      },
      {
        group: "X",
        label: "修纳语",
        value: "sna",
      },
      {
        group: "X",
        label: "宿务语",
        value: "ceb",
      },
      {
        group: "X",
        label: "叙利亚语",
        value: "syr",
      },
      {
        group: "X",
        label: "巽他语",
        value: "sun",
      },
    ],
  },
  {
    label: "Y",
    options: [
      {
        group: "Y",
        label: "英语",
        value: "en",
      },
      {
        group: "Y",
        label: "印地语",
        value: "hi",
      },
      {
        group: "Y",
        label: "印尼语",
        value: "id",
      },
      {
        group: "Y",
        label: "意大利语",
        value: "it",
      },
      {
        group: "Y",
        label: "越南语",
        value: "vie",
      },
      {
        group: "Y",
        label: "意第绪语",
        value: "yid",
      },
      {
        group: "Y",
        label: "因纽特语",
        value: "ina",
      },
      {
        group: "Y",
        label: "亚齐语",
        value: "ach",
      },
      {
        group: "Y",
        label: "印古什语",
        value: "ing",
      },
      {
        group: "Y",
        label: "伊博语",
        value: "ibo",
      },
      {
        group: "Y",
        label: "伊多语",
        value: "ido",
      },
      {
        group: "Y",
        label: "约鲁巴语",
        value: "yor",
      },
      {
        group: "Y",
        label: "亚美尼亚语",
        value: "arm",
      },
      {
        group: "Y",
        label: "伊努克蒂图特语",
        value: "iku",
      },
    ],
  },
  {
    label: "Z",
    options: [
      {
        group: "Z",
        label: "中文 (简体)",
        value: "zh",
      },
      {
        group: "Z",
        label: "中文 (繁体)",
        value: "cht",
      },
      {
        group: "Z",
        label: "中文 (文言)",
        value: "wyw",
      },
      {
        group: "Z",
        label: "中文 (粤语)",
        value: "yue",
      },
      {
        group: "Z",
        label: "扎扎其语",
        value: "zaz",
      },
      {
        group: "Z",
        label: "中古法语",
        value: "frm",
      },
      {
        group: "Z",
        label: "祖鲁语",
        value: "zul",
      },
      {
        group: "Z",
        label: "爪哇语",
        value: "jav",
      },
      {
        label: "自动识别",
        value: "auto",
      },
    ],
  },
];

function objectToUrlParams(obj) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    params.append(key, value);
  }
  return params.toString();
}

const handleTranslate = debounce(
  async () => {
    const text = translateText.value.trim();
    if (text === "") {
      translateResult.value = "";
      return;
    }
    const appid = appId.value;
    const salt = Date.now();
    const str1 = appid + text + salt + appKey.value;
    const sign = MD5(str1);
    const params = {
      q: text,
      appid,
      salt,
      from: fromlang.value,
      to: targetlang.value,
      sign,
    };
    try {
      const res = await fetch(
        "http://api.fanyi.baidu.com/api/trans/vip/translate?" +
          objectToUrlParams(params)
      ).then((res) => res.json());
      const {
        trans_result: [{ dst }],
      } = res;
      translateResult.value = dst;
    } catch {
      translateResult.value = "翻译失败，请检查apiKey是否正确";
    }
  },
  300,
  {
    leading: false,
  }
);

const handleCopy = () => {
  const text = translateResult.value;
  if (text === "") {
    return;
  }
  navigator.clipboard.writeText(text);
  ElMessage.success("复制成功");
};
</script>

<style>
.translate-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 0.08rem;
  background: #fff;
  display: flex;
  overflow: hidden;
  position: relative;
}
.lang-container {
  width: 50%;
  min-width: 50%;
  padding: 0.12rem;
}
.from-lang {
  padding-right: 0.22rem;
}
.target-lang {
  background: #f7f7f7;
  padding-left: 0.22rem;
}
.swap-icon {
  position: absolute;
  left: calc(50% - 0.13rem);
  top: 0.14rem;
  width: 0.26rem;
  height: 0.26rem;
  font-size: 0.1rem;
  border-radius: 50%;
  color: #919191;
  border: 1px solid #c7c7c7;
  background: #fff;
  line-height: 0.26rem;
  text-align: center;
}
.swap-icon:hover {
  color: #444;
}
.translate-container {
  margin-top: 0.15rem;
  height: calc(100% - 32px);
}
.lang-container .el-textarea {
  height: 96%;
}
.lang-container .el-textarea__inner {
  box-shadow: none;
  height: 100%;
}
.lang-container .el-textarea__inner:focus {
  box-shadow: none;
}
.lang-container .el-textarea__inner:hover {
  box-shadow: none;
}
.translate-result {
  color: #444;
}

.el-textarea.is-disabled .el-textarea__inner {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>