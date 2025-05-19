
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import NotFound from "./pages/NotFound";

// Super Admin Pages
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import FirmDetails from "./pages/SuperAdmin/FirmDetails";

// Firm Admin Pages
import FirmAdminDashboard from "./pages/FirmAdmin/Dashboard";

// Broker Pages
import BrokerDashboard from "./pages/Broker/Dashboard";
import UploadDocuments from "./pages/Broker/UploadDocuments";
import BusinessOwnerDetails from "./pages/Broker/BusinessOwnerDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-code" element={<VerifyCode />} />

              {/* Super Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/firms/:firmId" 
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <FirmDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Firm Admin Routes */}
              <Route 
                path="/firm/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["firmadmin"]}>
                    <FirmAdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Broker Routes */}
              <Route 
                path="/broker/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["broker"]}>
                    <BrokerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/broker/upload" 
                element={
                  <ProtectedRoute allowedRoles={["broker"]}>
                    <UploadDocuments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/broker/applications/:id" 
                element={
                  <ProtectedRoute allowedRoles={["broker"]}>
                    <BusinessOwnerDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
