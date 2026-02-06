import { useState } from 'react'
import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'
import { HiMail, HiLocationMarker, HiCheckCircle } from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault()
    console.log('Form submitted:', formData)

    // Show success message
    setIsSubmitted(true)
    setIsVisible(true)

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: '',
    })

    // Start fade out after 4 seconds
    setTimeout(function () {
      setIsVisible(false)
    }, 3000)

    // Remove from DOM after fade completes
    setTimeout(function () {
      setIsSubmitted(false)
    }, 3500)
  }

  // Icon mapping for social links
  const getSocialIcon = function (name: string) {
    switch (name.toLowerCase()) {
      case 'github':
        return <FaGithub className="w-5 h-5" />
      case 'linkedin':
        return <FaLinkedin className="w-5 h-5" />
      case 'email':
        return <FaEnvelope className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <section
      id="contact"
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            Have a project in mind? Let's work together
          </p>
        </div>

        {/* Success Message with Fade In/Out */}
        {isSubmitted && (
          <div
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="bg-primary text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Message Sent Successfully!</p>
                <p className="text-sm">I'll get back to you soon.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-card-md font-heading font-semibold text-light-text-primary dark:text-white mb-6">
                Let's Talk
              </h3>
              <p className="text-body-base text-light-text-secondary dark:text-gray-400 leading-relaxed">
                I'm currently available for freelance work and full-time opportunities. If you have
                a project in mind, feel free to reach out!
              </p>
            </div>

            {/* Contact Details with Icons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiMail className="w-6 h-6 text-primary dark:text-primary-light" />
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
                  <HiLocationMarker className="w-6 h-6 text-primary dark:text-primary-light" />
                </div>
                <div>
                  <p className="text-sm text-light-text-secondary dark:text-gray-400">Location</p>
                  <p className="text-body-base text-light-text-primary dark:text-gray-300">
                    {PERSONAL_INFO.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links with Icons */}
            <div>
              <p className="text-sm text-light-text-secondary dark:text-gray-400 mb-3">
                Connect with me:
              </p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map(function (link) {
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-light-bg dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary-light transition-all hover:scale-110"
                      aria-label={link.label}
                    >
                      {getSocialIcon(link.name)}
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
