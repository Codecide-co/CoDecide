import { authStore, logout as doLogout } from "@store/auth.store";
import { navigateTo } from "@router/index";
import { FooterHome } from "@/layout/Footer";
import { HeaderHome } from "@/layout/Header";

export default function homeView() {
  const user = authStore.user;

  setTimeout(() => {
    document.getElementById("logout-btn")?.addEventListener("click", () => {
      doLogout();
      navigateTo("/");
    });
    document.getElementById("logout-btn-footer")?.addEventListener("click", () => {
      doLogout();
      navigateTo("/");
    });
  }, 0);

  return `
    ${HeaderHome()}
    <main class="container-home pb-24 flex flex-col justify-center items-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">

        <!-- WELCOME - full width -->
        <section class="home-welcome md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2>Hi, ${user?.name || 'User'}!</h2>
            <p class="mt-2 max-w-xl">
              Welcome to CoDecide. Here you can report issues, 
              track their progress, and get involved in your 
              community.
            </p>
          </div>
          <a href="/reports/create" data-link class="home-cta-btn">+ New Report</a>
        </section>

        <!-- REPORTS - left column, spans both rows -->
        <section class="home-card md:row-span-2">
          <h3 class="home-section-title">Reports</h3>
          <div id="reports-content" class="space-y-2">

            

          </div>
        </section>

        <!-- STATS - right top -->
        <section class="home-card">
          <h3 class="home-section-title">Community Summary</h3>
          <div id="stats-content" class="grid grid-cols-2 gap-3">
            <div class="home-stat-card">
              <div class="home-stat-value">—</div>
              <div class="home-stat-label">Total Reports</div>
            </div>
            <div class="home-stat-card">
              <div class="home-stat-value">—</div>
              <div class="home-stat-label">Resolved</div>
            </div>
            <div class="home-stat-card">
              <div class="home-stat-value">—</div>
              <div class="home-stat-label">In Progress</div>
            </div>
            <div class="home-stat-card">
              <div class="home-stat-value">—</div>
              <div class="home-stat-label">Pending</div>
            </div>
          </div>
        </section>

        <!-- COMUNICADOS - right bottom -->
        <section class="home-card">
          <h3 class="home-section-title">Official Announcements</h3>
          <div id="comunicados-content" class="grid grid-cols-1 gap-3">

            <div class="home-communicado-item">
              <div class="home-communicado-date"> EXAMPLE: 15 Jul 2026</div>
              <div class="home-communicado-title">Nueva actualización de la plataforma</div>
              <p class="home-communicado-desc">Hemos mejorado el sistema de notificaciones para mantenerte informado.</p>
            </div>
            
            <div class="home-communicado-item">
              <div class="home-communicado-date"> EXAMPLE: 10 Jul 2026</div>
              <div class="home-communicado-title"> Mantenimiento programado</div>
              <p class="home-communicado-desc">El sistema estará en mantenimiento el próximo sábado de 2:00 AM a 4:00 AM.</p>
            </div>

          </div>
        </section>

      </div>
    </main>
    ${FooterHome()}
  `;
}