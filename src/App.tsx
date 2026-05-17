import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { FavoritesProvider } from "@/hooks/useFavorites";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
import AIChatAssistant from "./components/AIChatAssistant";
=======
//import FloatingChatbot from "./components/FloatingChatbot";
>>>>>>> 504b2b2252d85791074f8ebecb77b26ee7b1844a

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
           
<<<<<<< HEAD
            <AIChatAssistant />
=======
>>>>>>> 504b2b2252d85791074f8ebecb77b26ee7b1844a
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
