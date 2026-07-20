import { authStore } from "@store/auth.store";
import { removeSession } from "@core/helpers";
import { navigateTo } from "@core/helpers";
import { postApiData } from "@core/api";
import { openModal } from "@components/ui/Modal";

export function SidebarHome() {
  const user = authStore.user;
  const currentPath = window.location.pathname;
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  const links = [
    { href: "/home", label: "Home", icon: "home.svg" },
    ...(user?.role !== "admin" ? [{ href: "/reports/create", label: "New Report", icon: "reports.svg" }] : []),
    { href: "/reports", label: "Reports", icon: "book.svg"},
    { href: "/stats", label: "Statistics", icon: "statistics.svg" },
    { href: "/home/announcements", label: "Comumnicated", icon: "comumnicated.svg" },
    { href: "/profile", label: "My Profile", icon: "user.svg" },
  ];
  if (user?.role === "admin") {
    links.push({ href: "/admin", label: "Admin Panel", icon: "setting.svg" });
  }

  return `
    <aside class="sidebar-home" id="sidebar"${isCollapsed ? ' data-collapsed="true"' : ""}>
      <nav>
        <ul>
          ${links.map((l) => `
            <li><a href="${l.href}" data-link${currentPath === l.href ? ' class="active"' : ""}><img src="/${l.icon}" alt="${l.label}"><span class="sidebar-label">${l.label}</span></a></li>
          `).join("")}
          <li><a href="#" id="sidebar-logout"><img src="/exit.svg" alt="exit"><span class="sidebar-label">Exit</span></a></li>
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
        title: "Sign Out",
        content: "<p>Are you sure you want to log out?</p>",
        submitLabel: "Sign Out",
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
