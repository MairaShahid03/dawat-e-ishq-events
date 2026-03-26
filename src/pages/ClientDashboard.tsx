import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, FileText, MessageCircle, Clock, CheckCircle,
  XCircle, AlertCircle, Download, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type BookingStatus = "pending" | "approved" | "rejected" | "completed";

const statusConfig: Record<BookingStatus, { icon: any; color: string; label: string }> = {
  pending: { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-500 bg-red-500/10", label: "Rejected" },
  completed: { icon: CheckCircle, color: "text-gold bg-gold/10", label: "Completed" },
};

const mockBookings = [
  { id: "1", event: "Wedding — Baraat", date: "2026-05-15", guests: 500, budget: "PKR 1,200,000", status: "approved" as BookingStatus },
  { id: "2", event: "Mehndi Night", date: "2026-05-13", guests: 200, budget: "PKR 400,000", status: "pending" as BookingStatus },
  { id: "3", event: "Ramadan Iftar", date: "2026-04-10", guests: 100, budget: "PKR 150,000", status: "completed" as BookingStatus },
];

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "meetings" | "notifications">("bookings");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="font-heading text-3xl text-noir font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-1">Manage your events and bookings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {[
              { key: "bookings", label: "My Bookings", icon: FileText },
              { key: "meetings", label: "Meetings", icon: Calendar },
              { key: "notifications", label: "Notifications", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-body transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-gold text-gold"
                    : "border-transparent text-muted-foreground hover:text-noir"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <div className="space-y-4">
              {mockBookings.map((booking, i) => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-noir">{booking.event}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                        <span>{booking.guests} guests</span>
                        <span>{booking.budget}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Download size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="text-center py-16">
              <Calendar className="mx-auto text-muted-foreground/30 mb-4" size={48} />
              <p className="text-muted-foreground">No upcoming meetings scheduled</p>
              <button className="btn-luxury mt-4 text-sm">Schedule Meeting</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-3">
              {[
                { msg: "Your Baraat booking has been approved!", time: "2 hours ago", read: false },
                { msg: "New package options available for your Mehndi event", time: "1 day ago", read: true },
                { msg: "Payment reminder for Iftar event", time: "3 days ago", read: true },
              ].map((n, i) => (
                <div key={i} className={`p-4 rounded-xl border ${n.read ? "border-border" : "border-gold/30 bg-gold/5"}`}>
                  <p className={`text-sm ${n.read ? "text-muted-foreground" : "text-noir font-medium"}`}>{n.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-12 glass-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg text-ivory">Need help with your event?</h3>
              <p className="text-ivory/60 text-sm">Chat with our planners on WhatsApp</p>
            </div>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury flex items-center gap-2 text-sm"
            >
              <MessageCircle size={16} /> Chat Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
