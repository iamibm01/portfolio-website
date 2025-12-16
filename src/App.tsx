function App() {
  return (
    <div className="min-h-screen bg-light-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-heading font-bold text-primary mb-4">Color Palette Test</h1>
          <p className="text-light-text-secondary font-sans">
            Your brand colors are now configured in Tailwind!
          </p>
        </div>

        {/* Primary Colors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4">Primary Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-24 bg-primary rounded-lg"></div>
              <p className="text-sm text-center">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-24 bg-primary-light rounded-lg"></div>
              <p className="text-sm text-center">Primary Light</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-24 bg-primary-dark rounded-lg"></div>
              <p className="text-sm text-center">Primary Dark</p>
            </div>
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4">Secondary Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-24 bg-secondary rounded-lg"></div>
              <p className="text-sm text-center">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-24 bg-secondary-light rounded-lg"></div>
              <p className="text-sm text-center">Secondary Light</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-24 bg-secondary-dark rounded-lg"></div>
              <p className="text-sm text-center">Secondary Dark</p>
            </div>
          </div>
        </div>

        {/* Gradient Buttons */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4">Gradient Examples</h2>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg transition-shadow">
              Hero Gradient
            </button>
            <button className="px-8 py-3 bg-gradient-card text-white font-medium rounded-full hover:shadow-lg transition-shadow">
              Card Gradient
            </button>
          </div>
        </div>

        {/* Typography Test */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4">Typography</h2>
          <div className="space-y-3">
            <p className="font-heading text-xl">This is Poppins (Heading Font)</p>
            <p className="font-sans text-lg">This is Inter (Body Font) - clean and readable</p>
            <p className="font-mono text-sm">This is Fira Code (Monospace) - for code snippets</p>
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4">Text Colors</h2>
          <p className="text-light-text-primary mb-2">Primary text color (dark charcoal)</p>
          <p className="text-light-text-secondary">Secondary text color (gray)</p>
        </div>
      </div>
    </div>
  )
}

export default App
