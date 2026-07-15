export function viewHeroLogin() {
  return `
  <section class="auth-hero-section hidden md:flex flex-col">
    <div class="auth-hero-info">
      <span class="auth-hero-tag">Community · Transparency · Participation</span>
      <h2 class="auth-hero-info-title">Your community, <br> your voice.</h2>
      <p class="auth-hero-info-desc">Report incidents, vote on your community's priorities, and stay informed...</p>
    </div>
    <div class="auth-hero-features">
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">Report</h3>
          <p class="auth-hero-feature-desc">Create reports quickly and easily.</p>
        </div>
      </div>
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">Participate</h3>
          <p class="auth-hero-feature-desc">Vote for the issues that need the most attention.</p>
        </div>
      </div>
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">Track Progress</h3>
          <p class="auth-hero-feature-desc">Check the status of every report in real time.</p>
        </div>
      </div>
    </div>
  </section>
`;
}