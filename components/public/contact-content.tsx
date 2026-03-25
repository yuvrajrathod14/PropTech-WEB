"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    })
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Contact Us
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic tracking-tight"
          >
            Get in Touch with PropTech
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 font-medium"
          >
            Have a question, feedback, or need help? Our team is here to support you 24/7.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight underline decoration-blue-500 underline-offset-8">Contact Information</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Whether you&apos;re a buyer looking for your dream home or an owner wanting to list your property, we&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-lg shadow-blue-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">Office</h4>
                  <p className="text-slate-500 text-sm font-bold">123, PropTech Hub, Corporate Road, Ahmedabad, 380051</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-lg shadow-indigo-100">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">Email</h4>
                  <p className="text-slate-500 text-sm font-bold">hello@proptech.com<br/>support@proptech.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-lg shadow-purple-100">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">Phone</h4>
                  <p className="text-slate-500 text-sm font-bold">+91 79000 00000<br/>+91 79000 11111</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shrink-0 shadow-lg shadow-pink-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">Hours</h4>
                  <p className="text-slate-500 text-sm font-bold">Mon - Sat: 9:00 AM - 8:00 PM<br/>Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="rounded-[40px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl border-4 border-slate-100 h-80 relative">
               <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117506.3193268571!2d72.4832598502305!3d23.02024347712497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd1170aff2f4!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1711361956543!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                ></iframe>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[48px] p-10 md:p-12 shadow-2xl shadow-slate-200 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-400 font-bold ml-1">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      required 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500 active:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-400 font-bold ml-1">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500 active:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-400 font-bold ml-1">Mobile Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 00000 00000" 
                      required 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500 active:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-400 font-bold ml-1">Subject</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="listing" className="focus:bg-blue-600">Property Listing</SelectItem>
                        <SelectItem value="buying" className="focus:bg-blue-600">Buying Inquiry</SelectItem>
                        <SelectItem value="payment" className="focus:bg-blue-600">Payment Issue</SelectItem>
                        <SelectItem value="feedback" className="focus:bg-blue-600">General Feedback</SelectItem>
                        <SelectItem value="other" className="focus:bg-blue-600">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-400 font-bold ml-1">Your Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help..." 
                    required 
                    rows={5}
                    className="bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500 resize-none active:bg-slate-800"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-4 italic tracking-tight">Message Sent!</h2>
                <p className="text-slate-400 font-medium text-lg mb-10 max-w-sm mx-auto">
                  Thank you for reaching out. We&apos;ve received your message and our team will get back to you within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="border-white/20 text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl"
                >
                  Send Another Message
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
