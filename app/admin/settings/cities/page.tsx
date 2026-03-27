"use client"

import { useState } from "react"
import { MapPin, Plus, Trash2, Save, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const defaultCities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar",
  "Mumbai", "Pune", "Delhi", "Bengaluru", "Hyderabad", "Chennai"
]

export default function AdminSettingsCitiesPage() {
  const [cities, setCities] = useState<string[]>(defaultCities)
  const [newCity, setNewCity] = useState("")
  const [saved, setSaved] = useState(false)

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities(prev => [...prev, newCity.trim()].sort())
      setNewCity("")
    }
  }

  const removeCity = (city: string) => {
    setCities(prev => prev.filter(c => c !== city))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-slate-600" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Active Cities</h1>
        </div>
        <p className="text-slate-500 font-medium">Control which cities appear in search filters and property listing forms.</p>
      </div>

      <Card className="border-none shadow-sm rounded-[32px]">
        <CardHeader>
          <CardTitle className="font-black italic">Add New City</CardTitle>
          <CardDescription>Properties can only be listed in active cities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCity()}
              placeholder="e.g. Jaipur"
              className="h-12 rounded-2xl bg-slate-50 border-none"
            />
            <Button onClick={addCity} disabled={!newCity.trim()} className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-8 gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add City
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-[32px]">
        <CardHeader>
          <CardTitle className="font-black italic">Active Cities ({cities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {cities.map(city => (
              <div key={city} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 group">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-black text-sm text-slate-900">{city}</span>
                <button
                  onClick={() => removeCity(city)}
                  className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-10 gap-2">
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </div>
    </div>
  )
}
