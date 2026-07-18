import { authStore } from "@store/auth.store";
import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { fetchApiData, patchApiData, postApiData } from "@utils/api";
import { openModal } from "@components/ui/Modal";
import { ProfileCard } from "@components/profile/ProfileCard";
import { PersonalInfo } from "@components/profile/PersonalInfo";
import { ProfileReports } from "@components/profile/ProfileReports";
import { SecuritySection } from "@components/profile/SecuritySection";

export default function profileView() {
  let user = null;

  function renderSkeletons() {
    return `
      <div class="max-w-6xl mx-auto p-6">
        <div class="profile-skeleton-card"><div class="skeleton-avatar"></div>
        <div class="skeleton-line w-40 mx-auto mt-4"></div>
        <div class="skeleton-line w-60 mx-auto mt-2"></div></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div class="profile-skeleton-card"><div class="skeleton-line w-48 mb-4"></div>
          <div class="grid grid-cols-2 gap-3"><div class="skeleton-block h-16"></div>
          <div class="skeleton-block h-16"></div><div class="skeleton-block h-16"></div>
          <div class="skeleton-block h-16"></div></div></div>
          <div class="profile-skeleton-card"><div class="skeleton-line w-36 mb-4"></div>
          <div class="skeleton-block h-16 mb-3"></div>
          <div class="skeleton-block h-16 mb-3"></div></div>
        </div>
        <div class="profile-skeleton-card mt-6 h-20"></div>
      </div>
    `;
  }

  function renderContent() {
    return `
      <div class="max-w-6xl mx-auto p-6">
        ${ProfileCard(user)}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          ${PersonalInfo(user)}
          ${ProfileReports(user?.id)}
        </div>
        ${SecuritySection()}
      </div>
    `;
  }

  function bindListeners() {
    document.getElementById("btn-edit-profile")?.addEventListener("click", openEditProfileModal);
    document.getElementById("btn-change-password")?.addEventListener("click", openChangePasswordModal);
  }

  function openEditProfileModal() {
    if (!user) return;
    openModal({
      title: "Edit Profile",
      submitLabel: "Save Changes",
      content: `
        <form id="edit-profile-form">
          <div class="form-group"><label for="edit-name">Name</label><input id="edit-name" name="name" value="${user.name || ""}" required minlength="2"></div>
          <div class="form-group"><label for="edit-apartment">Apartment</label><input id="edit-apartment" name="apartment" value="${user.apartment || ""}"></div>
          <div class="form-group"><label for="edit-tower">Tower</label><input id="edit-tower" name="tower" value="${user.tower || ""}"></div>
        </form>
      `,
      onSubmit: async (formData) => {
        const updated = await patchApiData("/auth/me", formData);
        user = updated;
        authStore.user = updated;
        document.getElementById("profile-content").innerHTML = renderContent();
        bindListeners();
      },
    });
  }

  function openChangePasswordModal() {
    openModal({
      title: "Change Password",
      submitLabel: "Update Password",
      content: `
        <form id="change-password-form">
          <div class="form-group"><label for="cp-current">Current Password</label>
          <input id="cp-current" name="current_password" type="password" required></div>
          <div class="form-group"><label for="cp-new">New Password</label>
          <input id="cp-new" name="new_password" type="password" required minlength="6"></div>
          <div class="form-group"><label for="cp-confirm">Confirm New Password</label>
          <input id="cp-confirm" type="password" required minlength="6"></div>
        </form>
      `,
      onSubmit: async (formData) => {
        const confirm = document.getElementById("cp-confirm")?.value;
        if (formData.new_password !== confirm) throw new Error("Passwords do not match");
        await postApiData("/auth/change-password", {
          current_password: formData.current_password,
          new_password: formData.new_password,
        });
      },
    });
  }

  setTimeout(() => {
    fetchApiData("/auth/me")
      .then((data) => {
        user = data;
        authStore.user = data;
        const container = document.getElementById("profile-content");
        if (container) {
          container.innerHTML = renderContent();
          bindListeners();
        }
      })
      .catch(() => {
        const container = document.getElementById("profile-content");
        if (container) container.innerHTML = '<p class="text-red-500 text-center py-12">Could not load profile.</p>';
      });
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home">
        <div id="profile-content" class="flex flex-col items-center justify-center">${renderSkeletons()}</div>
      </main>
    </div>
  `;
}