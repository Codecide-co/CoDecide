import { HeaderLanding } from "@/layouts/Header";
import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { FooterLanding } from "@/layouts/Footer";
import { fetchApiData } from "@core/api";
import { formatDate } from "@core/helpers";
import { showAnnouncementModal } from "@components/ui/AnnouncementModal";

export function AnnouncementsPageView() {
  setTimeout(() => {
    fetchApiData("/comunicados")
      .then((list) => {
        const container = document.getElementById("announcements-list");
        if (!container) return;
        if (!list || list.length === 0) {
          container.innerHTML = `<p class="announcements-empty">No announcements yet.</p>`;
          return;
        }
        container.innerHTML = list
          .map(
            (a) => `
          <article class="announcement-card">
            <div class="announcement-date">${formatDate(a.created_at, "long")}</div>
            <h3 class="announcement-title">${a.title}</h3>
            <p class="announcement-body">${a.body}</p>
            <span class="announcement-author">— ${a.author_name || "Administration"}</span>
          </article>
        `
          )
          .join("");
      })
      .catch(() => {
        document.getElementById("announcements-list").innerHTML =
          `<p class="announcements-empty">Could not load announcements.</p>`;
      });
  }, 0);

  return `
    ${HeaderLanding()}
    <main class="announcements-page pt-24 md:pt-32 px-8 pb-16">
      <h2 class="announcements-title">Official Announcements</h2>
      <p class="announcements-subtitle">Stay informed about community news and updates.</p>
      <div id="announcements-list" class="announcements-list announcements-carousel">
        <p class="announcements-empty">Loading...</p>
      </div>
    </main>
    ${FooterLanding()}
  `;
}

export function HomeAnnouncementsView() {
  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home container-home--announcements">
        <section class="announcements-page announcements-page--home">
          <h2 class="announcements-title">Official Announcements</h2>
          <p class="announcements-subtitle">Stay informed about community news and updates.</p>
          <div class="announcements-scroll">
            <div id="announcements-list" class="announcements-list">
              <p class="announcements-empty">Loading...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

export function initHomeAnnouncements() {
  fetchApiData("/comunicados")
    .then((list) => {
      const container = document.getElementById("announcements-list");
      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = `<p class="announcements-empty">No announcements yet.</p>`;
        return;
      }
      container.innerHTML = list
        .map(
          (a, i) => `
            <div class="home-announcement-item">
              <span class="home-announcement-date">${formatDate(a.created_at, "medium")}</span>
              <span class="home-announcement-title">${a.title}</span>
              <button class="home-announcement-read-more" data-index="${i}">Read More</button>
            </div>
          `
        )
        .join("");

      container.querySelectorAll(".home-announcement-read-more").forEach((btn) => {
        btn.addEventListener("click", () => {
          showAnnouncementModal(list[btn.dataset.index]);
        });
      });
    })
    .catch(() => {
      const el = document.getElementById("announcements-list");
      if (el) el.innerHTML = `<p class="announcements-empty">Could not load announcements.</p>`;
    });
}