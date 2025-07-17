
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
import FirmAdminProcessorManagement from './pages/FirmAdmin/ProcessorManagement';
import ProcessorDashboard from './pages/Processor/Dashboard';
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
                  path="/firm-admin/processors" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <FirmAdminProcessorManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Processor routes */}
                <Route 
                  path="/processor/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
                      <ProcessorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/processor/upload" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
                      <BrokerUploadDocuments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/processor/create-deal-form" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
                      <BrokerCreateDealForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/processor/business-profiles" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
                      <BrokerBusinessProfiles />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/processor/applications/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
                      <BrokerBusinessOwnerDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/processor/deals/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['Processor']}>
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
