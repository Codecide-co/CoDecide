export function FooterLanding() {
  return `
  <footer class="footer-landing">
    <ul class="footer-list">
      <li><a class="footer-link" href="https://facebook.com" target="_blank">Facebook</a></li>
      <li><a class="footer-link" href="https://instagram.com" target="_blank">Instagram</a></li>
      <li><a class="footer-link" href="mailto:cokedecide@gmail.com">Gmail</a></li>
    </ul>
  </footer>
`;
}

export function FooterHome() {
  return `
    <nav class="hidden md:flex bg-[var(--color-navy)] h-14 items-center justify-center">
      <ul class="flex items-center gap-8 text-sm">
        <li><a href="#" data-link class="text-slate-300 hover:text-white transition"><img src="../../public/user.svg" alt="user">User</a></li>
        <li><a href="#" data-link class="text-slate-300 hover:text-white transition"><img src="../../public/statistics.svg" alt="statistics">Statistics</a></li>
        <li><a href="#" data-link class="text-slate-300 hover:text-white transition"><img src="../../public/communicated.svg" alt="comumnicated">Communicated</a></li>
        <li><a href="/home" data-link class="text-white font-bold">CODECIDE</a></li>
        <li><a href="/reports/create" data-link class="text-slate-300 hover:text-white transition"><img src="../../public/reports.svg">Reports</a></li>
        <li><a href="#" data-link class="text-slate-300 hover:text-white transition"><img src="../../public/setting.svg" alt="setting"> Settings</a></li>
        <li><a href="#" class="text-red-300 hover:text-red-200 transition flex items-center gap-1" id="logout-btn-footer"><img src="../../public/exit.svg" alt="exit">Exit</a></li>
      </ul>
    </nav>
  `;
}