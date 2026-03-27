import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed, Cake, Sparkles, Camera, Plane, Users, Palette, Flower2,
  Zap, Truck, Printer, Megaphone, Baby, PartyPopper, Heart, Calendar,
  BookOpen, Building2, GraduationCap, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const services = [
  { icon: UtensilsCrossed, title: "Catering", desc: "Exquisite menus tailored to your event — from traditional desi feasts to international cuisines." },
  { icon: Cake, title: "Birthday Planning", desc: "Magical birthday celebrations with themed decor, entertainment, and custom cakes." },
  { icon: Sparkles, title: "Bride/Groom Makeover", desc: "Theme-based bridal and groom styling with top makeup artists and designers." },
  { icon: Camera, title: "Photography / Videography", desc: "Cinematic coverage capturing every precious moment of your celebration." },
  { icon: Plane, title: "Destination Wedding Planning", desc: "Luxury destination weddings managed end-to-end, anywhere in the world." },
  { icon: Users, title: "Event Consultant", desc: "Expert guidance on every aspect of your event, from concept to execution." },
  { icon: Palette, title: "Event Designers", desc: "Creative design teams transforming venues into breathtaking experiences." },
  { icon: Calendar, title: "Event Planners", desc: "Full-service event management ensuring flawless execution of your vision." },
  { icon: Flower2, title: "Floral Decoration", desc: "Stunning floral arrangements from traditional marigold setups to modern installations." },
  { icon: Zap, title: "Generator Services", desc: "Reliable power backup to keep your event running smoothly without interruptions." },
  { icon: Truck, title: "Logistics", desc: "Seamless transport, setup, and teardown coordination for hassle-free events." },
  { icon: Printer, title: "Printing Invitations", desc: "Customized and handmade invitation cards with premium finishes and calligraphy." },
  { icon: Megaphone, title: "Event Marketing", desc: "Professional promotion and coverage for corporate and public events." },
  { icon: Star, title: "Bridal Show Management", desc: "Complete management of bridal shows, fashion walks, and exhibitions." },
  { icon: Baby, title: "Baby Shower Planning", desc: "Adorable baby shower setups with themed decor, games, and catering." },
  { icon: PartyPopper, title: "Theme Party", desc: "Creative themed parties from retro nights to masquerade balls." },
  { icon: GraduationCap, title: "Retirement Party Planning", desc: "Honoring milestones with elegant retirement celebrations." },
  { icon: Heart, title: "Anniversary Planning", desc: "Romantic anniversary celebrations crafted with love and attention to detail." },
  { icon: BookOpen, title: "Wedding & Engagement", desc: "Complete wedding and engagement planning from mehndi to walima." },
  { icon: Building2, title: "Religious Events", desc: "Dua-e-Khair, Nikkah ceremonies, and Ramadan gatherings with cultural authenticity." },
  { icon: Users, title: "Conference Planning", desc: "Professional event-focused conference management with premium setups." },
];

