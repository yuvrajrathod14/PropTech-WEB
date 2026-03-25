"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

const sections = [
  { id: "information", title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, list a property, or contact us. This includes your name, phone number, email address, and property details." },
  { id: "usage", title: "2. How We Use Information", content: "We use the information we collect to provide, maintain, and improve our services, to facilitate property transactions, and to communicate with you about updates and offers." },
  { id: "sharing", title: "3. Sharing of Information", content: "We may share your information with property owners or buyers as part of the enquiry and booking process. We do not sell your personal information to third parties for marketing purposes." },
  { id: "security", title: "4. Data Security", content: "We implement industry-standard security measures to protect your personal information from unauthorized access, loss, or misuse. This includes encryption and secure payment processing through Razorpay." },
  { id: "cookies", title: "5. Cookies & Tracking", content: "PropTech uses cookies to enhance your experience, remember your preferences, and analyze platform traffic. You can manage your cookie preferences through your browser settings." },
  { id: "rights", title: "6. Your Privacy Rights", content: "You have the right to access, correct, or delete your personal information held by us. You can usually do this through your account settings or by contacting our support team." },
  { id: "retention", title: "7. Data Retention", content: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. If you close your account, we will delete or anonymize your data as per our policy." },
  { id: "changes", title: "8. Changes to this Policy", content: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website and updating the 'effective date'." },
  { id: "contact", title: "9. Contact Us", content: "If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer." }
]

export function PrivacyContent() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 font-medium"
          >
            Last updated: March 25, 2024
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4 hidden lg:block sticky top-32 h-fit"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Table of Contents</h3>
              <nav className="space-y-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block text-left text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors w-full"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-3/4 bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                At PropTech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our services.
              </p>

              {sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-12 scroll-mt-32">
                  <h2 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {section.content}
                  </p>
                  <Separator className="mt-8 bg-slate-100" />
                </div>
              ))}

              <div className="mt-16 bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <h3 className="text-xl font-black text-blue-900 mb-4 tracking-tight italic">Privacy Questions?</h3>
                <p className="text-blue-800 font-medium text-sm leading-relaxed mb-6">
                  If you have any questions or concerns about your data or this policy, please reach out to our privacy officer.
                </p>
                <a 
                  href="mailto:privacy@proptech.com"
                  className="inline-flex items-center font-black text-blue-600 hover:text-blue-700 transition-colors"
                >
                  privacy@proptech.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
