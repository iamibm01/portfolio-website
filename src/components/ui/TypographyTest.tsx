function TypographyTest() {
  return (
    <div className="min-h-screen bg-light-bg p-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-hero-md font-heading font-bold text-primary mb-4">
            Typography System
          </h1>
          <p className="text-body-lg text-light-text-secondary">
            Your complete typography scale with responsive sizes
          </p>
        </div>

        {/* Hero Sizes */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Hero Sizes (Large Headings)
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-hero-lg (96px)</p>
              <h1 className="text-hero-lg font-heading font-bold text-primary">Portfolio</h1>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-hero-md (72px)</p>
              <h1 className="text-hero-md font-heading font-bold text-primary">
                Front-End Developer
              </h1>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-hero-sm (56px)</p>
              <h1 className="text-hero-sm font-heading font-bold text-primary">Your Name Here</h1>
            </div>
          </div>
        </section>

        {/* Section Headings */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Section Headings
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-section-md (48px)</p>
              <h2 className="text-section-md font-heading font-semibold text-light-text-primary">
                About Me
              </h2>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-section-sm (36px)</p>
              <h2 className="text-section-sm font-heading font-semibold text-light-text-primary">
                My Skills
              </h2>
            </div>
          </div>
        </section>

        {/* Card/Project Headings */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Card/Project Headings
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-card-md (30px)</p>
              <h3 className="text-card-md font-heading font-semibold text-light-text-primary">
                TaskFlow Pro
              </h3>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-card-sm (24px)</p>
              <h3 className="text-card-sm font-heading font-semibold text-light-text-primary">
                Weather Dashboard
              </h3>
            </div>
          </div>
        </section>

        {/* Body Text */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Body Text
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-body-lg (18px)</p>
              <p className="text-body-lg text-light-text-primary font-sans">
                This is large body text. Perfect for introductions, taglines, and important content
                that needs emphasis. Line height is 1.7 for optimal readability.
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-body-base (16px)</p>
              <p className="text-body-base text-light-text-primary font-sans">
                This is the standard body text size. Most of your content will use this size. It's
                readable, comfortable, and works well for paragraphs and descriptions. Line height
                is 1.6 for a nice reading experience.
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary mb-2">text-body-sm (14px)</p>
              <p className="text-body-sm text-light-text-secondary font-sans">
                This is small body text. Use for captions, labels, metadata, and secondary
                information. Line height is 1.5 to keep it compact but readable.
              </p>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Font Weights
          </h2>
          <div className="space-y-4">
            <p className="text-body-lg font-sans font-normal text-light-text-primary">
              Regular (400) - Normal body text
            </p>
            <p className="text-body-lg font-sans font-medium text-light-text-primary">
              Medium (500) - Slightly emphasized
            </p>
            <p className="text-body-lg font-heading font-semibold text-light-text-primary">
              Semibold (600) - Section headings
            </p>
            <p className="text-body-lg font-heading font-bold text-light-text-primary">
              Bold (700) - Hero text and emphasis
            </p>
          </div>
        </section>

        {/* Monospace Font */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Monospace (Code)
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <code className="font-mono text-body-base text-primary">
              const greeting = 'Hello World';
            </code>
          </div>
        </section>

        {/* Realistic Example */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-section-sm font-heading font-semibold mb-6 text-light-text-primary">
            Real-World Example
          </h2>
          <div className="space-y-4">
            <h3 className="text-card-md font-heading font-semibold text-light-text-primary">
              Building Modern Web Experiences
            </h3>
            <p className="text-body-lg text-light-text-primary font-sans">
              I'm a front-end developer with a passion for creating beautiful, functional user
              interfaces.
            </p>
            <p className="text-body-base text-light-text-secondary font-sans">
              With a background in mechanical design, I bring precision and attention to detail to
              every project. I specialize in React, TypeScript, and modern CSS frameworks like
              Tailwind.
            </p>
            <p className="text-body-sm text-light-text-secondary font-sans">
              Currently available for freelance projects • Based in Lahore, Pakistan
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TypographyTest