const packages = [
  {
    title: "DAWAT-E-KHAAS",
    subtitle: "Baraat Menu",
    price: "PKR 6,500",
    perHead: true,
    sections: [
      { heading: "Starters", items: ["Soup", "Fish Crackers", "Mini Burgers with Caramelised Onion & Cheese"] },
      { heading: "Main Course", items: ["Lamb Kofta with Mint Yogurt", "Charcoal Kabab with Apricot Chutni", "King Prawn Biryani", "Delhi Butter Chicken", "Mutton Joints with Tartar Sauce", "Stuffed Chicken Supreme", "Alfredo Pasta", "Beef Afghani Pulao", "Smoky Tandoori Drumsticks", "Assorted Naan & Breads"] },
      { heading: "Desserts", items: ["Saal Halwa", "Sweet Bar with Assorted Cakes", "Gurr Chawal", "Live Jalebi with Rabri"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
    highlight: true,
  },
  {
    title: "SHAN-E-BARAAT",
    subtitle: "Baraat Menu",
    price: "PKR 3,850",
    perHead: true,
    sections: [
      { heading: "Starters", items: ["Hot & Sour Soup", "Fish Crackers"] },
      { heading: "Main Course", items: ["Beef Kabuli Pulao", "Mutton Kunna", "Chicken with Cashew Nuts & Rice", "Assorted Bread"] },
      { heading: "Desserts", items: ["Aloo Bukhara Chatni", "Fruit Trifle", "Gulab Jamun", "Green Tea"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
  },
  {
    title: "CHEF'S MASTERPIECE",
    subtitle: "Baraat Menu",
    price: "PKR 7,000",
    perHead: true,
    sections: [
      { heading: "Starters", items: ["Sesame Fried Shrimps", "Spring Rolls", "Fried Wings", "Broccoli Soup"] },
      { heading: "Main Course", items: ["Turkish Kabab", "Paneer Tikka", "Fish Tikka", "Mutton Keema with Malai", "Mutton Badami Qorma", "Mutton Champ", "Chicken Manchurian", "Garlic Chicken"] },
      { heading: "Desserts", items: ["Kulfi", "Fruit Trifle", "Kheer Thuti", "Chocolate Mousse"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
  },
  {
    title: "CATERING SETUP",
    subtitle: "Full Setup Package",
    price: "Custom",
    perHead: false,
    sections: [
      { heading: "Includes", items: ["Dera Setup", "Carpet", "Goblet Glass", "Crockery", "Cutlery", "Round Table Sitting with Sofa 20%", "Sofa Chairs & Covers", "Buffet Stations", "Lighting", "Waiters"] },
    ],
  },
  {
    title: "MEHNDI PACKAGE",
    subtitle: "Food Menu",
    price: "Custom",
    perHead: false,
    sections: [
      { heading: "Menu", items: ["Pathore Chanay", "Tikka Boti", "Gulab Jamun", "Mineral Water", "Chicken Kababs", "Live Nan", "Fresh Salad Raita", "Cold Drinks"] },
    ],
  },
  {
    title: "RAMZAN FARSHI SETUP",
    subtitle: "Complete Setup",
    price: "PKR 35,000",
    perHead: false,
    sections: [
      { heading: "Includes", items: ["Wooden pallets", "Carpet", "Cushions", "Floral work", "Table decor", "Fairy lights + baby lanterns", "Crockery, cutlery, mats & napkins", "Ambient lighting", "Custom backdrop (arch, balloons, floral work)", "Cake stand & cake table"] },
    ],
  },
  {
    title: "BIRTHDAY FARSHI SETUP",
    subtitle: "Complete Setup",
    price: "PKR 44,999",
    perHead: false,
    sections: [
      { heading: "Includes", items: ["Wooden pallets", "Carpet", "Cushions", "Floral decor", "Lighting", "Backdrop", "Cake table"] },
    ],
  },
  {
    title: "MAYOUN DECOR",
    subtitle: "Full Decor Package",
    price: "PKR 650,000",
    perHead: false,
    sections: [
      { heading: "Includes", items: ["Entrance decor (gainda setup)", "Floral stage setup", "Walkway decor", "Dining setup", "Lounge area setup", "Floral stands", "Photobooth", "Sound system"] },
    ],
  },
];

const Services = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 px-4 bg-noir">
      <div className="container mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3"
        >
          What We Offer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4"
        >
          Our Services
        </motion.h1>
        <div className="gold-divider" />
      </div>
    </section>

    {/* Services Grid */}
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-gold/30 hover:shadow-gold transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <service.icon className="text-gold" size={24} />
              </div>
              <h3 className="font-heading text-lg text-foreground font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Packages */}
    <section id="packages" className="section-padding bg-noir">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Premium Menus</p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">Our Packages</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-gold ${
                pkg.highlight
                  ? "border-gold bg-gold/5"
                  : "border-gold/20 bg-noir/50"
              }`}
            >
              {pkg.highlight && (
                <div className="bg-gold text-noir text-center py-2 text-xs font-heading font-bold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <p className="text-gold/70 text-xs tracking-wider uppercase mb-1">{pkg.subtitle}</p>
                <h3 className="font-heading text-2xl text-ivory font-bold mb-1">{pkg.title}</h3>
                <p className="text-gold font-heading text-xl font-bold">
                  {pkg.price}
                  {pkg.perHead && <span className="text-sm text-ivory/50 font-body font-normal"> / per head</span>}
                </p>

                <div className="mt-6 space-y-4">
                  {pkg.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="text-gold/80 text-xs tracking-wider uppercase font-semibold mb-2">{section.heading}</h4>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item} className="text-ivory/70 text-sm flex items-start gap-2">
                            <span className="text-gold mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Link
                  to="/booking"
                  className="btn-luxury w-full text-center block mt-6 text-sm"
                >
                  Book This Package
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-background">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-4">
            Ready to Plan Your Dream Event?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Contact us today and let our expert team create something extraordinary for you.
          </p>
          <Link to="/booking" className="btn-luxury text-base">
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default Services;
