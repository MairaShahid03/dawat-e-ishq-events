import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, FileText, MessageCircle, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Loader2, LogOut
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FLOWERS } from "@/lib/eventData";

type BookingStatus = "pending" | "approved" | "rejected" | "completed";

const statusConfig: Record<BookingStatus, { icon: any; color: string; label: string }> = {
  pending: { icon: AlertCircle, color: "text-amber-400 bg-amber-500/10", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-400 bg-red-500/10", label: "Rejected" },
  completed: { icon: CheckCircle, color: "text-blue-400 bg-blue-500/10", label: "Completed" },
};

const ClientDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "meetings">("bookings");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, meetingsRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("meetings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    setBookings(bookingsRes.data || []);
    setMeetings(meetingsRes.data || []);
    setLoading(false);
  };

  const respondToMeeting = async (meetingId: string, response: string, reason?: string) => {
    const { error } = await supabase.from("meetings").update({
      status: response,
      user_response: response,
      rejection_reason: reason || null,
    }).eq("id", meetingId);
    if (error) toast.error(error.message);
    else { toast.success(`Meeting ${response}`); fetchData(); }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl text-ivory font-bold">Welcome, {profile?.full_name || "Client"}</h1>
              <p className="text-ivory/40 mt-1">Manage your events and bookings</p>
            </div>
            <button onClick={async () => { await signOut(); navigate("/login"); }} className="flex items-center gap-2 text-ivory/40 hover:text-red-400 transition-colors text-sm">
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="flex gap-2 mb-8 border-b border-gold/10">
            {[
              { key: "bookings", label: "My Bookings", icon: FileText },
              { key: "meetings", label: "Meetings", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-body transition-all border-b-2 ${
                  activeTab === tab.key ? "border-gold text-gold" : "border-transparent text-ivory/40 hover:text-ivory"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && !selectedBooking && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="mx-auto text-ivory/20 mb-4" size={48} />
                  <p className="text-ivory/40">No bookings yet</p>
                  <button onClick={() => navigate("/booking")} className="btn-luxury text-sm mt-4">Book an Event</button>
                </div>
              ) : bookings.map((booking, i) => {
                const status = statusConfig[(booking.status as BookingStatus) || "pending"];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-noir border border-gold/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-ivory">{booking.sub_categories?.join(", ") || "Event"}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-ivory/40 mt-2">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {booking.event_date || "TBD"}</span>
                        <span>{booking.guests} guests</span>
                        <span>PKR {booking.budget_pkr?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                      <ChevronRight size={16} className="text-ivory/30" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "bookings" && selectedBooking && (
            <div>
              <button onClick={() => setSelectedBooking(null)} className="flex items-center gap-2 text-gold hover:text-gold-light font-body mb-6 transition-colors text-sm">
                ← Back to Bookings
              </button>
              <div className="bg-noir border border-gold/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl text-ivory">{selectedBooking.sub_categories?.join(", ") || "Event"}</h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig[(selectedBooking.status as BookingStatus) || "pending"].color}`}>{selectedBooking.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    ["Date", selectedBooking.event_date],
                    ["Guests", selectedBooking.guests],
                    ["Budget", `PKR ${selectedBooking.budget_pkr?.toLocaleString()}`],
                    ["Package", selectedBooking.package_type],
                    ["Theme", selectedBooking.theme],
                    ["Services", selectedBooking.services?.join(", ")],
                    ["Flowers", selectedBooking.flowers?.map((f: string) => FLOWERS.find(fl => fl.id === f)?.label || f).join(", ")],
                    ["Destination", selectedBooking.is_destination ? selectedBooking.destination_city : "No"],
                    ["Notes", selectedBooking.notes],
                  ].map(([label, value]) => value ? (
                    <div key={label as string} className="py-2 border-b border-gold/5">
                      <span className="text-ivory/40 block text-xs mb-1">{label}</span>
                      <span className="text-ivory">{value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="mx-auto text-ivory/20 mb-4" size={48} />
                  <p className="text-ivory/40">No meetings scheduled</p>
                </div>
              ) : meetings.map((m) => (
                <div key={m.id} className="bg-noir border border-gold/10 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-ivory font-medium">{m.admin_note || "Meeting scheduled"}</p>
                      <p className="text-ivory/40 text-sm mt-1">{m.meeting_date ? new Date(m.meeting_date).toLocaleString() : "TBD"}</p>
                      {m.meeting_location && <p className="text-ivory/30 text-sm">{m.meeting_location}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      m.status === "accepted" ? "text-emerald-400 bg-emerald-500/10" :
                      m.status === "rejected" ? "text-red-400 bg-red-500/10" :
                      "text-amber-400 bg-amber-500/10"
                    }`}>{m.status}</span>
                  </div>
                  {m.status === "pending" && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => respondToMeeting(m.id, "accepted")} className="btn-luxury text-xs py-2 px-4">Accept</button>
                      <button
                        onClick={() => {
                          const reason = prompt("Reason for rejection?");
                          if (reason !== null) respondToMeeting(m.id, "rejected", reason);
                        }}
                        className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 glass-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg text-ivory">Need help with your event?</h3>
              <p className="text-ivory/60 text-sm">Chat with our planners on WhatsApp</p>
            </div>
            <a href="https://wa.me/923282681668" target="_blank" rel="noopener noreferrer" className="btn-luxury flex items-center gap-2 text-sm">
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
