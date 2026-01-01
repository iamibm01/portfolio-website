import { useState } from 'react'
import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'
import { HiMail, HiLocationMarker, HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleFocus = function (fieldName: string) {
    setFocusedField(fieldName)
  }

  const handleBlur = function (fieldName: string) {
    if (!formData[fieldName as keyof typeof formData]) {
      setFocusedField(null)
    }
  }

  const validateForm = function () {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Show loading state
    setIsLoading(true)

    // Simulate API call
    setTimeout(function () {
      console.log('Form submitted:', formData)
      setIsLoading(false)

      // Show success message
      setIsSubmitted(true)
      setIsVisible(true)

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      })
      setFocusedField(null)

      // Start fade out after 3 seconds
      setTimeout(function () {
        setIsVisible(false)
      }, 3000)

      // Remove from DOM after fade completes
      setTimeout(function () {
        setIsSubmitted(false)
      }, 3500)
    }, 1500)
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
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative"
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
              {/* Name Field with Floating Label */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={function() { handleFocus('name') }}
                  onBlur={function() { handleBlur('name') }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg focus:outline-none transition-all text-gray-900 dark:text-white peer ${
                    errors.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? '-top-2.5 text-xs bg-light-bg dark:bg-gray-800 px-1'
                      : 'top-3 text-sm'
                  } ${
                    errors.name
                      ? 'text-red-500'
                      : focusedField === 'name'
                      ? 'text-primary dark:text-primary-light'
                      : 'text-light-text-secondary dark:text-gray-400'
                  }`}
                >
                  Your Name
                </label>
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                    <HiXCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Field with Floating Label */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={function() { handleFocus('email') }}
                  onBlur={function() { handleBlur('email') }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg focus:outline-none transition-all text-gray-900 dark:text-white peer ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'email' || formData.email
                      ? '-top-2.5 text-xs bg-light-bg dark:bg-gray-800 px-1'
                      : 'top-3 text-sm'
                  } ${
                    errors.email
                      ? 'text-red-500'
                      : focusedField === 'email'
                      ? 'text-primary dark:text-primary-light'
                      : 'text-light-text-secondary dark:text-gray-400'
                  }`}
                >
                  Your Email
                </label>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                    <HiXCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Message Field with Floating Label */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={function() { handleFocus('message') }}
                  onBlur={function() { handleBlur('message') }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg focus:outline-none transition-all resize-none text-gray-900 dark:text-white peer ${
                    errors.message 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'message' || formData.message
                      ? '-top-2.5 text-xs bg-light-bg dark:bg-gray-800 px-1'
                      : 'top-3 text-sm'
                  } ${
                    errors.message
                      ? 'text-red-500'
                      : focusedField === 'message'
                      ? 'text-primary dark:text-primary-light'
                      : 'text-light-text-secondary dark:text-gray-400'
                  }`}
                >
                  Your Message
                </label>
                {errors.message && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                    <HiXCircle className="w-3 h-3" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button with Loading Animation */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact