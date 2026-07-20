import { UPLOADS_BASE } from "@core/api";

export function ProfileCard(user) {
  if (!user) return "";

  const initial = (user.name || "U")[0].toUpperCase();
  const badge = user.role === "admin"
    ? '<span class="profile-badge profile-badge-admin">Admin</span>'
    : '<span class="profile-badge profile-badge-resident">Resident</span>';

  const avatarHtml = user.avatar_url
    ? `<img src="${UPLOADS_BASE}${user.avatar_url}" alt="${user.name}" class="profile-avatar-img" />`
    : `<span class="profile-avatar-initial">${initial}</span>`;

  return `
    <div class="profile-card">
      <div class="profile-card-inner">
        <div class="profile-avatar" id="profile-avatar-trigger">
          ${avatarHtml}
          <div class="profile-avatar-overlay">
            <svg class="profile-avatar-camera" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
        <h1 class="profile-name">${user.name}</h1>
        <p class="profile-email">${user.email}</p>
        ${badge}
      </div>
    </div>
  `;
}