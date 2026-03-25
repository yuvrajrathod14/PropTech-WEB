"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", content: "By accessing and using PropTech, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services." },
  { id: "eligibility", title: "2. Eligibility", content: "You must be at least 18 years of age and possess the legal authority to enter into a binding agreement to use our platform. By using PropTech, you represent and warrant that you meet these eligibility requirements." },
  { id: "services", title: "3. Services Provided", content: "PropTech provides a platform for property owners to list their properties and for buyers to discover, enquire about, and book properties. We do not act as a real estate agent or broker unless explicitly stated." },
  { id: "user-accounts", title: "4. User Accounts", content: "You are responsible for maintaining the confidentiality of your account information, including your OTP and session data. You agree to notify us immediately of any unauthorized use of your account." },
  { id: "listings", title: "5. Property Listings", content: "Owners are responsible for the accuracy and legality of their listings. PropTech reserves the right to remove any listing that violates our quality standards or legal regulations." },
  { id: "payments", title: "6. Payments & Token Booking", content: "Token payments made through Razorpay are for reserving properties. Refund policies are governed by the specific agreement between the buyer and the owner. PropTech platform fees are non-refundable." },
  { id: "prohibited", title: "7. Prohibited Conduct", content: "Users may not use the platform for any fraudulent, illegal, or unauthorized purposes. This includes posting fake listings, harassment, or attempting to compromise platform security." },
  { id: "intellectual", title: "8. Intellectual Property", content: "All content, logos, and technology on PropTech are the property of PropTech or its licensors and are protected by intellectual property laws." },
  { id: "liability", title: "9. Limitation of Liability", content: "PropTech is not liable for any direct, indirect, or consequential damages arising from your use of the platform or any transactions between buyers and owners." },
  { id: "governing", title: "10. Governing Law", content: "These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat." }
]

export function TermsContent() {
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
            Terms of Service
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
                Welcome to PropTech. These Terms of Service (&quot;Terms&quot;) govern your access to and use of PropTech&apos;s website, mobile applications, and services. Please read them carefully before using our platform.
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
                <h3 className="text-xl font-black text-blue-900 mb-4 tracking-tight italic">Contact Us for Legal Inquiries</h3>
                <p className="text-blue-800 font-medium text-sm leading-relaxed mb-6">
                  If you have any questions regarding these Terms of Service or any legal matters related to PropTech, please reach out to our legal team.
                </p>
                <a 
                  href="mailto:legal@proptech.com"
                  className="inline-flex items-center font-black text-blue-600 hover:text-blue-700 transition-colors"
                >
                  legal@proptech.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
