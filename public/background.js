chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fetchSiteInfo") {
    fetchSiteInfo(msg.url)
      .then((result) => {
        sendResponse(result);
      })
      .catch((err) => {
        sendResponse({ error: err.message });
      });

    // 必须返回 true，否则 sendResponse 会失效
    return true;
  }
});

async function fetchSiteInfo(rawUrl) {
  // 规范化 URL（如果用户只输入 domain）
  const url = normalizeUrl(rawUrl);
  const resp = await fetch(url, { method: "GET", redirect: "follow" });
  if (!resp.ok)
    throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);

  const html = await resp.text();
  return {
    html,
    url,
  };
}

function normalizeUrl(input) {
  let s = input.trim();
  // 如果用户只是粘贴域名或没有 scheme，加上 https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    s = "https://" + s;
  }
  // 最小保证：有效 URL
  try {
    const u = new URL(s);
    return u.href;
  } catch (err) {
    throw new Error("输入不是有效 URL");
  }
}
