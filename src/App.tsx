
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InviteProvider } from './contexts/InviteContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Dashboard pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import SuperAdminFirmDetails from './pages/SuperAdmin/FirmDetails';
import SuperAdminInviteManagement from './pages/SuperAdmin/InviteManagement';
import FirmAdminDashboard from './pages/FirmAdmin/Dashboard';
import FirmAdminBrokerManagement from './pages/FirmAdmin/BrokerManagement';
import BrokerDashboard from './pages/Broker/Dashboard';
import BrokerUploadDocuments from './pages/Broker/UploadDocuments';
import BrokerCreateDealForm from './pages/Broker/CreateDealForm';
import BrokerBusinessProfiles from './pages/Broker/BusinessProfiles';
import BrokerBusinessOwnerDetails from './pages/Broker/BusinessOwnerDetails';

function App() {
  return (
    <AuthProvider>
      <InviteProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Super Admin routes */}
                <Route 
                  path="/super-admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/firms/:firmId" 
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <SuperAdminFirmDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/invites" 
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <SuperAdminInviteManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Firm Admin routes */}
                <Route 
                  path="/firm-admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['firm_admin']}>
                      <FirmAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/firm-admin/brokers" 
                  element={
                    <ProtectedRoute allowedRoles={['firm_admin']}>
                      <FirmAdminBrokerManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Broker routes */}
                <Route 
                  path="/broker/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['broker']}>
                      <BrokerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/upload" 
                  element={
                    <ProtectedRoute allowedRoles={['broker']}>
                      <BrokerUploadDocuments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/create-deal-form" 
                  element={
                    <ProtectedRoute allowedRoles={['broker']}>
                      <BrokerCreateDealForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/business-profiles" 
                  element={
                    <ProtectedRoute allowedRoles={['broker']}>
                      <BrokerBusinessProfiles />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/applications/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['broker']}>
                      <BrokerBusinessOwnerDetails />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </InviteProvider>
    </AuthProvider>
  );
}

export default App;
