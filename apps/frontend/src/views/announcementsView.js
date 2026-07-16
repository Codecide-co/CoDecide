import { HeaderLanding } from "@/layout/Header";
import { FooterLanding } from "@/layout/Footer";
import { fetchApiData } from "@utils/api";

export default function announcementsView() {
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
            <div class="announcement-date">${new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
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
    <main class="announcements-page">
      <h2 class="announcements-title">Official Announcements</h2>
      <p class="announcements-subtitle">Stay informed about community news and updates.</p>
      <div id="announcements-list" class="announcements-list">
        <p class="announcements-empty">Loading...</p>
      </div>
    </main>
    ${FooterLanding()}
  `;
}