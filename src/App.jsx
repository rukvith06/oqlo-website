import "./App.css";

function App() {
  return (
    <div className="website">
      <header className="navbar">
        <a href="/" className="logo">
          <img src="/assets/oqlo_logo.png" alt="OQLO.AI" />
        </a>

        <nav className="nav-links">
          <a href="#solutions">Solutions</a>
          <a href="#technology">Technology</a>
          <a href="#industries">Industries</a>
          <a href="#about">About</a>
        </nav>

        <a href="#contact" className="nav-button">
          Contact Us <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              AI-POWERED DIGITAL TWINS
            </div>

            <h1>
              See the real world.
              <br />
              <span>Think beyond it.</span>
            </h1>

            <p className="hero-description">
              Transform physical spaces into intelligent digital experiences.
              OQLO.AI combines drone surveying, AI, and digital twins to help
              you understand, monitor, and manage the world around you.
            </p>

            <div className="hero-actions">
              <a href="#solutions" className="primary-button">
                Explore Our Solutions <span>↗</span>
              </a>

              <a href="#technology" className="secondary-button">
                Discover Our Technology
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line"></span>
              REAL-WORLD INTELLIGENCE. BUILT FOR WHAT'S NEXT.
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-label">
              <span className="live-dot"></span>
              DIGITAL TWIN EXPERIENCE
            </div>

            <div className="visual-image">
              <img
                src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85"
                alt="Modern architecture viewed from above"
              />

              <div className="image-overlay"></div>

              <div className="coordinate-tag">
                <span>LOCATION INTELLIGENCE</span>
                <strong>Spatial data. Real insights.</strong>
              </div>

              <div className="floating-card">
                <span className="card-indicator"></span>
                <div>
                  <small>AI ANALYSIS</small>
                  <strong>Environment mapped</strong>
                </div>
                <span className="card-arrow">↗</span>
              </div>

              <div className="visual-index">01 / 04</div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <p>INTELLIGENCE FOR A CHANGING WORLD</p>
          <div>CONSTRUCTION</div>
          <div>INFRASTRUCTURE</div>
          <div>REAL ESTATE</div>
          <div>INDUSTRIAL</div>
        </section>

        <section className="solutions-section" id="solutions">
          <div className="section-heading">
            <span className="section-label">WHAT WE DO</span>
            <h2>
              From physical reality
              <br />
              to <span>digital intelligence.</span>
            </h2>
            <p>
              Powerful technologies that turn complex real-world environments
              into actionable insights.
            </p>
          </div>

          <div className="solution-grid">
            <article className="solution-card">
              <span className="solution-number">01</span>
              <div className="solution-icon">⌘</div>
              <h3>Digital Twins</h3>
              <p>
                Create detailed digital representations of physical spaces
                for better visualization and decision-making.
              </p>
              <a href="#contact">Explore solution ↗</a>
            </article>

            <article className="solution-card">
              <span className="solution-number">02</span>
              <div className="solution-icon">⌁</div>
              <h3>Drone Intelligence</h3>
              <p>
                Capture real-world environments and turn aerial data into
                useful spatial intelligence.
              </p>
              <a href="#contact">Explore solution ↗</a>
            </article>

            <article className="solution-card">
              <span className="solution-number">03</span>
              <div className="solution-icon">◈</div>
              <h3>AI Analytics</h3>
              <p>
                Discover patterns, understand progress, and support
                data-driven operational decisions.
              </p>
              <a href="#contact">Explore solution ↗</a>
            </article>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <span className="section-label">LET'S BUILD WHAT'S NEXT</span>
            <h2>Ready to see your world differently?</h2>
            <p>
              Let's explore how digital twins and AI can support your next
              project.
            </p>
          </div>

          <a href="mailto:info@oqlo.ai" className="primary-button">
            Talk to Our Team ↗
          </a>
        </section>
      </main>

      <footer className="footer" id="about">
        <img src="/assets/oqlo_logo.png" alt="OQLO.AI" />
        <p>Intelligence beyond the physical world.</p>
        <span>© {new Date().getFullYear()} OQLO.AI</span>
      </footer>
    </div>
  );
}

export default App;