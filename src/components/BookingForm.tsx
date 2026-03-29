import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import {
  BookingFormData, initialFormData, EVENT_CATEGORIES, SUB_CATEGORIES,
  PACKAGES, SERVICES_ADDONS, THEMES, FLOWERS, EventCategory,
} from "@/lib/eventData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LocationPicker from "@/components/LocationPicker";
import AISuggestions from "@/components/AISuggestions";

const STEPS = [
  "Basic Info", "Category", "Sub-Categories", "Event Details",
  "Location", "Package", "Destination", "Services", "Flowers",
  "Theme", "AI Suggestions", "Cost Estimate", "Notes", "Review & Submit",
];

const formatPKR = (n: number) => `PKR ${n.toLocaleString()}`;

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

  const toggleArray = (field: "services" | "flowers" | "subCategories", val: string) =>
    setData((p) => ({
      ...p,
      [field]: (p[field] as string[]).includes(val)
        ? (p[field] as string[]).filter((x) => x !== val)
        : [...(p[field] as string[]), val],
    }));

  const estimateCost = () => {
    let base = data.budget;
    const serviceMultiplier = 1 + data.services.length * 0.08;
    const guestMultiplier = Math.max(1, data.guests / 100);
    if (data.isDestination) base *= 1.3;
    return Math.round(base * serviceMultiplier * guestMultiplier * 0.5);
  };

  const canNext = () => {
    switch (step) {
      case 0: return data.name && data.email && data.phone;
      case 1: return !!data.category;
      case 2: return data.subCategories.length > 0;
      case 3: return !!data.eventDate && data.guests > 0;
      case 4: return !!data.packageType;
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
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        sub_categories: data.subCategories,
        event_date: data.eventDate,
        guests: data.guests,
        budget_pkr: data.budget,
        package_type: data.packageType,
        is_destination: data.isDestination,
        destination_city: data.destinationCity,
        venue_preference: data.venuePreference,
        services: data.services,
        flowers: data.flowers,
        theme: data.theme === "custom" ? data.customTheme : THEMES.find(t => t.id === data.theme)?.label || data.theme,
        custom_theme: data.customTheme,
        notes: data.notes,
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
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-gold" size={36} />
        </div>
        <h2 className="font-heading text-3xl text-foreground mb-3">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you, {data.name}. Our team will reach out within 24 hours.
        </p>
      </motion.div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all";

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
          <p className="text-ivory/40 text-sm mb-4">You can select multiple</p>
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
        <div className="space-y-5">
          <h3 className="font-heading text-2xl text-ivory mb-2">Event Details</h3>
          <div>
            <label className="text-sm text-ivory/60 mb-1 block">Event Date</label>
            <input type="date" value={data.eventDate} onChange={(e) => update("eventDate", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-ivory/60 mb-1 block">Number of Guests: {data.guests}</label>
            <input type="range" min={10} max={2000} step={10} value={data.guests} onChange={(e) => update("guests", +e.target.value)} className="w-full accent-gold" />
            <div className="flex justify-between text-xs text-ivory/40"><span>10</span><span>2000</span></div>
          </div>
          <div>
            <label className="text-sm text-ivory/60 mb-1 block">Budget: {formatPKR(data.budget)}</label>
            <input type="range" min={50000} max={2000000} step={10000} value={data.budget} onChange={(e) => update("budget", +e.target.value)} className="w-full accent-gold" />
            <div className="flex justify-between text-xs text-ivory/40"><span>PKR 50K</span><span>PKR 20 Lac</span></div>
          </div>
        </div>
      );
      case 4: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Select Package</h3>
          <div className="space-y-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => update("packageType", pkg.id)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                  data.packageType === pkg.id ? "border-gold bg-gold/10 shadow-gold" : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <div className="font-heading font-semibold text-ivory">{pkg.label}</div>
                <div className="text-sm text-ivory/50">{pkg.description}</div>
                <div className="text-sm text-gold mt-1">{pkg.price}</div>
              </button>
            ))}
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-5">
          <h3 className="font-heading text-2xl text-ivory mb-2">Destination Event</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => update("isDestination", !data.isDestination)} className={`w-12 h-6 rounded-full transition-all ${data.isDestination ? "bg-gold" : "bg-ivory/20"} relative`}>
              <div className={`w-5 h-5 rounded-full bg-noir absolute top-0.5 transition-all ${data.isDestination ? "left-6" : "left-0.5"}`} />
            </div>
            <span className="font-body text-ivory">Is this a destination event?</span>
          </label>
          {data.isDestination && (
            <>
              <div>
                <label className="text-sm text-ivory/60 mb-1 block">City / Country</label>
                <input value={data.destinationCity} onChange={(e) => update("destinationCity", e.target.value)} className={inputClass} placeholder="e.g., Istanbul, Turkey" />
              </div>
              <div>
                <label className="text-sm text-ivory/60 mb-1 block">Venue Preference</label>
                <input value={data.venuePreference} onChange={(e) => update("venuePreference", e.target.value)} className={inputClass} placeholder="e.g., Beachfront, Banquet Hall" />
              </div>
            </>
          )}
        </div>
      );
      case 6: return (
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
      case 7: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Floral Preferences</h3>
          <p className="text-ivory/40 text-sm mb-4">Select your preferred flowers for decoration</p>
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
              <input
                value={data.customFlower}
                onChange={(e) => update("customFlower", e.target.value)}
                className={inputClass}
                placeholder="Describe your flower preferences..."
              />
            </div>
          )}
        </div>
      );
      case 8: return (
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
      case 9: return (
        <div className="text-center">
          <h3 className="font-heading text-2xl text-ivory mb-6">Estimated Cost</h3>
          <div className="glass-dark rounded-2xl p-8 inline-block">
            <p className="text-ivory/60 text-sm mb-2">Estimated Total</p>
            <p className="font-heading text-4xl md:text-5xl text-gold font-bold">{formatPKR(estimateCost())}</p>
            <p className="text-ivory/40 text-xs mt-2">*Final cost may vary based on specifics</p>
          </div>
          <div className="mt-6 text-sm text-ivory/50 space-y-1">
            <p>Guests: {data.guests} | Package: {data.packageType}</p>
            <p>Services: {data.services.length} add-ons | Flowers: {data.flowers.length} selections</p>
            {data.isDestination && <p>Destination: {data.destinationCity}</p>}
          </div>
        </div>
      );
      case 10: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-4">Special Notes</h3>
          <textarea value={data.notes} onChange={(e) => update("notes", e.target.value)} rows={5} className={inputClass + " resize-none"} placeholder="Any special instructions, dietary requirements, cultural preferences..." />
        </div>
      );
      case 11: return (
        <div>
          <h3 className="font-heading text-2xl text-ivory mb-6">Review Your Booking</h3>
          <div className="space-y-3 text-sm">
            {[
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone],
              ["Category", EVENT_CATEGORIES.find((c) => c.value === data.category)?.label || ""],
              ["Sub-Categories", data.subCategories.join(", ")],
              ["Date", data.eventDate],
              ["Guests", data.guests.toString()],
              ["Budget", formatPKR(data.budget)],
              ["Package", PACKAGES.find((p) => p.id === data.packageType)?.label || ""],
              ["Destination", data.isDestination ? data.destinationCity : "No"],
              ["Services", data.services.join(", ") || "None"],
              ["Flowers", data.flowers.map(f => FLOWERS.find(fl => fl.id === f)?.label).filter(Boolean).join(", ") || "None"],
              ["Theme", THEMES.find((t) => t.id === data.theme)?.label || "None"],
              ["Estimated Cost", formatPKR(estimateCost())],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gold/10">
                <span className="text-ivory/50">{label}</span>
                <span className="font-medium text-ivory text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            {data.notes && (
              <div className="pt-2">
                <span className="text-ivory/50">Notes:</span>
                <p className="mt-1 text-ivory">{data.notes}</p>
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
