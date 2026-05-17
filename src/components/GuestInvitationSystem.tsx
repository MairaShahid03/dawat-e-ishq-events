import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Share2, Users, Check, X, Copy, QrCode,
  Calendar, MapPin, Clock, Send, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Guest {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  category: string;
  dietaryRestrictions?: string;
}

interface Invitation {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  invitationLink: string;
  guests: Guest[];
  totalInvited: number;
  acceptedCount: number;
  declinedCount: number;
}

const GuestInvitationSystem = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "track">(
    "create"
  );
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      eventName: "Mehfil-e-Ishq Wedding",
      eventDate: "2026-06-15",
      eventTime: "18:00",
      eventLocation: "Karachi, Pakistan",
      invitationLink: "https://mehfil-e-ishq.com/invite/abc123",
      guests: [
        {
          id: "g1",
          name: "Ali Khan",
          email: "ali@example.com",
          status: "accepted",
          category: "Family",
        },
        {
          id: "g2",
          name: "Sara Ahmed",
          email: "sara@example.com",
          status: "pending",
          category: "Friends",
        },
      ],
      totalInvited: 150,
      acceptedCount: 87,
      declinedCount: 12,
    },
  ]);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    guestList: "",
  });

  const handleCreateInvitation = () => {
    if (
      !formData.eventName ||
      !formData.eventDate ||
      !formData.eventLocation
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      eventName: formData.eventName,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime || "18:00",
      eventLocation: formData.eventLocation,
      invitationLink: `https://mehfil-e-ishq.com/invite/${Math.random().toString(36).substr(2, 9)}`,
      guests: [],
      totalInvited: 0,
      acceptedCount: 0,
      declinedCount: 0,
    };

    setInvitations([...invitations, newInvitation]);
    setFormData({
      eventName: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      guestList: "",
    });
    toast.success("Invitation created successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const handleRSVP = (invitationId: string, guestId: string, status: "accepted" | "declined") => {
    setInvitations(
      invitations.map((inv) => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            guests: inv.guests.map((g) =>
              g.id === guestId ? { ...g, status } : g
            ),
          };
        }
        return inv;
      })
    );
    toast.success(`RSVP ${status}!`);
  };

  return (
    <section className="section-padding bg-noir">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Guest Management
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Invitation & RSVP System
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          {(["create", "manage", "track"] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-body capitalize transition-all ${
                activeTab === tab
                  ? "bg-gold text-noir font-semibold"
                  : "bg-ivory/10 text-ivory/70 hover:bg-ivory/20"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Create Tab */}
          {activeTab === "create" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="font-heading text-2xl text-ivory mb-6">
                Create New Invitation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-ivory/70 text-sm mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                    placeholder="e.g., Mehfil-e-Ishq Wedding"
                    className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/70 text-sm mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory/70 text-sm mb-2">
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) =>
                        setFormData({ ...formData, eventTime: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ivory/70 text-sm mb-2">
                    Event Location *
                  </label>
                  <input
                    type="text"
                      value={formData.eventLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventLocation: e.target.value,
                      })
                    }
                    placeholder="e.g., Karachi, Pakistan"
                    className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateInvitation}
                  className="btn-luxury w-full flex items-center justify-center gap-2 mt-6"
                >
                  <Send size={18} /> Create Invitation
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Manage Tab */}
          {activeTab === "manage" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {invitations.map((invitation, idx) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading text-2xl text-ivory mb-2">
                        {invitation.eventName}
                      </h3>
                      <div className="space-y-1 text-ivory/60 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gold" />
                          {new Date(invitation.eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gold" />
                          {invitation.eventTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gold" />
                          {invitation.eventLocation}
                        </div>
                      </div>
                    </div>
                    <QrCode size={32} className="text-gold/30" />
                  </div>

                  {/* Sharing Options */}
                  <div className="bg-noir/30 rounded-lg p-4 mb-6">
                    <p className="text-ivory/70 text-sm mb-3">Invitation Link:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={invitation.invitationLink}
                        readOnly
                        className="flex-1 px-4 py-2 rounded-lg bg-noir/50 border border-gold/20 text-ivory/70 text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(invitation.invitationLink)
                        }
                        className="px-4 py-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                      >
                        <Copy size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                      >
                        <Share2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-noir/30 rounded-lg p-4 text-center">
                      <p className="text-gold text-2xl font-bold">
                        {invitation.totalInvited}
                      </p>
                      <p className="text-ivory/60 text-sm">Total Invited</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-4 text-center">
                      <p className="text-emerald-400 text-2xl font-bold">
                        {invitation.acceptedCount}
                      </p>
                      <p className="text-ivory/60 text-sm">Accepted</p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 text-center">
                      <p className="text-red-400 text-2xl font-bold">
                        {invitation.declinedCount}
                      </p>
                      <p className="text-ivory/60 text-sm">Declined</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Track Tab */}
          {activeTab === "track" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {invitations.map((invitation) => (
                <motion.div
                  key={invitation.id}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="font-heading text-xl text-ivory mb-6">
                    {invitation.eventName} - Guest Responses
                  </h3>
                  <div className="space-y-3">
                    {invitation.guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between p-4 bg-noir/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-ivory font-body font-medium">
                            {guest.name}
                          </p>
                          <p className="text-ivory/50 text-sm">{guest.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-body px-3 py-1 rounded-full ${
                              guest.status === "accepted"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : guest.status === "declined"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {guest.status}
                          </span>
                          {guest.status === "pending" && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleRSVP(
                                    invitation.id,
                                    guest.id,
                                    "accepted"
                                  )
                                }
                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              >
                                <Check size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleRSVP(
                                    invitation.id,
                                    guest.id,
                                    "declined"
                                  )
                                }
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <X size={16} />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestInvitationSystem;
