import { authStore, logout as doLogout } from "@store/auth.store";
import { navigateTo } from "@router/index";

export function SidebarHome() {
  const user = authStore.user;

  setTimeout(() => {
    document
      .getElementById("sidebar-logout")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        doLogout();
        navigateTo("/");
      });
    if (localStorage.getItem("sidebarCollapsed") === "true") {
      document.querySelector(".auth-layout")?.classList.add("collapsed");
    }

    document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
      const layout = document.querySelector(".auth-layout");
      layout?.classList.toggle("collapsed");
      localStorage.setItem(
        "sidebarCollapsed",
        layout?.classList.contains("collapsed"),
      );
    });
  }, 0);

  return `
    <aside class="sidebar-home" id="sidebar">
      <nav>
        <ul>
          <li><a href="/home" data-link><img src="../../public/home.svg" alt="home">Home</a></li>
          <li><a href="/reports/create" data-link><img src="../../public/reports.svg" alt="report">New Report</a></li>
          <li><a href="/stats" data-link><img src="../../public/statistics.svg" alt="statistics">Statistics</a></li>
          <li><a href="/announcements" data-link><img src="../../public/comumnicated.svg" alt="comumnicated">Comumnicated</a></li>          <li><a href="/profile" data-link><img src="../../public/user.svg" alt="user">My Profile</a></li>
          ${user?.role === "admin" ? '<li><a href="/admin" data-link><img src="../../public/setting.svg" alt="admin">Admin Panel</a></li>' : ''}
          <li><a href="#" id="sidebar-logout"><img src="../../public/exit.svg" alt="exit">Exit</a></li>
        </ul>
      </nav>
    </aside>
  `;
}
