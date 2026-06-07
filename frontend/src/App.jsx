import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import store from './redux/store';
import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/SplashScreen';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FreelancerDashboard from './pages/dashboard/FreelancerDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Jobs from './pages/jobs/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Messages from './pages/messages/Messages';
import Notifications from './pages/Notifications';
import Payment from './pages/payment/Payment';
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import NotFound from './pages/NotFound';
import CommandPalette from './components/common/CommandPalette';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Navbar />
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Public routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard/recruiter" element={<ClientDashboard />} />
              <Route path="/dashboard/startup" element={<ClientDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/jobs/new" element={<PostJob />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
