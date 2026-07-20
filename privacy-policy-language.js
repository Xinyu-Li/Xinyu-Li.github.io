const storageKey = "quickTranslate.settings";

function applyLanguage(language) {
  const selected = language === "zh-CN" ? "zh-CN" : "en";
  document.documentElement.lang = selected;
  document.title = selected === "zh-CN"
    ? "QuickTranslate 隐私政策"
    : "QuickTranslate Privacy Policy";

  for (const element of document.querySelectorAll("[data-language]")) {
    element.hidden = element.dataset.language !== selected;
  }
  for (const button of document.querySelectorAll("[data-set-language]")) {
    const isEnglishButton = button.dataset.setLanguage === "en";
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.setLanguage === selected)
    );
    const buttonLabel = selected === "zh-CN"
      ? (isEnglishButton ? "英语" : "中文")
      : (isEnglishButton ? "English" : "Chinese");
    button.setAttribute("title", buttonLabel);
    button.setAttribute("aria-label", buttonLabel);
  }
  document.querySelector(".language-switcher")?.setAttribute(
    "aria-label",
    selected === "zh-CN" ? "界面语言" : "Interface language"
  );
  document.documentElement.dataset.uiReady = "true";
}

async function setLanguage(language) {
  if (globalThis.chrome?.storage?.local) {
    const stored = await chrome.storage.local.get(storageKey);
    const settings = stored[storageKey] ?? {};
    await chrome.storage.local.set({
      [storageKey]: { ...settings, uiLanguage: language }
    });
  } else {
    localStorage.setItem("quickTranslate.uiLanguage", language);
  }
  applyLanguage(language);
}

for (const button of document.querySelectorAll("[data-set-language]")) {
  button.addEventListener("click", () => {
    void setLanguage(button.dataset.setLanguage);
  });
}

if (globalThis.chrome?.storage?.local) {
  chrome.storage.local.get(storageKey).then((stored) => {
    applyLanguage(stored[storageKey]?.uiLanguage);
  }).catch(() => applyLanguage("en"));
} else {
  applyLanguage(localStorage.getItem("quickTranslate.uiLanguage") ?? "en");
}
