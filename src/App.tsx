import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { StripeProvider } from "@/contexts/StripeContext";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import NewProject from "./pages/NewProject";
import Donations from "./pages/Donations";
import OneTimeGift from "./pages/OneTimeGift";
import MonthlySupport from "./pages/MonthlySupport";
import Membership from "./pages/Membership";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ThankYou from './pages/ThankYou';
import CancelSubscription from './pages/CancelSubscription';
import Terms from './pages/Terms';
import Payments from './pages/Payments';
import PaymentResult from './pages/PaymentResult';
import MembershipRenewal from './pages/MembershipRenewal';
import CotisationPaymentResult from './pages/CotisationPaymentResult';
import ThankYouCotisation from './pages/ThankYouCotisation';
import SetupPassword from "@/pages/SetupPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StripeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <NavBar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:id" element={<Event />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/article/:id" element={<Article />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/project/:id" element={<Project />} />
                  <Route path="/projects/new" element={<NewProject />} />
                  <Route path="/donations" element={<Donations />} />
                  <Route path="/one-time-gift" element={<OneTimeGift />} />
                  <Route path="/monthly-support" element={<MonthlySupport />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/cancel_subscription/:subscriptionId" element={<CancelSubscription />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/setup-password" element={<SetupPassword />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/payment-result" element={<PaymentResult />} />
                  <Route path="/membership-renewal" element={<MembershipRenewal />} />
                  <Route path="/cotisation-payment-result" element={<CotisationPaymentResult />} />
                  <Route path="/thank-you-cotisation" element={<ThankYouCotisation />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </StripeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
