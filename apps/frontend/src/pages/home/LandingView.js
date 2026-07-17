import { HeaderLanding } from "@layout/Header";
import { FooterLanding } from "@layout/Footer";

export function LandingView() {
return`
    ${HeaderLanding()}
    <main>  
        <!-- HERO -->
        <section class="landing-hero flex flex-row items-center">
            <div class="hero-bg-carousel">
                <img class="hero-bg-img" src="/cartagena1-landing-page.png" alt="Cartagena">
                <img class="hero-bg-img" src="/barranquilla-lading-page.jpeg" alt="Barranquilla">
                <img class="hero-bg-img" src="/bogota-lading-page.jpeg" alt="Bogotá">
                <img class="hero-bg-img" src="/cali-landing-page.png" alt="Cali">
                <img class="hero-bg-img" src="/cartagena2-lading-page.png" alt="Cartagena">
                <img class="hero-bg-img" src="/medellin-lading-page.png" alt="Medellín">
            </div>
            <article class="landing-hero-content">
                <h1 class="landing-hero-title">
                    BUILD A <br> STRONGER <br> <span class="landing-hero-accent">COMMUNITY</span>
                </h1>
                <p class="landing-hero-desc">
                    From damaged roads to public safety concerns, CoDecide helps citizens report issues, monitor updates, and drive positive change together.
                </p>
                <div class="hero-buttons">
                    <a class="link-report-issue" href="/login" data-link>Report an Issue</a> 
                    <a class="link-explore-report" href="#explore-reports" data-link>Explore Reports</a>
                </div>
            </article>
        </section>

        <!-- VIEW EXPLORE REPORTS -->
        <section class="landing-explore">
            <div class="landing-explore-container">

                <article class="landing-explore-carousel">
                    <h3 class="landing-explore-label">Report Cards</h3>
                    <div class="landing-explore-viewport">
                    <div class="landing-report-cards">
                    <div class="landing-report-card">
                        <span class="landing-report-card-icon">🛣️</span>
                        <h4 class="landing-report-card-title">Pothole on Maple Street</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Infrastructure</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>In Progress</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Maple Street, Downtown</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>Large pothole affecting traffic and creating a safety risk for drivers and cyclists.</p>
                        </div>
                    </div>

                    <div class="landing-report-card">
                        <span class="landing-report-card-icon">💡</span>
                        <h4 class="landing-report-card-title">Broken Street Light</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Safety</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>Resolved</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Oak Avenue</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>Street light repaired after multiple community reports improved nighttime visibility.</p>
                        </div>
                    </div>

                    <div class="landing-report-card">
                        <span class="landing-report-card-icon">🌳</span>
                        <h4 class="landing-report-card-title">Fallen Tree Blocking Sidewalk</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Environment</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>Pending</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Central Park Entrance</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>A fallen tree is preventing pedestrians and wheelchair users from accessing the sidewalk.</p>
                        </div>
                    </div>

                    <!-- duplicated set so the animation loops without a visible jump -->
                    <div class="landing-report-card" aria-hidden="true">
                        <span class="landing-report-card-icon">🛣️</span>
                        <h4 class="landing-report-card-title">Pothole on Maple Street</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Infrastructure</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>In Progress</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Maple Street, Downtown</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>Large pothole affecting traffic and creating a safety risk for drivers and cyclists.</p>
                        </div>
                    </div>

                    <div class="landing-report-card" aria-hidden="true">
                        <span class="landing-report-card-icon">💡</span>
                        <h4 class="landing-report-card-title">Broken Street Light</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Safety</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>Resolved</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Oak Avenue</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>Street light repaired after multiple community reports improved nighttime visibility.</p>
                        </div>
                    </div>

                    <div class="landing-report-card" aria-hidden="true">
                        <span class="landing-report-card-icon">🌳</span>
                        <h4 class="landing-report-card-title">Fallen Tree Blocking Sidewalk</h4>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Category</h5>
                            <p>Environment</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Status</h5>
                            <p>Pending</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Location</h5>
                            <p>Central Park Entrance</p>
                        </div>
                        <div class="landing-report-card-field">
                            <h5 class="landing-report-card-label">Description</h5>
                            <p>A fallen tree is preventing pedestrians and wheelchair users from accessing the sidewalk.</p>
                        </div>
                    </div>
                    </div>
                    </div>
                </article>

                <article class="landing-explore-info">
                    <h2 class="landing-explore-title">
                    Explore <br> <span class="landing-explore-accent">Reports</span> 
                    </h2>
                    <div class="landing-explore-textbox">
                        <p class="landing-explore-subtitle">
                            See how citizens are making a difference 
                            by reporting issues in their communities. 
                            Browse real examples of ongoing and 
                            resolved reports.
                        </p>
                    </div>
                </article>

            </div>
        </section>

        <!-- VIEW HOW IT WORKS -->
        <section class="landing-how">
            <h1 class="landing-how-title">How It Works</h1>
            <p class="landing-how-subtitle">
                Discover how CoDecide helps communities identify,
                track, and resolve local issues through collaboration.
            </p>

            <div class="tl-container">
                <input type="radio" name="tl" id="tl1" checked hidden>
                <input type="radio" name="tl" id="tl2" hidden>
                <input type="radio" name="tl" id="tl3" hidden>
                <input type="radio" name="tl" id="tl4" hidden>

                <div class="tl-arc">
                    <svg class="tl-arc-svg" viewBox="0 0 860 190" preserveAspectRatio="xMidYMid meet">
                        <path class="tl-arc-bg" d="M 30 180 Q 430 15 830 180" fill="none" stroke="#DBEAFE" stroke-width="4" stroke-linecap="round"/>
                        <path class="tl-arc-fill" d="M 30 180 Q 430 15 830 180" fill="none" stroke="url(#tlGrad)" stroke-width="4" stroke-linecap="round"/>
                        <defs>
                            <linearGradient id="tlGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stop-color="#2563EB"/>
                                <stop offset="100%" stop-color="#60A5FA"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <label class="tl-step" for="tl1" data-step="1">
                        <span class="tl-num">1</span>
                        <span class="tl-lbl">Report</span>
                    </label>
                    <label class="tl-step" for="tl2" data-step="2">
                        <span class="tl-num">2</span>
                        <span class="tl-lbl">Engage</span>
                    </label>
                    <label class="tl-step" for="tl3" data-step="3">
                        <span class="tl-num">3</span>
                        <span class="tl-lbl">Track</span>
                    </label>
                    <label class="tl-step" for="tl4" data-step="4">
                        <span class="tl-num">4</span>
                        <span class="tl-lbl">Improve</span>
                    </label>
                </div>

                <div class="tl-cards">
                    <div class="tl-card" data-step="1">
                        <div class="tl-card-icon tl-card-icon--blue">
                            <svg fill="#2563EB" viewBox="0 0 52 52"><g><path d="M31.4,15.3h8.2c0.6,0,1.1-0.5,1.1-1.1l0,0c0-0.3-0.1-0.5-0.3-0.8L30.2,3.3C29.9,3.1,29.7,3,29.4,3l0,0 c-0.6,0-1.1,0.5-1.1,1.1v8.1C28.3,13.9,29.7,15.3,31.4,15.3z"/><path d="M49.5,25.7l-0.9-0.9c-0.6-0.6-1.5-0.6-2.2,0L34.5,36.7c-0.1,0.1,0,0.2,0,0.3v2.5c0,0.2,0,0.4,0.2,0.4h2.6 c0.1,0,0.2-0.1,0.3-0.1L49.5,28C50.2,27.2,50.2,26.3,49.5,25.7z"/><path d="M39.9,44.4h-1.8h-3.6h-1.7c-1.6,0-2.9-1.3-2.9-2.9v-5.4c0-0.8,0.2-1.6,0.9-2.1l9.5-9.5 c0.3-0.3,0.5-0.7,0.5-1.1v-2c0-0.8-0.7-1.5-1.5-1.5H28.3c-2.6,0-4.6-2.1-4.6-4.6V4.5C23.7,3.7,23,3,22.1,3H6.6C4.1,3,2,5.1,2,7.6 v36.8C2,46.9,4.1,49,6.6,49h29.4c2.2,0,4.2-1.6,4.6-3.7C40.7,44.9,40.3,44.4,39.9,44.4z M8.2,16.8c0-0.8,0.7-1.5,1.5-1.5h6.2 c0.9,0,1.5,0.7,1.5,1.5v1.5c0,0.8-0.7,1.5-1.5,1.5H9.7c-0.9,0-1.5-0.7-1.5-1.5V16.8z M23.7,36.7c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5v-1.5c0-0.8,0.7-1.5,1.5-1.5h12.4c0.9,0,1.5,0.7,1.5,1.5V36.7z M26.8,27.5c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5V26c0-0.8,0.7-1.5,1.5-1.5h15.5c0.9,0,1.5,0.7,1.5,1.5V27.5z"/></g></svg>
                        </div>
                        <h3 class="tl-card-title">1. Report an Issue</h3>
                        <p class="tl-card-desc">
                            Describe the problem, add a location, and upload photos to help your community understand the situation.
                        </p>
                    </div>
                    <div class="tl-card" data-step="2">
                        <div class="tl-card-icon tl-card-icon--orange">
                            <svg fill="#EA580C" viewBox="0 0 1000 1000"><path d="M323 816q11-18 25-40-22-35-55-85-3-4-7-7-1-1-.5-2t1.5-2q32-15 51-46-15-32-15-68 0-29 10-56-22-30-57.5-41.5t-71 0-57 41.5-21.5 67q0 33 19 61t49 42q1 1 1 2t-1 2q-4 3-6 7-44 65-66 102-9 15-9 25 0 21 37.5 36t89.5 15q34 0 68-8 1-20 15-45zm323 18q-28-48-81-126-3-5-8-9-1-1-1-2.5t2-2.5q37-18 60.5-52.5T642 566q0-38-19.5-70.5t-52-51.5-71-19-71 19-51.5 51.5-19 70.5q0 41 23.5 75.5T442 694q2 0 2 1.5t-1 2.5q-5 5-9 10-53 79-80 126-11 19-11 31 0 17 21 31.5t57 23 79 8.5 79-8.5 57-23 21-31.5q0-12-11-31zm206-672h-36v70q0 29-20.5 49.5T746 302H348v8q1 12 10 20t21 8h328l69 68q4 5 9.5 2.5t5.5-8.5l-4-62h65q13 0 22.5-9t9.5-23V194q0-13-9.5-22.5T852 162zM746 99H147q-13 0-22 9t-9 22v102q0 12 9 21.5t22 9.5h66l-13 83q-1 6 4.5 8.5t9.5-1.5l92-90h440q13 0 22-9t9-22V130q0-13-9-22t-22-9zm132 694q-23-39-65-102-3-4-7-7-1-1-1-2t1-2q30-14 49-42t19-61q0-37-22-67t-57-41.5-70.5 0T668 510q9 27 9 56 0 36-15 68 19 30 51 46 1 1 1.5 2t-.5 2q-4 3-7 7-34 51-55 85 14 22 25 40 14 25 15 45 34 8 68 8 52 0 89.5-15t37.5-36q0-10-9-25z"/></svg>
                        </div>
                        <h3 class="tl-card-title">2. Community Engagement</h3>
                        <p class="tl-card-desc">
                            Citizens can support reports, share feedback, and help prioritize the issues that matter most to their neighborhood.
                        </p>
                    </div>
                    <div class="tl-card" data-step="3">
                        <div class="tl-card-icon tl-card-icon--blue">
                            <svg viewBox="0 0 36 36" fill="#2563EB"><circle fill="#2563EB" cx="18" cy="18" r="18"/><circle fill="#f0f9ff" cx="18" cy="18" r="14"/><path fill="#2563EB" d="M19 18a1 1 0 1 1-2 0V7a1 1 0 0 1 2 0v11z"/><path fill="#2563EB" d="M26.66 23a.998.998 0 0 1-1.365.367l-7.795-4.5a.999.999 0 1 1 1-1.732l7.795 4.5A.998.998 0 0 1 26.66 23z"/></svg>
                        </div>
                        <h3 class="tl-card-title">3. Track Progress</h3>
                        <p class="tl-card-desc">
                            Follow every update from submission to resolution and stay informed about improvements in your neighborhood.
                        </p>
                    </div>
                    <div class="tl-card" data-step="4">
                        <div class="tl-card-icon tl-card-icon--orange">
                            <svg fill="#EA580C" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12,23 C6,20.3270758 3,17.6604092 3,15 L3,5 C3,4 3.5,4 5,3 C5.16179337,2.89213775 8.56320917,1 12,1 C14.9952495,1 17.5,2 19,3 C20.5,4 21,4 21,5 C21.0264318,5.29131477 21,13.5 21,15 C21,17.6666667 18,20.3333333 12,23 Z M19,15 C19,14.7696854 19.0005911,14.3838015 19.0018395,13.7546873 C19.002442,13.4510385 19.0036756,12.8625961 19.0058778,11.801424 C19.0071585,11.1695166 19.0081782,10.6272502 19.0090335,10.1097828 C19.0127226,7.87763814 19.0117352,5.96181826 19.0095779,5.36928408 C18.6788452,5.1638246 18.1627209,4.84551481 17.8905996,4.66410059 C16.4143231,3.67991623 14.2601784,3 12,3 C9.8380869,3 7.02863525,4.05127735 6.10940039,4.66410059 C5.83989194,4.84377289 5.33104387,5.15772448 5,5.3633347 L5,15 C5,16.5084521 7.22911083,18.568744 12.000926,20.8019938 C16.7721586,18.5737351 19,16.5142377 19,15 Z M11,12.5857864 L15.2928932,8.29289322 L16.7071068,9.70710678 L11,15.4142136 L7.29289322,11.7071068 L8.70710678,10.2928932 L11,12.5857864 Z"/></svg>
                        </div>
                        <h3 class="tl-card-title">4. Improve Together</h3>
                        <p class="tl-card-desc">
                            Together, create a cleaner, safer, and stronger community. Every report brings positive change.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- VIEW LET'S LIVE TO ACTION -->
        <section class="landing-action">
            <h2 class="landing-action-title">Let's live to action</h2>
            <div class="landing-action-carousel">
                <div class="landing-action-card landing-action-card--blue">
                    <div class="landing-action-card-icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 class="landing-action-card-title">Report with Confidence</h3>
                    <p class="landing-action-card-desc">
                        Submit detailed reports with photos and locations. Your voice becomes the first step toward real community change.
                    </p>
                </div>
                <div class="landing-action-card landing-action-card--orange">
                    <div class="landing-action-card-icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
                    </div>
                    <h3 class="landing-action-card-title">Community Voices Matter</h3>
                    <p class="landing-action-card-desc">
                        Engage with your neighbors by supporting reports and sharing feedback. Together we prioritize what matters most for our community.
                    </p>
                </div>
                <div class="landing-action-card landing-action-card--gradient">
                    <div class="landing-action-card-icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
                    </div>
                    <h3 class="landing-action-card-title">Start Making a Difference</h3>
                    <p class="landing-action-card-desc">
                        Join CoDecide today and help build a safer, smarter, and more connected community. Every action counts.
                    </p>
                    <a class="landing-action-btn" href="/login" data-link>Get Started</a>
                </div>
            </div>
        </section>

        <!-- VIEW ABOUT US -->
        <section class="landing-about">
            <input type="radio" name="ac" id="ac-none" checked hidden>
            <input type="radio" name="ac" id="ac-1" hidden>
            <input type="radio" name="ac" id="ac-2" hidden>
            <input type="radio" name="ac" id="ac-3" hidden>
            <input type="radio" name="ac" id="ac-4" hidden>
            <input type="radio" name="ac" id="ac-5" hidden>

            <div class="about-layout">
                <div class="about-left">
                    <span class="about-letra">A</span>
                    <span class="about-letra">B</span>
                    <span class="about-letra">O</span>
                    <span class="about-letra">U</span>
                    <span class="about-letra">T</span>
                </div>

                <div class="about-right">
                    <div class="about-us-wrap">
                        <span class="about-u-letter">U</span>
                        <span class="about-s-letter">S</span>
                    </div>

                    <div class="about-wave-box">
                        <svg class="about-wave-svg" viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
                            <path class="about-wave-bg" d="M 20 30 C 100 30, 100 130, 190 130 C 280 130, 280 230, 370 230 C 420 230, 420 300, 460 300" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" stroke-linecap="round"/>
                            <path class="about-wave-fill" d="M 20 30 C 100 30, 100 130, 190 130 C 280 130, 280 230, 370 230 C 420 230, 420 300, 460 300" fill="none" stroke="url(#awGrad)" stroke-width="3" stroke-linecap="round"/>
                            <path class="about-wave-glow" d="M 20 30 C 100 30, 100 130, 190 130 C 280 130, 280 230, 370 230 C 420 230, 420 300, 460 300" fill="none" stroke="url(#awGrad)" stroke-width="8" stroke-linecap="round" opacity="0.15"/>
                            <defs>
                                <linearGradient id="awGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#2563EB"/>
                                    <stop offset="50%" stop-color="#60A5FA"/>
                                    <stop offset="100%" stop-color="#EA580C"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        <label class="about-dot" for="ac-1" data-a="1">
                            <span class="about-dot-ring"></span>
                            <span class="about-dot-label">Mission</span>
                        </label>
                        <label class="about-dot" for="ac-2" data-a="2">
                            <span class="about-dot-ring"></span>
                            <span class="about-dot-label">Vision</span>
                        </label>
                        <label class="about-dot" for="ac-3" data-a="3">
                            <span class="about-dot-ring"></span>
                            <span class="about-dot-label">Objective</span>
                        </label>
                        <label class="about-dot" for="ac-4" data-a="4">
                            <span class="about-dot-ring"></span>
                            <span class="about-dot-label">Values</span>
                        </label>
                        <label class="about-dot" for="ac-5" data-a="5">
                            <span class="about-dot-ring"></span>
                            <span class="about-dot-label">Branding</span>
                        </label>
                    </div>

                    <div class="about-cards-box">
                        <div class="about-card" data-a="1">
                            <label class="about-card-x" for="ac-none">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </label>
                            <div class="about-card-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>
                            </div>
                            <h3 class="about-card-title">Our Mission</h3>
                            <p class="about-card-text">
                                Empower every citizen with the tools to report, track, and resolve community issues. We bridge the gap between people and local authorities through transparency and collaboration.
                            </p>
                        </div>

                        <div class="about-card" data-a="2">
                            <label class="about-card-x" for="ac-none">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </label>
                            <div class="about-card-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </div>
                            <h3 class="about-card-title">Our Vision</h3>
                            <p class="about-card-text">
                                To become the trusted platform that strengthens communication between communities and local organizations, inspiring collaboration and lasting positive impact in every neighborhood.
                            </p>
                        </div>

                        <div class="about-card" data-a="3">
                            <label class="about-card-x" for="ac-none">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </label>
                            <div class="about-card-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                            </div>
                            <h3 class="about-card-title">Our Objective</h3>
                            <p class="about-card-text">
                                Connect citizens with their communities, simplify issue reporting, and drive meaningful change. We turn everyday concerns into real solutions through participation.
                            </p>
                        </div>

                        <div class="about-card" data-a="4">
                            <label class="about-card-x" for="ac-none">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </label>
                            <div class="about-card-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                            </div>
                            <h3 class="about-card-title">Core Values</h3>
                            <div class="about-card-values">
                                <div class="about-val"><strong>Transparency</strong><span>Every report visible, traceable, accountable</span></div>
                                <div class="about-val"><strong>Collaboration</strong><span>Working together toward shared goals</span></div>
                                <div class="about-val"><strong>Community</strong><span>Every voice matters, every contribution counts</span></div>
                                <div class="about-val"><strong>Innovation</strong><span>Tech-driven civic participation</span></div>
                            </div>
                        </div>

                        <div class="about-card" data-a="5">
                            <label class="about-card-x" for="ac-none">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </label>
                            <div class="about-card-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>
                            </div>
                            <h3 class="about-card-title">Our Branding</h3>
                            <p class="about-card-text">
                                CoDecide represents community-driven change. Our identity reflects transparency, innovation, and civic participation — built on trust and collaboration for stronger neighborhoods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

${FooterLanding()}
`
}