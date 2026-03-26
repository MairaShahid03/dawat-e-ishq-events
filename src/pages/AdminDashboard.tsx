import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, Users, BarChart3, Settings,
  CheckCircle, XCircle, AlertCircle, Clock, Eye,
  TrendingUp, DollarSign, Calendar, FileText, Menu, X
} from "lucide-react";

type Tab = "overview" | "bookings" | "calendar" | "clients" | "analytics";

const statusColors: Record<string, string> = {
  pending: "text-amber-500 bg-amber-500/10",
  approved: "text-emerald-500 bg-emerald-500/10",
  rejected: "text-red-500 bg-red-500/10",
  completed: "text-gold bg-gold/10",
};

const mockBookings = [
  { id: "1", client: "Ahmed Khan", event: "Wedding", sub: "Baraat", budget: "PKR 1,200,000", status: "pending", date: "2026-05-15" },
  { id: "2", client: "Sara Malik", event: "Ramadan", sub: "Iftar", budget: "PKR 200,000", status: "approved", date: "2026-04-10" },
  { id: "3", client: "Fatima Ali", event: "Wedding", sub: "Mehndi", budget: "PKR 500,000", status: "completed", date: "2026-03-20" },
  { id: "4", client: "Bilal Shah", event: "Birthday", sub: "Themed Party", budget: "PKR 150,000", status: "approved", date: "2026-06-01" },
  { id: "5", client: "Ayesha Noor", event: "Shower", sub: "Bridal Shower", budget: "PKR 180,000", status: "rejected", date: "2026-04-25" },
];

const stats = [
  { label: "Total Bookings", value: "47", icon: FileText, change: "+12%" },
  { label: "Revenue", value: "PKR 8.5M", icon: DollarSign, change: "+24%" },
  { label: "Active Events", value: "12", icon: Calendar, change: "+3" },
  { label: "Pending", value: "8", icon: Clock, change: "-2" },
];

const navItems: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: FileText },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "clients", label: "Clients", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-noir text-ivory p-4">
      <div className="mb-8 px-2">
        <h2 className="font-heading text-xl text-gold">Admin Panel</h2>
        <p className="text-ivory/40 text-xs mt-1">Dawat-e-Ishq</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
              tab === item.key
                ? "bg-gold/10 text-gold"
                : "text-ivory/60 hover:text-ivory hover:bg-ivory/5"
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/40 hover:text-ivory transition-colors">
        <Settings size={18} /> Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-noir/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8">
          <button className="md:hidden text-noir" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-heading text-xl text-noir capitalize">{tab === "overview" ? "Dashboard" : tab}</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-sm font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <s.icon size={20} className="text-gold" />
                      <span className="text-xs text-emerald-500 flex items-center gap-1">
                        <TrendingUp size={12} /> {s.change}
                      </span>
                    </div>
                    <p className="font-heading text-2xl text-noir font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div>
                <h3 className="font-heading text-lg text-noir mb-4">Recent Bookings</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-body font-medium text-muted-foreground">Client</th>
                          <th className="text-left p-3 font-body font-medium text-muted-foreground">Event</th>
                          <th className="text-left p-3 font-body font-medium text-muted-foreground">Budget</th>
                          <th className="text-left p-3 font-body font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-3 font-body font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.slice(0, 3).map((b) => (
                          <tr key={b.id} className="border-t border-border">
                            <td className="p-3 font-medium text-noir">{b.client}</td>
                            <td className="p-3 text-muted-foreground">{b.event} — {b.sub}</td>
                            <td className="p-3 text-muted-foreground">{b.budget}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <button className="p-1.5 hover:bg-muted rounded-lg"><Eye size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Client</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Event</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Sub-Category</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Budget</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-body font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map((b) => (
                      <tr key={b.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-noir">{b.client}</td>
                        <td className="p-3 text-muted-foreground">{b.event}</td>
                        <td className="p-3 text-muted-foreground">{b.sub}</td>
                        <td className="p-3 text-muted-foreground">{b.date}</td>
                        <td className="p-3 text-muted-foreground">{b.budget}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-1">
                          <button className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-emerald-500" title="Approve">
                            <CheckCircle size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500" title="Reject">
                            <XCircle size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg" title="View">
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "calendar" && (
            <div className="text-center py-16">
              <CalendarDays className="mx-auto text-muted-foreground/30 mb-4" size={48} />
              <p className="text-muted-foreground">Event calendar view coming soon</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Connect Lovable Cloud to enable full calendar functionality</p>
            </div>
          )}

          {tab === "clients" && (
            <div className="space-y-3">
              {["Ahmed Khan", "Sara Malik", "Fatima Ali", "Bilal Shah", "Ayesha Noor"].map((name, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold font-heading font-bold">{name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-noir text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{Math.ceil(Math.random() * 3)} bookings</p>
                    </div>
                  </div>
                  <button className="text-xs text-gold hover:underline">View Profile</button>
                </div>
              ))}
            </div>
          )}

          {tab === "analytics" && (
            <div className="text-center py-16">
              <BarChart3 className="mx-auto text-muted-foreground/30 mb-4" size={48} />
              <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Revenue charts, event breakdowns, and more</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
