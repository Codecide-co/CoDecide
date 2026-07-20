import es from "@languages/es.js";
import en from "@languages/en.js";
import { postApiData } from "@core/api";

let currentLang = localStorage.getItem("language") || "es";

const locales = { es, en };

function getTranslations() {
  return locales[currentLang] || locales.es;
}

export function t(key, params) {
  let msg = getTranslations()[key];
  if (msg === undefined) msg = key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      msg = msg.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
    }
  }
  return msg;
}

export function getCurrentLang() {
  return currentLang;
}

export function setCurrentLang(lang) {
  if (lang !== "es" && lang !== "en") return;
  if (lang === currentLang) return;
  currentLang = lang;
  localStorage.setItem("language", lang);
  document.documentElement.lang = lang;
}

export function langToggleHtml() {
  const other = currentLang === "es" ? "en" : "es";
  return `<button class="lang-toggle" data-lang="${other}" title="${t(`lang.${other}`)}">${t(`lang.${other}`)}</button>`;
}

export function initLangToggle() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    const lang = btn.dataset.lang;
    setCurrentLang(lang);
    try {
      await postApiData("/language", { language: lang });
    } catch {}
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}
