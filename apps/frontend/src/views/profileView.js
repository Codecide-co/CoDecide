import { authStore } from "@store/auth.store";
import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { navigateTo } from "@router/index";

export default function profileView() {
  const user = authStore.user;

  setTimeout(() => {
    document.getElementById("back-home-btn")?.addEventListener("click", () => {
      navigateTo("/home");
    });
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex">
      ${SidebarHome()}
      <main class="container-home flex items-start justify-center p-8">
        <div class="profile-card" style="max-width: 500px; width: 100%;">
          <div class="text-center mb-6">
            <div class="profile-avatar">
              ${(user?.name || "U")[0].toUpperCase()}
            </div>
            <h1 class="profile-name">${user?.name || "User"}</h1>
            <p class="profile-email">${user?.email || ""}</p>
          </div>
          <div class="border-t pt-4 space-y-3">
            <div class="flex justify-between">
              <span class="profile-label">Role</span>
              <span class="profile-value">${user?.role || "user"}</span>
            </div>
            <div class="flex justify-between">
              <span class="profile-label">Member since</span>
              <span class="profile-value">${user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
            </div>
          </div>
          <button id="back-home-btn" class="profile-btn">
            Back to Home
          </button>
        </div>
      </main>
    </div>
  `;
}
