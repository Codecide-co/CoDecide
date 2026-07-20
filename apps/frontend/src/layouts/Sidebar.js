import { authStore } from "@store/auth.store";
import { removeSession } from "@core/helpers";
import { navigateTo } from "@core/helpers";
import { postApiData } from "@core/api";
import { openModal } from "@components/ui/Modal";
import { t, langToggleHtml, getCurrentLang, setCurrentLang } from "@core/i18n";

const sidebarLinks = [
  { href: "/home", labelKey: "sidebar.home", icon: "home.svg" },
];

export function SidebarHome() {
  const user = authStore.user;
  const currentPath = window.location.pathname;
  const isMobile = window.innerWidth < 768;
  const isCollapsed = isMobile || localStorage.getItem("sidebarCollapsed") === "true";

  const links = [
    { href: "/home", labelKey: "sidebar.home", icon: "home.svg" },
    ...(user?.role !== "admin" ? [{ href: "/reports/create", labelKey: "sidebar.new-report", icon: "reports.svg" }] : []),
    { href: "/reports", labelKey: "sidebar.reports", icon: "book.svg"},
    { href: "/stats", labelKey: "sidebar.statistics", icon: "statistics.svg" },
    { href: "/home/announcements", labelKey: "sidebar.comumnicated", icon: "comumnicated.svg" },
    { href: "/profile", labelKey: "sidebar.profile", icon: "user.svg" },
  ];
  if (user?.role === "admin") {
    links.push({ href: "/admin", labelKey: "sidebar.admin", icon: "setting.svg" });
  }

  const otherLang = getCurrentLang() === "es" ? "en" : "es";

  return `
    <aside class="sidebar-home" id="sidebar"${isCollapsed ? ' data-collapsed="true"' : ""}>
      <nav>
        <ul>
          ${links.map((l) => `
            <li><a href="${l.href}" data-link${currentPath === l.href ? ' class="active"' : ""}><img src="/${l.icon}" alt="${t(l.labelKey)}"><span class="sidebar-label">${t(l.labelKey)}</span></a></li>
          `).join("")}
          <li><hr class="sidebar-divider"></li>
          <li><a href="#" id="sidebar-lang" data-lang="${otherLang}"><img src="/translate.svg" alt="${t(`lang.${otherLang}`)}"><span class="sidebar-label">${t(`lang.${otherLang}`)}</span></a></li>
          <li><a href="#" id="sidebar-logout"><img src="/exit.svg" alt="${t("sidebar.exit")}"><span class="sidebar-label">${t("sidebar.exit")}</span></a></li>
        </ul>
      </nav>
    </aside>
  `;
}

export function initSidebarHome() {
  if (window.__sidebarInitted) return;
  window.__sidebarInitted = true;

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#sidebar-toggle");
    if (toggle) {
      const sidebar = document.getElementById("sidebar");
      if (!sidebar) return;
      const isCollapsed = sidebar.hasAttribute("data-collapsed");
      if (isCollapsed) {
        sidebar.removeAttribute("data-collapsed");
      } else {
        sidebar.setAttribute("data-collapsed", "true");
      }
      localStorage.setItem("sidebarCollapsed", String(!isCollapsed));
    }

    const logoutBtn = e.target.closest("#sidebar-logout");
    if (logoutBtn) {
      e.preventDefault();
      openModal({
        title: t("modal.signout.title"),
        content: `<p>${t("modal.signout.body")}</p>`,
        submitLabel: t("modal.signout.submit"),
        onSubmit: async () => {
          postApiData("/auth/logout").catch(() => {});
          removeSession();
          authStore.user = null;
          navigateTo("/");
        },
      });
    }

    const navLink = e.target.closest("#sidebar nav ul li a[data-link]");
    if (navLink) {
      const sidebar = document.getElementById("sidebar");
      sidebar?.setAttribute("data-collapsed", "true");
      localStorage.setItem("sidebarCollapsed", "true");
    }
  });
}
