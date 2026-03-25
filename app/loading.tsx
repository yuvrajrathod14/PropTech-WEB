export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-x-1/2 -top-12 -translate-x-1/2">
           <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        </div>
        
        {/* Logo/Text Container */}
        <div className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">P</div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">PropTech</h2>
          </div>
          <div className="flex items-center justify-center gap-1">
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Experience...</p>
        </div>
      </div>
    </div>
  )
}
