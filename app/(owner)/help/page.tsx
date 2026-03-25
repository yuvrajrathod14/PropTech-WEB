"use client"

import { 
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-6 max-w-2xl mx-auto pt-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
            <HelpCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">How can we help?</h1>
            <p className="text-slate-500 font-medium text-lg">
                Find answers to common questions or reach out to our dedicated support team.
            </p>
        </div>
        <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
                placeholder="Search for help topics..." 
                className="h-16 px-14 rounded-3xl bg-white border-slate-100 shadow-xl shadow-slate-200/50 font-bold text-lg" 
            />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
            { title: "Chat with Us", icon: MessageCircle, desc: "Fastest way to get help", action: "Start Chat" },
            { title: "Call Support", icon: Phone, desc: "Mon-Sat, 9AM to 6PM", action: "+91 1800-456-789" },
            { title: "Email Support", icon: Mail, desc: "Response within 24 hours", action: "support@proptech.com" },
        ].map((a, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[40px] p-8 text-center space-y-6 hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                    <a.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black italic tracking-tight">{a.title}</h3>
                    <p className="text-sm font-medium text-slate-400">{a.desc}</p>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest border-slate-100 hover:bg-primary hover:text-white transition-all">
                    {a.action}
                </Button>
            </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
           <div className="flex flex-col md:flex-row gap-16">
                <div className="md:w-1/3 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic leading-tight">Frequently Asked Questions</h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Quick solutions for the most common issues faced by our property owners.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-xs gap-2">
                        View Full Knowledge Base <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            { q: "How long does it take for a listing to go live?", a: "Once submitted, our moderation team reviews the listing within 12-24 hours. If it meets our quality guidelines, it goes live instantly." },
                            { q: "What documents are required to post a property?", a: "You'll need a scanned copy of the property title deed or tax receipts, along with a valid ID proof for verification." },
                            { q: "How can I boost my listing visibility?", a: "Go to the 'Boost' section in your dashboard and choose a plan that fits your needs. Boosted listings appear at the top of search results." },
                            { q: "Can I edit my property details after it's live?", a: "Yes, you can edit any detail from the 'My Listings' page. However, major changes might trigger a quick re-review." },
                            { q: "How do I communicate with potential buyers?", a: "All enquiries appear in your 'Leads' section. You can reply directly via our secure chat portal or use the provided phone number." },
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-none bg-slate-50 rounded-3xl px-8 overflow-hidden group data-[state=open]:bg-white data-[state=open]:shadow-lg transition-all border border-transparent data-[state=open]:border-slate-100">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <span className="text-sm font-black text-slate-900 text-left group-data-[state=open]:text-primary transition-colors italic">{faq.q}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                    <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
           </div>
      </div>
    </div>
  )
}
