import { authStore } from "@store/auth.store";
import { removeSession } from "@core/helpers";
import { navigateTo } from "@core/helpers";

export function SidebarHome() {
  const user = authStore.user;
  const currentPath = window.location.pathname;
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  setTimeout(() => {
    document
      .getElementById("sidebar-logout")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        removeSession();
        authStore.user = null;
        navigateTo("/");
      });

    const sidebar = document.getElementById("sidebar");

    document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
      const nowCollapsed = sidebar?.getAttribute("data-collapsed") === "true";
      const next = !nowCollapsed;
      sidebar?.toggleAttribute("data-collapsed", next);
      localStorage.setItem("sidebarCollapsed", String(next));
    });

    document.querySelectorAll("#sidebar nav ul li a[data-link]").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar?.setAttribute("data-collapsed", "true");
        localStorage.setItem("sidebarCollapsed", "true");
      });
    });
  }, 0);

  const links = [
    { href: "/home", label: "Home", icon: "home.svg" },
    { href: "/reports/create", label: "New Report", icon: "reports.svg" },
    { href: "/reports", label: "Reports", icon: "reports.svg", icon: "book.svg"},
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
