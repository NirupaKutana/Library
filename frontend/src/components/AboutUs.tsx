
import '../style/AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-section" id="about">
      {/* ── LEFT: Content ── */}
      <div className="about-left">

        <span className="about-tag">About Us</span>

        <div className="about-heading-block">
          <h2 className="about-title">
            Your Smart <span className="about-title-accent">Library</span> Partner
          </h2>
          <div className="about-title-underline" />
        </div>

        <p className="about-body">
          Our Library Management System brings every corner of your library into one
          seamless platform — from cataloguing thousands of books to tracking issues,
          returns, and member records in real time. No paperwork, no guesswork, just clarity.
        </p>

        {/* Stats row */}
        <div className="about-stats">
          <div className="about-stat">
            <span className="stat-num">1K+</span>
            <span className="stat-lbl">Books</span>
          </div>
          <div className="about-stat">
            <span className="stat-num">500+</span>
            <span className="stat-lbl">Members</span>
          </div>
          <div className="about-stat">
            <span className="stat-num">98%</span>
            <span className="stat-lbl">Accuracy</span>
          </div>
        </div>

        {/* Compact feature pills — replaces verbose feature rows */}
        <div className="about-highlights">
          <span className="highlight-pill">📚 Smart Catalogue</span>
          <span className="highlight-pill">⏱ Real-time Tracking</span>
          <span className="highlight-pill">📋 Auto Reports</span>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <button className="about-btn-primary">Explore Library</button>
          <button className="about-btn-ghost">Contact Us</button>
        </div>

      </div>

      {/* ── RIGHT: Photo ── */}
      <div className="about-right">

        <div className="about-img-wrapper">
          {/*
            Replace the placeholder below with your actual image:

            <img
              src="/Image/your-library-photo.jpg"
              alt="Our Library"
              className="about-library-img"
            />
          */}
          <div className="about-img-placeholder">
           
            <img src="/Image/lib7.jfif" alt="Our Library" 
            className="about-library-img"/>
          </div>
        </div>

        <div className="about-right-footer">
          <div className="about-avatar">LM</div>
          <div className="about-meta">
            <strong>Library Management System</strong>
            <span>Serving readers since 2020</span>
          </div>
          <span className="about-badge">Active</span>
        </div>

      </div>

    </section>
  );
};

export default AboutUs;