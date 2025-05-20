
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InviteProvider } from "./contexts/InviteContext";
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
import InviteManagement from "./pages/SuperAdmin/InviteManagement";

// Firm Admin Pages
import FirmAdminDashboard from "./pages/FirmAdmin/Dashboard";
import BrokerManagement from "./pages/FirmAdmin/BrokerManagement";

// Broker Pages
import BrokerDashboard from "./pages/Broker/Dashboard";
import UploadDocuments from "./pages/Broker/UploadDocuments";
import BusinessOwnerDetails from "./pages/Broker/BusinessOwnerDetails";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => {
  return (
    // Fix: Properly wrap the application with QueryClientProvider
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <InviteProvider>
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
                  <Route 
                    path="/admin/invites" 
                    element={
                      <ProtectedRoute allowedRoles={["superadmin"]}>
                        <InviteManagement />
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
                  <Route 
                    path="/firm/brokers" 
                    element={
                      <ProtectedRoute allowedRoles={["firmadmin"]}>
                        <BrokerManagement />
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
              </InviteProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
