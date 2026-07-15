export function HeaderLanding() {
  return `
  <header class="header-landing flex flex-row justify-between">
    <div>
      <a id="btn-home" class="header-logo" href="/" data-link>CoDecide</a>
    </div>
    <nav class="hidden md:flex">
      <ul class="header-nav-list flex flex-row justify-around">
        <li><a class="header-nav-link" href="#explore-reports" data-link>Explore Reports</a></li>
        <li><a class="header-nav-link" href="#how-it-works" data-link>How It Works</a></li>
        <li><a class="header-nav-link" href="#about-us" data-link>About Us</a></li>
        <li><a class="header-nav-link header-nav-cta" href="/login" data-link>Login</a></li>
      </ul>
    </nav>
  </header>
`;
}

export function HeaderHome() {
  return`
  <header class="header-home flex flex-row justify-between items-center p-6">
    <a id="button-home" class="header-logo" href="/" data-link>CoDecide</a>
    <a id="button-notification" class="notification-logo" href="/" data-link>🔔</a>
  </header>
  `
}