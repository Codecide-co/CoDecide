import { HeaderLanding } from "@layout/Header";
import { FooterLanding } from "@layout/Footer";

export function LandingView() {
return`
    ${HeaderLanding()}
    <main>  
        <!-- HERO -->
        <section class="landing-hero flex flex-row items-center">
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
            <h2 class="landing-explore-title">Explore Reports</h2>
            <p class="landing-explore-subtitle">
                See how citizens are making a difference 
                by reporting issues in their communities. 
                Browse real examples of ongoing and 
                resolved reports.
            </p>

            <article>
                <h3 class="landing-explore-label">Report Cards</h3>
                <div class="landing-report-cards">
                <div class="landing-report-card">
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
            </article>
        </section>

        <!-- VIEW HOW IT WORKS -->
        <section class="landing-how">
            <article class="landing-how-desc">
                <h1 class="landing-how-title">How It Works</h1>
                <div>
                    <p class="landing-how-subtitle">
                        Discover how CoDecide helps communities identify,
                        track, and resolve local issues through collaboration.
                    </p>
                </div>
            </article>
            
            <article class="landing-how-items">
                <div class="landing-how-item" data-step="1">
                    <svg fill="#3a6688" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve" stroke="#3a6688"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M31.4,15.3h8.2c0.6,0,1.1-0.5,1.1-1.1l0,0c0-0.3-0.1-0.5-0.3-0.8L30.2,3.3C29.9,3.1,29.7,3,29.4,3l0,0 c-0.6,0-1.1,0.5-1.1,1.1v8.1C28.3,13.9,29.7,15.3,31.4,15.3z"></path> <path d="M49.5,25.7l-0.9-0.9c-0.6-0.6-1.5-0.6-2.2,0L34.5,36.7c-0.1,0.1,0,0.2,0,0.3v2.5c0,0.2,0,0.4,0.2,0.4h2.6 c0.1,0,0.2-0.1,0.3-0.1L49.5,28C50.2,27.2,50.2,26.3,49.5,25.7z"></path> <path d="M39.9,44.4h-1.8h-3.6h-1.7c-1.6,0-2.9-1.3-2.9-2.9v-5.4c0-0.8,0.2-1.6,0.9-2.1l9.5-9.5 c0.3-0.3,0.5-0.7,0.5-1.1v-2c0-0.8-0.7-1.5-1.5-1.5H28.3c-2.6,0-4.6-2.1-4.6-4.6V4.5C23.7,3.7,23,3,22.1,3H6.6C4.1,3,2,5.1,2,7.6 v36.8C2,46.9,4.1,49,6.6,49h29.4c2.2,0,4.2-1.6,4.6-3.7C40.7,44.9,40.3,44.4,39.9,44.4z M8.2,16.8c0-0.8,0.7-1.5,1.5-1.5h6.2 c0.9,0,1.5,0.7,1.5,1.5v1.5c0,0.8-0.7,1.5-1.5,1.5H9.7c-0.9,0-1.5-0.7-1.5-1.5V16.8z M23.7,36.7c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5v-1.5c0-0.8,0.7-1.5,1.5-1.5h12.4c0.9,0,1.5,0.7,1.5,1.5V36.7z M26.8,27.5c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5V26c0-0.8,0.7-1.5,1.5-1.5h15.5c0.9,0,1.5,0.7,1.5,1.5V27.5z"></path> </g> </g></svg>                    
                    <span class="landing-how-item-title">1. Report an Issue</span>
                    <p class="landing-how-item-desc">
                        Describe the problem, add a location, 
                    and upload photos to help your community 
                    understand the situation. 
                    </p>
                </div>

                <div class="landing-how-item" data-step="2">
                    <svg fill="#3a6688" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" stroke="#3a6688"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M323 816q11-18 25-40-22-35-55-85-3-4-7-7-1-1-.5-2t1.5-2q32-15 51-46-15-32-15-68 0-29 10-56-22-30-57.5-41.5t-71 0-57 41.5-21.5 67q0 33 19 61t49 42q1 1 1 2t-1 2q-4 3-6 7-44 65-66 102-9 15-9 25 0 21 37.5 36t89.5 15q34 0 68-8 1-20 15-45zm323 18q-28-48-81-126-3-5-8-9-1-1-1-2.5t2-2.5q37-18 60.5-52.5T642 566q0-38-19.5-70.5t-52-51.5-71-19-71 19-51.5 51.5-19 70.5q0 41 23.5 75.5T442 694q2 0 2 1.5t-1 2.5q-5 5-9 10-53 79-80 126-11 19-11 31 0 17 21 31.5t57 23 79 8.5 79-8.5 57-23 21-31.5q0-12-11-31zm206-672h-36v70q0 29-20.5 49.5T746 302H348v8q1 12 10 20t21 8h328l69 68q4 5 9.5 2.5t5.5-8.5l-4-62h65q13 0 22.5-9t9.5-23V194q0-13-9.5-22.5T852 162zM746 99H147q-13 0-22 9t-9 22v102q0 12 9 21.5t22 9.5h66l-13 83q-1 6 4.5 8.5t9.5-1.5l92-90h440q13 0 22-9t9-22V130q0-13-9-22t-22-9zm132 694q-23-39-65-102-3-4-7-7-1-1-1-2t1-2q30-14 49-42t19-61q0-37-22-67t-57-41.5-70.5 0T668 510q9 27 9 56 0 36-15 68 19 30 51 46 1 1 1.5 2t-.5 2q-4 3-7 7-34 51-55 85 14 22 25 40 14 25 15 45 34 8 68 8 52 0 89.5-15t37.5-36q0-10-9-25z"></path></g></svg>
                    <span class="landing-how-item-title">2. Community Engagement</span>
                    <p class="landing-how-item-desc">
                        Citizens can support reports, 
                        share feedback, and help prioritize 
                        the issues that matter most.
                    </p>
                </div>

                <div class="landing-how-item" data-step="3">
                    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#3a6688"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle fill="#3a6688" cx="18" cy="18" r="18"></circle><circle fill="#f0f9ff" cx="18" cy="18" r="14"></circle><path fill="#3a6688" d="M19 18a1 1 0 1 1-2 0V7a1 1 0 0 1 2 0v11z"></path><path fill="#3a6688" d="M26.66 23a.998.998 0 0 1-1.365.367l-7.795-4.5a.999.999 0 1 1 1-1.732l7.795 4.5A.998.998 0 0 1 26.66 23z"></path></g></svg>
                    <span class="landing-how-item-title">3. Track Progress</span>
                    <p class="landing-how-item-desc">
                        Follow every update from submission to 
                        resolution and stay informed about 
                        improvements in your neighborhood.
                    </p>
                </div>

                <div class="landing-how-item" data-step="4">
                    <svg fill="#3a6688" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" d="M12,23 C6,20.3270758 3,17.6604092 3,15 L3,5 C3,4 3.5,4 5,3 C5.16179337,2.89213775 8.56320917,1 12,1 C14.9952495,1 17.5,2 19,3 C20.5,4 21,4 21,5 C21.0264318,5.29131477 21,13.5 21,15 C21,17.6666667 18,20.3333333 12,23 Z M19,15 C19,14.7696854 19.0005911,14.3838015 19.0018395,13.7546873 C19.002442,13.4510385 19.0036756,12.8625961 19.0058778,11.801424 C19.0071585,11.1695166 19.0081782,10.6272502 19.0090335,10.1097828 C19.0127226,7.87763814 19.0117352,5.96181826 19.0095779,5.36928408 C18.6788452,5.1638246 18.1627209,4.84551481 17.8905996,4.66410059 C16.4143231,3.67991623 14.2601784,3 12,3 C9.8380869,3 7.02863525,4.05127735 6.10940039,4.66410059 C5.83989194,4.84377289 5.33104387,5.15772448 5,5.3633347 L5,15 C5,16.5084521 7.22911083,18.568744 12.000926,20.8019938 C16.7721586,18.5737351 19,16.5142377 19,15 Z M11,12.5857864 L15.2928932,8.29289322 L16.7071068,9.70710678 L11,15.4142136 L7.29289322,11.7071068 L8.70710678,10.2928932 L11,12.5857864 Z"></path> </g></svg>                    
                    <span class="landing-how-item-title">4. Improve</span>
                    <p class="landing-how-item-desc">
                        Together, create a cleaner, safer,
                        and stronger community.
                    </p>
                </div>
            </article>
            
            <article class="landing-how-cta">
                <p class="landing-how-cta-text">
                    <span class="landing-how-cta-highlight">Ready to make a difference?</span>
                    <br>
                    Join CoDecide today and help 
                    build a safer, smarter, and more 
                    connected community.
                </p>
                <a class="landing-how-cta-btn" href="/login" data-link>Get Started</a>
            </article>
        </section>

        <!-- VIEW ABOUT US -->
        <section class="landing-about">
            <h1 class="landing-about-title">About Us</h1>
            <small class="landing-about-subtitle">
                Empowering communities through 
                transparency, collaboration, and
                civic participation.
            </small>

            <article class="landing-about-desc">
                <p>
                    At CoDecide, we believe every
                    citizen should have a voice in 
                    improving their community. Our 
                    platform makes it easy to report 
                    local issues, track their progress, 
                    and collaborate with neighbors to 
                    create meaningful change.
                </p>
                <p>
                    By connecting people with their communities,
                    we promote transparency, encourage participation, 
                    and help turn everyday concerns into real solutions.
                </p>
            </article>

            <article class="landing-about-vision">
                <h2 class="landing-about-vision-title">Our Vision</h2>
                <p class="landing-about-vision-text">
                    To become the trusted platform that 
                    strengthens communication between 
                    communities and local organizations, 
                    inspiring collaboration and lasting 
                    positive impact.
                </p>
            </article>

            <article class="landing-about-values">
                <h2 class="landing-about-values-title">Core Values</h2>
                <div class="landing-value-card">
                    <h3 class="landing-value-card-title">Transparency</h3>
                    <p class="landing-value-card-desc">
                        We believe every report should be 
                        visible, traceable, and accountable.
                    </p>
                </div>
                <div class="landing-value-card">
                    <h3 class="landing-value-card-title">Collaboration</h3>
                    <p class="landing-value-card-desc">
                        Great communities are built when 
                        people work together toward shared goals.
                    </p>
                </div>
                <div class="landing-value-card">
                    <h3 class="landing-value-card-title">Community</h3>
                    <p class="landing-value-card-desc">
                        Every voice matters, and every 
                        contribution helps create a better 
                        neighborhood.
                    </p>
                </div>
                <div class="landing-value-card">
                    <h3 class="landing-value-card-title">Innovation</h3>
                    <p class="landing-value-card-desc">
                        We use technology to simplify civic 
                        participation and encourage meaningful 
                        engagement.
                    </p>
                </div>
            </article>
        </section>
    </main>

${FooterLanding()}
`
}