
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Super Admin Pages
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import FirmDetails from "./pages/SuperAdmin/FirmDetails";

// Firm Admin Pages
import FirmAdminDashboard from "./pages/FirmAdmin/Dashboard";

// Broker Pages
import BrokerDashboard from "./pages/Broker/Dashboard";
import UploadDocuments from "./pages/Broker/UploadDocuments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
