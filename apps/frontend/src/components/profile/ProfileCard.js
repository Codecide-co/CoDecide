export function ProfileCard(user) {
  if (!user) return "";

  const initial = (user.name || "U")[0].toUpperCase();
  const badge = user.role === "admin"
    ? '<span class="profile-badge profile-badge-admin">Admin</span>'
    : '<span class="profile-badge profile-badge-resident">Resident</span>';

  return `
    <div class="profile-card">
      <div class="profile-card-inner">
        <div class="profile-avatar">${initial}</div>
        <h1 class="profile-name">${user.name}</h1>
        <p class="profile-email">${user.email}</p>
        ${badge}
      </div>
    </div>
  `;
}