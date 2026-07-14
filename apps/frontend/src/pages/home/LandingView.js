import { HeaderLanding } from "@layout/Header";
import { FooterLanding } from "@layout/Footer";

export function LandingView() {
return`
    ${HeaderLanding()}
    <main>  
        <!-- HERO -->
        <section id="hero-landing"> 
            <article>
                <h1>
                    MAKE YOUR 
                   <br> 
                   COMMUNITY BETTER
                </h1>
            </article>
            <p>
               From damaged roads to public safety concerns,
                CokeDecide helps citizens report issues,
                monitor updates, and drive positive change together. 
            </p>

            <div>
                <a href="/login" data-link>Report an Issue</a>
                <a href="#explore-reports" data-link>Explore Reports</a>
            </div>
        </section>

    
        <!-- VIEW EXPLORE REPORTS -->
        <section id="explore-reports">
            <h2>Explore Reports</h2>
            <p>
                See how citizens are making a difference 
                by reporting issues in their communities. 
                Browse real examples of ongoing and 
                resolved reports.
            </p>

            <article>
                <h3>Report Cards</h3>
                <div>
                    <h4>Pothole on Maple Street</h4>
                    <div>
                        <h5>Category</h5>
                        <p>Infrastructure</p>
                    </div>
                    <div>
                        <h5>Status</h5>
                        <p>In Progress</p>
                    </div>
                    <div>
                        <h5>Location</h5>
                        <p>Maple Street, Downtown</p>
                    </div>
                    <div>
                        <h5>Description</h5>
                        <p>Large pothole affecting 
                            traffic and creating a 
                            safety risk for drivers 
                            and cyclists.
                        </p>
                    </div>
                </div>

                <div>
                    <h4>Broken Street Light</h4>
                    <div>
                        <h5>Category</h5>
                        <p>Safety</p>
                    </div>
                    <div>
                        <h5>Status</h5>
                        <p>Resolved</p>
                    </div>
                    <div>
                        <h5>Location</h5>
                        <p>Oak Avenue</p>
                    </div>
                    <div>
                        <h5>Description</h5>
                        <p>Street light repaired 
                            after multiple community 
                            reports improved nighttime 
                            visibility.
                        </p>
                    </div>
                </div>

                <div>
                    <h4>Fallen Tree Blocking Sidewalk</h4>
                    <div>
                        <h5>Category</h5>
                        <p>Environment</p>
                    </div>
                    <div>
                        <h5>Status</h5>
                        <p>Pending</p>
                    </div>
                    <div>
                        <h5>Location</h5>
                        <p>Central Park Entrance</p>
                    </div>
                    <div>
                        <h5>Description</h5>
                        <p>A fallen tree is preventing 
                            pedestrians and wheelchair 
                            users from accessing the 
                            sidewalk.
                        </p>
                    </div>
                </div>                
            </article>

        </section>

        <!-- VIEW  DE HOW IT WORKS-->
        <section id="how-it-works">
            <article>
                <h1>How It Works</h1>
                <div>
                    <h2>Section Subtitle</h2>
                    <p>
                        Discover how CokeDecide helps communities identify,
                        track, and resolve local issues through collaboration.
                    </p>
                </div>
            </article>
            
            <article>
                <div>
                    <span>1. Report an Issue</span>
                    <p>
                        Describe the problem, add a location, 
                    and upload photos to help your community 
                    understand the situation. 
                    </p>
                </div>

                <div>
                    <span>2. Community Engagement</span>
                    <p>
                        Citizens can support reports, 
                        share feedback, and help prioritize 
                        the issues that matter most.
                    </p>
                </div>

                <div>
                    <span>3. Track Progress</span>
                    <p>
                        Follow every update from submission to 
                        resolution and stay informed about 
                        improvements in your neighborhood.
                    </p>
                </div>
            </article>
            
            <article>
                <h2>Call to Action</h2>
                <h3>Ready to make a difference?</h3>
                <p>
                    Join CokeDecide today and help 
                    build a safer, smarter, and more 
                    connected community.
                </p>
                <a href="/login" data-link>Get Started</a>
            </article>
        </section>

        <!-- VIEW ABOUT US -->
        <section id="about-us">
            <h1>About Us</h1>
            <small>
                Empowering communities through 
                transparency, collaboration, and
                civic participation.
            </small>

            <article>
                <p>
                    At CokeDecide, we believe every
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

            <article>
                <h2>Our Vision</h2>
                <p>
                    To become the trusted platform that 
                    strengthens communication between 
                    communities and local organizations, 
                    inspiring collaboration and lasting 
                    positive impact.
                </p>
            </article>

            <article>
                <h2>Core Values</h2>
                <div>
                    <h3>Transparency</h3>
                    <p>
                        We believe every report should be 
                        visible, traceable, and accountable.
                    </p>
                </div>
                <div>
                    <h3>Collaboration</h3>
                    <p>
                        Great communities are built when 
                        people work together toward shared goals.
                    </p>
                </div>
                <div>
                    <h3>Community</h3>
                    <p>
                        Every voice matters, and every 
                        contribution helps create a better 
                        neighborhood.
                    </p>
                </div>
                <div>
                    <h3>Innovation</h3>
                    <p>
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