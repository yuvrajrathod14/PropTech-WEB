"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { 
  UserPlus, 
  Search, 
  MessageSquare, 
  CreditCard, 
  CheckCircle2,
  Home,
  Camera,
  LineChart,
  ShieldCheck,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const buyerSteps = [
  {
    title: "Create Account",
    description: "Sign up with your phone number in 30 seconds. Verify with OTP, no passwords needed.",
    icon: UserPlus,
    color: "bg-blue-500"
  },
  {
    title: "Search & Discover",
    description: "Search by city, locality, budget, BHK. Switch to map view to see all listings near you.",
    icon: Search,
    color: "bg-indigo-500"
  },
  {
    title: "Connect with Owners",
    description: "Send enquiry directly to property owner. Chat in real-time without sharing your number.",
    icon: MessageSquare,
    color: "bg-purple-500"
  },
  {
    title: "Book with Token",
    description: "Pay a small token amount to reserve the property. Secure payment via Razorpay — refundable if deal doesn't close.",
    icon: CreditCard,
    color: "bg-pink-500"
  },
  {
    title: "Close the Deal",
    description: "Meet owner, sign agreement, complete full payment. PropTech stays your support throughout.",
    icon: CheckCircle2,
    color: "bg-green-500"
  }
]

const sellerSteps = [
  {
    title: "List Property",
    description: "Add property details, location, and price. It takes less than 2 minutes to get started.",
    icon: Home,
    color: "bg-orange-500"
  },
  {
    title: "Upload Photos",
    description: "Add high-quality photos and videos. More visuals mean 10x more enquires from genuine buyers.",
    icon: Camera,
    color: "bg-yellow-500"
  },
  {
    title: "Manage Enquiries",
    description: "Get notified when buyers show interest. Track all leads in your professional dashboard.",
    icon: MessageSquare,
    color: "bg-blue-500"
  },
  {
    title: "Track Performance",
    description: "See how many people viewed your listing. Optimize with data-driven professional analytics.",
    icon: LineChart,
    color: "bg-cyan-500"
  },
  {
    title: "Verified Badge",
    description: "Get your property verified by our team to build trust and close deals significantly faster.",
    icon: ShieldCheck,
    color: "bg-emerald-500"
  }
]

const faqs = [
  {
    question: "Is PropTech free to use?",
    answer: "Yes, PropTech is free for buyers! Property owners can list up to 3 properties for free. Premium plans are available for featured listings and advanced analytics."
  },
  {
    question: "How long does listing approval take?",
    answer: "Every listing on PropTech goes through a manual verification process to ensure quality. This typically takes less than 24 hours."
  },
  {
    question: "Is the token amount refundable?",
    answer: "Token payment is subject to the agreement between you and the owner. Broadly, it reserves the property while you finalize the deal. PropTech facilitates the secure transaction."
  },
  {
    question: "How do I contact property owners?",
    answer: "Once you find a property you like, click the 'Enquire' button. This opens a secure chat channel with the owner in your PropTech dashboard."
  },
  {
    question: "Do you charge any commission on deals?",
    answer: "No! PropTech is a commission-free platform. You deal directly with owners and keep 100% of your savings without any hidden charges."
  },
  {
    question: "How is my privacy protected?",
    answer: "We use secure chat so you don't have to share your phone number until you're comfortable. Your data is encrypted and handled as per our strict privacy policy."
  },
  {
    question: "Can I schedule site visits?",
    answer: "Absolutely. You can discuss and fix site visit timings with the owner directly through our in-app real-time chat feature."
  },
  {
    question: "What are 'Boost' plans?",
    answer: "Boost plans help your listing appear at the top of search results and on our homepage spotlight, getting you significantly more visibility."
  },
  {
    question: "Can I manage multiple properties?",
    answer: "Yes, our Owner Dashboard is designed to help you manage multiple listings, track enquiries for each, and monitor performance easily in one place."
  },
  {
    question: "What if I face an issue during payment?",
    answer: "We use Razorpay, India's most secure payment gateway. If a payment fails, it's usually refunded automatically by your bank. Our support team is also available 24/7."
  }
]

export function HowItWorksContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 mb-6 italic tracking-tight"
          >
            How PropTech Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto"
          >
            From search to keys &mdash; here&apos;s your complete guide to a better real estate journey.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="buyers" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-slate-100 p-1 rounded-2xl h-16 w-full max-w-md">
                <TabsTrigger 
                  value="buyers" 
                  className="rounded-xl font-black text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white h-full transition-all"
                >
                  For Buyers
                </TabsTrigger>
                <TabsTrigger 
                  value="sellers" 
                  className="rounded-xl font-black text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white h-full transition-all"
                >
                  For Sellers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="buyers" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {buyerSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-200 mb-6 group-hover:scale-110 transition-transform`}>
                        <step.icon className="w-10 h-10" />
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-slate-900 font-black shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {index < buyerSteps.length - 1 && (
                      <div className="hidden md:block absolute top-10 -right-4 translate-x-1/2">
                        <ArrowRight className="w-6 h-6 text-slate-200" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sellers" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {sellerSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-200 mb-6 group-hover:scale-110 transition-transform`}>
                        <step.icon className="w-10 h-10" />
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-slate-900 font-black shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {index < sellerSteps.length - 1 && (
                      <div className="hidden md:block absolute top-10 -right-4 translate-x-1/2">
                        <ArrowRight className="w-6 h-6 text-slate-200" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 italic tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-bold">Have questions? We&apos;ve got answers.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border-none rounded-2xl shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
                  <span className="text-left font-black text-slate-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-blue-600 rounded-[48px] p-12 text-white shadow-2xl shadow-blue-200">
            <h2 className="text-3xl md:text-5xl font-black mb-6 italic tracking-tight">Ready to get started?</h2>
            <p className="text-blue-100 mb-10 text-lg font-medium">Join 10,000+ happy users finding their dream homes and verified buyers on PropTech.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50 font-black h-16 px-10 rounded-2xl text-lg shadow-xl shadow-blue-700/20"
                asChild
              >
                <Link href="/register">Register Now</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-blue-400 text-white hover:bg-blue-500 font-black h-16 px-10 rounded-2xl text-lg"
                asChild
              >
                <Link href="/search">Browse Listings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
