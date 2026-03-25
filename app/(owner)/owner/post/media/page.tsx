"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Camera, Upload, X, Star, Video, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePropertyDraft } from "@/hooks/use-property-draft"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function PostStep4() {
  const router = useRouter()
  const { saveStepData, loadDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const draft = await loadDraft() as any
        if (draft && draft.images) {
          setImages(draft.images || [])
        }
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newImages = [...images]

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`
        const filePath = `${draftId}/${fileName}`

        try {
            const { data, error } = await supabase.storage.from("property-images").upload(filePath, file)
            if (error) throw error
            
            const { data: { publicUrl } } = supabase.storage.from("property-images").getPublicUrl(filePath)
            newImages.push(publicUrl)
        } catch (error) {
            console.error("Upload error:", error)
        }
    }

    setImages(newImages)
    setIsUploading(false)
  }

  const makeCover = (idx: number) => {
    const newImgs = [...images]
    const [selected] = newImgs.splice(idx, 1)
    newImgs.unshift(selected)
    setImages(newImgs)
  }

  const handleNext = async () => {
    await saveStepData({
      images: images,
      thumbnail: images[0] || null
    }, "/owner/post/pricing")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 flex-1 flex flex-col"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add Photos & Videos</h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{images.length} / 20 Photos</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Hidden Input */}
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
            />

            {/* Upload Trigger */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all group relative overflow-hidden"
            >
                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Uploading...</span>
                    </div>
                )}
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Click to Upload</span>
                    <span className="text-[8px] font-bold text-slate-300 block mt-1">PNG, JPG up to 10MB</span>
                </div>
            </div>

            {/* Mock Video Upload */}
            <div className="aspect-square rounded-3xl border-2 border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
                    <Video className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Video</span>
            </div>

            {/* Rendered Images */}
            {images.map((img: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-3xl overflow-hidden relative group shadow-sm border border-slate-100">
                    <Image src={img} alt="" fill className="object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => makeCover(idx)}
                            className={cn(
                                "h-8 w-8 rounded-lg bg-white/20 hover:bg-white/40 text-white",
                                idx === 0 && "bg-primary/80 hover:bg-primary"
                            )}
                        >
                            <Star className={cn("w-4 h-4", idx === 0 && "fill-white")} />
                        </Button>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImages(images.filter((_, i: number) => i !== idx));
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    {idx === 0 && (
                        <div className="absolute top-3 left-3 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg">Cover</div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-emerald-50 rounded-[32px] p-8 space-y-6 border border-emerald-100/50">
        <div className="flex items-center gap-4 text-emerald-700">
            <Camera className="w-6 h-6" />
            <h4 className="text-lg font-black tracking-tight italic">How to take better photos?</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><ImageIcon className="w-5 h-5 text-emerald-500" /></div>
                <p className="text-sm font-medium text-emerald-800 leading-relaxed">Shoot in landscape mode for better coverage of rooms.</p>
            </div>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><ImageIcon className="w-5 h-5 text-emerald-500" /></div>
                <p className="text-sm font-medium text-emerald-800 leading-relaxed">Turn on all lights and open curtains for bright, clear shots.</p>
            </div>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><ImageIcon className="w-5 h-5 text-emerald-500" /></div>
                <p className="text-sm font-medium text-emerald-800 leading-relaxed">Include balcony and entrance views to build buyer trust.</p>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-12 mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/owner/post/details")} 
          className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-8 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isDraftLoading || isInitializing || images.length < 3 || isUploading}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isDraftLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          {!isDraftLoading && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  )
}
