
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
import BrokerDealDetails from './pages/Broker/DealDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <InviteProvider>
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
                    <ProtectedRoute allowedRoles={['SuperAdmin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/firms/:firmId" 
                  element={
                    <ProtectedRoute allowedRoles={['SuperAdmin']}>
                      <SuperAdminFirmDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/invites" 
                  element={
                    <ProtectedRoute allowedRoles={['SuperAdmin']}>
                      <SuperAdminInviteManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Firm Admin routes */}
                <Route 
                  path="/firm-admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <FirmAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/firm-admin/brokers" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <FirmAdminBrokerManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Broker routes */}
                <Route 
                  path="/broker/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/upload" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerUploadDocuments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/create-deal-form" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerCreateDealForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/business-profiles" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerBusinessProfiles />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/applications/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerBusinessOwnerDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broker/deals/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['Broker']}>
                      <BrokerDealDetails />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </InviteProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
