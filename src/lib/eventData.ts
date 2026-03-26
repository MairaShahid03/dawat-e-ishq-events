export type EventCategory = "wedding" | "ramadan" | "birthday" | "shower" | "custom";

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "wedding", label: "Wedding" },
  { value: "ramadan", label: "Ramadan Events" },
  { value: "birthday", label: "Birthday Events" },
  { value: "shower", label: "Bridal / Baby Shower" },
  { value: "custom", label: "Custom Events" },
];

export const SUB_CATEGORIES: Record<EventCategory, string[]> = {
  wedding: ["Mehndi", "Mayoun", "Baraat", "Walima", "Ubtan", "Dholki", "Mehndi Lagayi", "Nikkah", "Dua-e-Khair"],
  ramadan: ["Sehr", "Iftar", "Family Gathering"],
  birthday: ["Kids Birthday", "Milestone Birthday", "Themed Party", "Surprise Party"],
  shower: ["Bridal Shower", "Baby Shower", "Gender Reveal"],
  custom: ["Corporate Event", "Anniversary", "Engagement", "Other"],
};

export const PACKAGES = [
  { id: "full", label: "Full Event Planning", description: "End-to-end event management", price: "Starting PKR 300,000" },
  { id: "partial", label: "Partial Planning", description: "We handle specific aspects", price: "Starting PKR 150,000" },
  { id: "custom", label: "Custom Planning", description: "Tailored to your needs", price: "Custom Quote" },
];

export const SERVICES_ADDONS = [
  "Catering",
  "Photography / Videography",
  "Decoration",
  "Makeup Artist",
  "Entertainment (DJ, Live Music)",
  "Invitations & Stationery",
  "Transportation",
  "Accommodation",
];

export const THEMES = [
  { id: "royal-gold", label: "Royal Gold", color: "from-yellow-600 to-amber-400" },
  { id: "floral-pastel", label: "Floral Pastel", color: "from-pink-300 to-rose-200" },
  { id: "minimal-elegant", label: "Minimal Elegant", color: "from-gray-200 to-gray-400" },
  { id: "traditional-desi", label: "Traditional Desi", color: "from-red-600 to-orange-400" },
  { id: "custom", label: "Custom Theme", color: "from-gold to-gold-light" },
];

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  category: EventCategory | "";
  subCategory: string;
  eventDate: string;
  guests: number;
  budget: number;
  packageType: string;
  isDestination: boolean;
  destinationCity: string;
  venuePreference: string;
  services: string[];
  theme: string;
  customTheme: string;
  notes: string;
}

export const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  category: "",
  subCategory: "",
  eventDate: "",
  guests: 100,
  budget: 500000,
  packageType: "",
  isDestination: false,
  destinationCity: "",
  venuePreference: "",
  services: [],
  theme: "",
  customTheme: "",
  notes: "",
};
