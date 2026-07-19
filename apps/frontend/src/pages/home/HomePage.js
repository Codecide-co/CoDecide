import { authStore } from "@store/auth.store";
import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { fetchMyReports } from "@services/reports.service";
import { fetchApiData, UPLOADS_BASE } from "@core/api";

export function HomePageView() {
  const user = authStore.user;

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home flex flex-row items-center justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">

          <section class="home-welcome md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2>Hi, ${user?.name || "User"}!</h2>
              <p class="mt-2 max-w-xl">
                Welcome to CoDecide. Here you can report issues, 
                track their progress, and get involved in your 
                community.
              </p>
            </div>
            <div class="flex gap-3 flex-wrap">
              <a href="/reports/create" data-link class="home-cta-btn">+ New Report</a>
              <a href="/reports" data-link class="home-cta-btn">View All Reports</a>
            </div>
          </section>

          <section class="home-card md:row-span-2">
            <h3 class="home-section-title">My Recent Reports</h3>
            <div id="reports-content" class="space-y-2">
              <p class="text-slate-400 text-sm text-center py-8">Loading...</p>
            </div>
          </section>

          <section class="home-card">
            <h3 class="home-section-title">Community Summary</h3>
            <div class="grid grid-cols-2 gap-3">
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

          <section class="home-card">
            <h3 class="home-section-title">Official Announcements</h3>
            <div id="comunicados-content" class="grid grid-cols-1 gap-3">
              <p class="text-slate-400 text-sm text-center py-8">Loading...</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  `;
}

export function initHomePage() {
  const user = authStore.user;

  if (user?.id) {
    fetchMyReports(user.id)
      .then((reports) => {
        const container = document.getElementById("reports-content");
        if (!container) return;
        if (!reports || reports.length === 0) {
          container.innerHTML = `<p class="text-slate-400 text-sm text-center py-8">No reports yet. Create your first one!</p>`;
          return;
        }
        container.innerHTML = reports
          .map(
            (r) => `
          <div class="home-report-item">
            <div class="home-report-img">
              <div class="home-report-img-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="home-report-body">
              <div class="home-report-header">
                <span class="home-report-title">${r.title}</span>
                <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
              </div>
              <span class="home-report-id">#${r.tracking_number || r.id}</span>
              ${r.is_anonymous ? `<span class="anonymous-badge">Anonymous<span class="anonymous-tooltip">The author&#39;s identity is hidden for this report.</span></span>` : ""}
            </div>
          </div>
        `,
          )
          .join("");

        reports.forEach((r) => {
          fetchApiData(`/reports/${r.id}`)
            .then((detail) => {
              const items = container.querySelectorAll(".home-report-item");
              const item = Array.from(items).find(el => el.querySelector(".home-report-title")?.textContent === r.title);
              if (!item) return;
              const imgContainer = item.querySelector(".home-report-img");
              if (!imgContainer) return;

              if (detail.attachments?.[0]?.file_url) {
                imgContainer.innerHTML = `<img src="${UPLOADS_BASE}${detail.attachments[0].file_url}" alt="" loading="lazy" onerror="this.onerror=null;this.style.display='none'">`;
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => {
        document.getElementById("reports-content").innerHTML =
          `<p class="text-slate-400 text-sm text-center py-8">Could not load reports.</p>`;
      });
  }

  fetchApiData("/stats")
    .then((stats) => {
      const values = document.querySelectorAll(".home-stat-value");
      if (values.length >= 4) {
        values[0].textContent = stats.total_reports ?? "—";
        values[1].textContent = stats.by_status?.resolved ?? "—";
        values[2].textContent = stats.by_status?.in_progress ?? "—";
        values[3].textContent = stats.by_status?.open ?? "—";
      }
    })
    .catch(() => {});

  fetchApiData("/comunicados")
    .then((comunicados) => {
      const container = document.getElementById("comunicados-content");
      if (!container || !comunicados || comunicados.length === 0) return;
      container.innerHTML = comunicados
        .map(
          (c) => `
        <div class="home-communicado-item">
          <div class="home-communicado-date">${new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
          <div class="home-communicado-title">${c.title}</div>
          <p class="home-communicado-desc">${c.body}</p>
        </div>
      `,
        )
        .join("");
    })
    .catch(() => {});
}
