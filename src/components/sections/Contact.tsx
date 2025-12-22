import { useState } from 'react'
import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'

function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  // Handle input changes
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission
  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault()

    // For now, just log the data
    console.log('Form submitted:', formData)

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: '',
    })

    // Show success message (you can improve this later)
    alert('Thank you for your message! I will get back to you soon.')
  }

  return (
<section 
  id="contact" 
  className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20"
>
  <div className="max-w-7xl mx-auto px-6 w-full">
    <div className="text-center mb-16">
      <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
        Get In Touch
      </h2>
      <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
        Have a project in mind? Let's work together
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Left Column - Contact Info */}
      <div className="space-y-8">
        <div>
          <h3 className="text-card-md font-heading font-semibold text-light-text-primary dark:text-white mb-6">
            Let's Talk
          </h3>
          <p className="text-body-base text-light-text-secondary dark:text-gray-400 leading-relaxed">
            I'm currently available for freelance work and full-time opportunities. 
            If you have a project in mind, feel free to reach out!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary dark:text-primary-light text-xl">📧</span>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-gray-400">Email</p>
              <a 
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-body-base text-light-text-primary dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {PERSONAL_INFO.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary dark:text-primary-light text-xl">📍</span>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-gray-400">Location</p>
              <p className="text-body-base text-light-text-primary dark:text-gray-300">
                {PERSONAL_INFO.location}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-light-text-secondary dark:text-gray-400 mb-3">
            Connect with me:
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(function(link) {
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-light-bg dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary-light transition-all"
                  aria-label={link.label}
                >
                  <span className="text-sm font-medium">
                    {link.name.substring(0, 2)}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Contact Form */}
      <div className="bg-light-bg dark:bg-gray-800 p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-light-text-primary dark:text-white mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition-all text-gray-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-light-text-primary dark:text-white mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition-all text-gray-900 dark:text-white"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-light-text-primary dark:text-white mb-2"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition-all resize-none text-gray-900 dark:text-white"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
  )
}

export default Contact
