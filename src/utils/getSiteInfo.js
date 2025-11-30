export const getSiteInfo = async ({ html, url }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 取 title
  const titleTag = doc.querySelector("title");
  const title = titleTag ? titleTag.textContent.trim() : "";

  // 收集可用的 icon href（优先级由我们手动控制）
  const iconSelectors = [
    'link[rel~="icon"]',
    'link[rel~="shortcut icon"]',
    'link[rel~="apple-touch-icon"]',
    'link[rel~="apple-touch-icon-precomposed"]',
  ];
  const iconHrefs = [];
  for (const sel of iconSelectors) {
    doc.querySelectorAll(sel).forEach((link) => {
      const href = link.getAttribute("href");
      if (href) iconHrefs.push(href);
    });
  }

  // 解析相对 URL -> 绝对 URL
  const base = new URL(url).origin;
  const absIcons = iconHrefs.map((h) => new URL(h, base).href);

  // 最后一道保险：尝试 /favicon.ico
  absIcons.push(`${base}/favicon.ico`);

  // 备用：使用 Google favicon 服务
  const domain = new URL(url).hostname;
  absIcons.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);

  // 检查哪个图标能被正常访问（HEAD 或 GET 小请求）
  const availableIcons = new Set();
  for (const iconUrl of absIcons) {
    try {
      const r = await fetch(iconUrl, { method: "HEAD" });
      if (r.ok && r.headers.get("content-type")?.startsWith("image")) {
        availableIcons.add(iconUrl);
      } else {
        // 有些服务器不支持 HEAD 或返回错误，尝试 GET（小文件）
        const r2 = await fetch(iconUrl, { method: "GET" });
        if (r2.ok && r2.headers.get("content-type")?.startsWith("image")) {
          availableIcons.add(iconUrl);
        }
      }
    } catch (e) {
      // 忽略单个失败，继续尝试下一个
    }
  }

  return {
    title,
    icon: [...availableIcons],
  };
};
