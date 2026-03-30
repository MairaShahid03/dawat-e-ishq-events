import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles, Loader2, CalendarDays, Plus, Minus } from "lucide-react";
import {
  BookingFormData, initialFormData, EVENT_CATEGORIES, SUB_CATEGORIES,
  SERVICES_ADDONS, SURPRISE_ADDONS, THEMES, FLOWERS, EventCategory, SubEventDetail,
} from "@/lib/eventData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LocationPicker from "@/components/LocationPicker";
import AISuggestions from "@/components/AISuggestions";

const STEPS = [
  "Basic Info", "Category", "Sub-Categories", "Multi-Event Details",
  "Location", "Services", "Surprise Add-ons", "Theme", "Flowers",
  "AI Suggestions", "Review & Submit",
];

const formatPKR = (n: number) => `PKR ${n.toLocaleString()}`;

const inputClass = "w-full px-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all";
const smallInputClass = "w-full px-3 py-2 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body text-sm placeholder:text-ivory/30 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("category") as EventCategory | null;
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingFormData>({
    ...initialFormData,
    category: preselected || "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof BookingFormData, value: any) =>
    setData((p) => ({ ...p, [field]: value }));

  const toggleArray = (field: "services" | "flowers" | "subCategories" | "surpriseAddons", val: string) =>
    setData((p) => ({
      ...p,
      [field]: (p[field] as string[]).includes(val)
        ? (p[field] as string[]).filter((x) => x !== val)
        : [...(p[field] as string[]), val],
    }));

  // Sync subEvents when subCategories change
  useEffect(() => {
    setData((prev) => {
      const newSubEvents = prev.subCategories.map((name) => {
        const existing = prev.subEvents.find((e) => e.name === name);
        return existing || { name, date: "", guests: 100, budget: 200000, theme: "", flowers: [] };
      });
      return { ...prev, subEvents: newSubEvents };
    });
  }, [data.subCategories.join(",")]);

  const updateSubEvent = (index: number, field: keyof SubEventDetail, value: any) => {
    setData((prev) => {
      const updated = [...prev.subEvents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subEvents: updated };
    });
  };

  const toggleSubEventFlower = (index: number, flowerId: string) => {
    setData((prev) => {
      const updated = [...prev.subEvents];
      const current = updated[index].flowers;
      updated[index] = {
        ...updated[index],
        flowers: current.includes(flowerId) ? current.filter((f) => f !== flowerId) : [...current, flowerId],
      };
      return { ...prev, subEvents: updated };
    });
  };

  const totalBudget = data.subEvents.reduce((sum, e) => sum + e.budget, 0);
  const totalGuests = Math.max(...data.subEvents.map((e) => e.guests), 0);

  const canNext = () => {
    switch (step) {
      case 0: return data.name && data.email && data.phone;
      case 1: return !!data.category;
      case 2: return data.subCategories.length > 0;
      case 3: return data.subEvents.every((e) => e.date && e.guests > 0 && e.budget > 0);
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit a booking");
      return;
    }
    setSubmitting(true);
    try {
      const primaryEvent = data.subEvents[0];
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        sub_categories: data.subCategories,
        event_date: primaryEvent?.date || data.eventDate,
        guests: totalGuests,
        budget_pkr: totalBudget,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        services: [...data.services, ...data.surpriseAddons],
        flowers: data.flowers,
        theme: data.theme === "custom" ? data.customTheme : THEMES.find(t => t.id === data.theme)?.label || data.theme,
        custom_theme: data.customTheme,
        notes: `Multi-event details: ${data.subEvents.map(e => `${e.name}: ${e.date}, ${e.guests} guests, ${formatPKR(e.budget)}`).join(" | ")}`,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Booking submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const nextEventDate = data.subEvents
      .map((e) => new Date(e.date))
      .filter((d) => d > new Date())
      .sort((a, b) => a.getTime() - b.getTime())[0];

    const daysUntil = nextEventDate
      ? Math.ceil((nextEventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-gold" size={36} />
        </div>
        <h2 className="font-heading text-3xl text-foreground mb-3">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you, {data.name}. Our team will reach out within 24 hours.
        </p>

        {/* Event Countdown */}
        {daysUntil !== null && daysUntil > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-8 inline-block"
          >
            <CalendarDays className="text-gold mx-auto mb-3" size={32} />
            <p className="text-ivory/60 text-sm mb-2">Your event is in</p>
            <p className="font-heading text-5xl text-gold font-bold">{daysUntil}</p>
            <p className="text-ivory/60 text-sm mt-1">days</p>
            <p className="text-ivory/40 text-xs mt-3">
              {data.subEvents.find((e) => new Date(e.date).getTime() === nextEventDate.getTime())?.name} — {nextEventDate.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-5">
          <h3 className="font-heading text-2xl text-ivory mb-2">Your Information</h3>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "" },
            { key: "email", label: "Email", type: "email", placeholder: "" },
            { key: "phone", label: "Phone Number", type: "text", placeholder: "+92 300 123 4567" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-body text-ivory/60 mb-1 block">{f.label}</label>
              <input
                type={f.type}
                value={(data as any)[f.key]}
                onChange={(e) => update(f.key as keyof BookingFormData, e.target.value)}
                className={inputClass}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      );
      case 1: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Select Event Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { update("category", cat.value); update("subCategories", []); }}
                className={`p-4 rounded-xl border-2 text-left transition-all font-body ${
                  data.category === cat.value
                    ? "border-gold bg-gold/10 shadow-gold text-ivory"
                    : "border-gold/20 text-ivory/70 hover:border-gold/50"
                }`}
              >
                <span className="font-semibold">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
      case 2: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-2">Select Sub-Categories</h3>
          <p className="text-ivory/40 text-sm mb-4">Select multiple events for your celebration</p>
          {data.category && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUB_CATEGORIES[data.category as EventCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggleArray("subCategories", sub)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-body transition-all ${
                    data.subCategories.includes(sub)
                      ? "border-gold bg-gold/10 text-ivory"
                      : "border-gold/20 text-ivory/60 hover:border-gold/50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    data.subCategories.includes(sub) ? "border-gold bg-gold" : "border-ivory/30"
                  }`}>
                    {data.subCategories.includes(sub) && <Check size={10} className="text-noir" />}
                  </div>
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      );
      case 3: return (
        <div className="space-y-6">
          <h3 className="font-heading text-2xl text-ivory mb-2">Multi-Event Details</h3>
          <p className="text-ivory/40 text-sm mb-4">Set details for each event individually</p>
          {data.subEvents.map((evt, i) => (
            <motion.div
              key={evt.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gold/20 rounded-xl p-5 space-y-4 bg-noir/30"
            >
              <h4 className="font-heading text-lg text-gold">{evt.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Date</label>
                  <input type="date" value={evt.date} onChange={(e) => updateSubEvent(i, "date", e.target.value)} className={smallInputClass} />
                </div>
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Guests</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateSubEvent(i, "guests", Math.max(10, evt.guests - 10))} className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center text-ivory/60 hover:border-gold/50">
                      <Minus size={14} />
                    </button>
                    <input type="number" min={10} max={2000} value={evt.guests} onChange={(e) => updateSubEvent(i, "guests", +e.target.value || 10)} className={smallInputClass + " text-center"} />
                    <button onClick={() => updateSubEvent(i, "guests", Math.min(2000, evt.guests + 10))} className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center text-ivory/60 hover:border-gold/50">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Budget (PKR)</label>
                  <input type="number" min={50000} step={10000} value={evt.budget} onChange={(e) => updateSubEvent(i, "budget", +e.target.value || 50000)} className={smallInputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs text-ivory/50 mb-1 block">Theme</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {THEMES.slice(0, 8).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateSubEvent(i, "theme", t.id)}
                      className={`rounded-lg border overflow-hidden text-xs transition-all ${
                        evt.theme === t.id ? "border-gold shadow-gold" : "border-gold/10 hover:border-gold/30"
                      }`}
                    >
                      <div className={`h-6 bg-gradient-to-br ${t.color}`} />
                      <div className="p-1.5 text-ivory/80 bg-noir/60 truncate">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-ivory/50 mb-1 block">Flowers</label>
                <div className="flex flex-wrap gap-2">
                  {FLOWERS.slice(0, 6).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleSubEventFlower(i, f.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-body transition-all ${
                        evt.flowers.includes(f.id) ? "border-gold bg-gold/10 text-ivory" : "border-gold/10 text-ivory/50 hover:border-gold/30"
                      }`}
                    >
                      <span>{f.emoji}</span> {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {data.subEvents.length > 0 && (
            <div className="glass-dark rounded-xl p-4 text-center">
              <p className="text-ivory/50 text-sm">Combined Budget: <span className="text-gold font-semibold">{formatPKR(totalBudget)}</span></p>
            </div>
          )}
        </div>
      );
      case 4: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Event Location</h3>
          <p className="text-ivory/40 text-sm mb-4">Search or pin your venue location</p>
          <LocationPicker
            location={data.location}
            latitude={data.latitude}
            longitude={data.longitude}
            onLocationChange={(loc, lat, lng) => {
              update("location", loc);
              update("latitude", lat);
              update("longitude", lng);
            }}
          />
        </div>
      );
      case 5: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Service Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES_ADDONS.map((s) => (
              <button
                key={s}
                onClick={() => toggleArray("services", s)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-body transition-all ${
                  data.services.includes(s) ? "border-gold bg-gold/10 text-ivory" : "border-gold/20 text-ivory/60 hover:border-gold/50"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  data.services.includes(s) ? "border-gold bg-gold" : "border-ivory/30"
                }`}>
                  {data.services.includes(s) && <Check size={12} className="text-noir" />}
                </div>
                {s}
              </button>
            ))}
          </div>
        </div>
      );
      case 6: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-2">Surprise Add-ons ✨</h3>
          <p className="text-ivory/40 text-sm mb-4">Make your event unforgettable with these exclusive extras</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SURPRISE_ADDONS.map((addon) => (
              <button
                key={addon.id}
                onClick={() => toggleArray("surpriseAddons", addon.id)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  data.surpriseAddons.includes(addon.id)
                    ? "border-gold bg-gold/10 shadow-gold"
                    : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{addon.emoji}</span>
                  <span className="font-heading font-semibold text-ivory">{addon.label}</span>
                </div>
                <p className="text-xs text-ivory/50 font-body">{addon.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
      case 7: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Select Theme</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => update("theme", t.id)}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  data.theme === t.id ? "border-gold shadow-gold" : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <div className={`h-20 bg-gradient-to-br ${t.color}`} />
                <div className="p-3 text-sm font-body font-medium text-ivory bg-noir/80">{t.label}</div>
              </button>
            ))}
          </div>
          {data.theme === "custom" && (
            <div className="mt-4">
              <input value={data.customTheme} onChange={(e) => update("customTheme", e.target.value)} className={inputClass} placeholder="Describe your custom theme..." />
            </div>
          )}
        </div>
      );
      case 8: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Floral Preferences</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FLOWERS.map((f) => (
              <button
                key={f.id}
                onClick={() => toggleArray("flowers", f.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-body transition-all ${
                  data.flowers.includes(f.id) ? "border-gold bg-gold/10 text-ivory" : "border-gold/20 text-ivory/60 hover:border-gold/50"
                }`}
              >
                <span className="text-lg">{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
          {data.flowers.includes("custom") && (
            <div className="mt-4">
              <input value={data.customFlower} onChange={(e) => update("customFlower", e.target.value)} className={inputClass} placeholder="Describe your flower preferences..." />
            </div>
          )}
        </div>
      );
      case 9: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Smart Suggestions</h3>
          <p className="text-ivory/40 text-sm mb-4">Based on your event details</p>
          <AISuggestions
            budget={totalBudget}
            guests={totalGuests}
            category={data.category}
            onSelectTheme={(themeId) => update("theme", themeId)}
            onSelectFlower={(flowerId) => {
              if (!data.flowers.includes(flowerId)) toggleArray("flowers", flowerId);
            }}
          />
        </div>
      );
      case 10: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-6">Review Your Booking</h3>
          <div className="space-y-3 text-sm">
            {[
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone],
              ["Category", EVENT_CATEGORIES.find((c) => c.value === data.category)?.label || ""],
              ["Events", data.subCategories.join(", ")],
              ["Location", data.location || "Not specified"],
              ["Services", data.services.join(", ") || "None"],
              ["Surprise Add-ons", data.surpriseAddons.map(id => SURPRISE_ADDONS.find(a => a.id === id)?.label).filter(Boolean).join(", ") || "None"],
              ["Flowers", data.flowers.map(f => FLOWERS.find(fl => fl.id === f)?.label).filter(Boolean).join(", ") || "None"],
              ["Theme", THEMES.find((t) => t.id === data.theme)?.label || "None"],
              ["Combined Budget", formatPKR(totalBudget)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gold/10">
                <span className="text-ivory/50">{label}</span>
                <span className="font-medium text-ivory text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            {data.subEvents.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-ivory/50">Event Breakdown:</p>
                {data.subEvents.map((evt) => (
                  <div key={evt.name} className="glass-dark rounded-lg p-3 text-xs">
                    <span className="text-gold font-semibold">{evt.name}</span>
                    <span className="text-ivory/40"> — {evt.date} | {evt.guests} guests | {formatPKR(evt.budget)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-ivory/50 mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="w-full h-1.5 bg-ivory/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gold rounded-full" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="min-h-[400px]">
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gold/20 text-ivory/60 hover:text-ivory hover:border-gold/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-body"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn-luxury flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-luxury flex items-center gap-2 disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Submit Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
