"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShieldCheck, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  MapPin, 
  BedDouble, 
  Square,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import Script from "next/script"
import { useRouter } from "next/navigation"

export function BookingClient({ property, user, profile }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isExpanded, setIsExpanded] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const tokenAmount = 50000
  const platformFee = 1000
  const totalAmount = tokenAmount + platformFee

  const handlePayment = async () => {
    if (!termsAgreed) return
    setIsLoading(true)

    try {
      // 1. Create Order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          amount: tokenAmount,
          platformFee: platformFee
        })
      })

      const { orderId, bookingId, amount, error } = await res.json()
      if (error) throw new Error(error)

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "PropTech",
        description: property.title,
        order_id: orderId,
        handler: async function (response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                bookingId
              })
            })

            const { verified, bookingId: verifiedBookingId } = await verifyRes.json()
            if (verified) {
              router.push(`/buyer/booking/success?id=${verifiedBookingId}`)
            } else {
              router.push(`/buyer/booking/failed?reason=verification_failed`)
            }
          } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            router.push(`/buyer/booking/failed?reason=error`)
          }
        },
        prefill: {
          name: profile?.full_name || user?.user_metadata?.full_name || "",
          email: user?.email || "",
          contact: profile?.phone || ""
        },
        theme: {
          color: "#1A56DB"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options) // eslint-disable-line @typescript-eslint/no-explicit-any
      rzp.on('payment.failed', function (response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        router.push(`/buyer/booking/failed?reason=${response.error.code}`)
      })
      rzp.open()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      setIsLoading(false)
      alert(err.message || "Failed to initialize payment")
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="relative h-56">
              <Image 
                src={property.images?.[0] || "/placeholder-property.jpg"} 
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider">
                  Token Booking
                </Badge>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{property.title}</h2>
                  <div className="flex items-center text-slate-500 font-medium text-sm">
                    <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                    {property.location}, {property.city}
                  </div>
                </div>
                <Link href={`/property/${property.id}`} className="text-primary font-black text-sm hover:underline">
                  View Listing
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-none px-4 py-2 rounded-xl flex items-center gap-2">
                  <BedDouble className="w-4 h-4" /> {property.beds} BHK
                </Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-none px-4 py-2 rounded-xl flex items-center gap-2">
                  <Square className="w-4 h-4" /> {property.area} Sq.Ft
                </Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-none px-4 py-2 rounded-xl flex items-center gap-2 font-bold">
                  {formatIndianPrice(property.price)}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{property.profiles?.full_name || "Owner"}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900">What is Token Booking?</span>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-sm text-slate-600 leading-relaxed space-y-4">
                    <p>Token booking allows you to reserve this property exclusively for you while you negotiate final terms and complete the site visit.</p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>This amount is a small part of the total property price.</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Full payment is done offline after direct agreement with the owner.</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>The token amount is fully refundable if the deal doesn&apos;t materialize.</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Payment */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[32px] border-2 border-slate-100 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Lock className="w-32 h-32" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-8">
                  <h3 className="text-xl font-black text-slate-900">Secure Token Booking</h3>
                  <Lock className="w-4 h-4 text-primary" />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium text-sm">Token Amount</span>
                    <span className="font-bold text-slate-900">{formatIndianPrice(tokenAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium text-sm">Platform Service Fee (2%)</span>
                    <span className="font-bold text-slate-900">{formatIndianPrice(platformFee)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-black text-slate-900">Total Payable</span>
                    <span className="text-2xl font-black text-primary tracking-tight">{formatIndianPrice(totalAmount)}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by</span>
                  <div className="relative w-24 h-6">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" fill className="object-contain" />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      id="terms" 
                      className="mt-1 rounded-sm border-2" 
                      checked={termsAgreed}
                      onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-xs font-bold text-slate-500 leading-normal cursor-pointer">
                      I agree to PropTech&apos;s booking terms and understand this is a token amount, not the full property price.
                    </label>
                  </div>

                  <Button 
                    size="lg"
                    disabled={!termsAgreed || isLoading}
                    onClick={handlePayment}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `Pay ${formatIndianPrice(totalAmount)} Securely`
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 py-4 opacity-40 grayscale">
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-900">256-bit SSL</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-900">PCI DSS</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-900">RBI Regulated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
