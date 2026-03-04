import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InfoModalProvider } from './context/InfoModalContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import ServicesSection from './components/ServicesSection/ServicesSection';
import CtaSection from './components/CtaSection/CtaSection';
import AuthPage from './pages/AuthPage/AuthPage';
import TermsPage from './pages/TermsPage/TermsPage';
import PrivacyPage from './pages/TermsPage/PrivacyPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SecuritySettingsPage from './pages/SecuritySettingsPage/SecuritySettingsPage';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import ConsultationsPage from './pages/ConsultationsPage/ConsultationsPage';
import ServicesPage from './pages/ServicesPage/ServicesPage'; 
import DoctorsPage from './pages/DoctorsPage/DoctorsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import DoctorDetailPage from './pages/DoctorDetailPage/DoctorDetailPage';
import './style/Global.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Загрузка...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Главная страница
function HomePage() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <ServicesSection />
      <CtaSection />
    </>
  );
}

// Основной компонент с роутингом
function App() {
  return (
    <AuthProvider>
      <InfoModalProvider>
        <Router>
          <div className="app">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/security" element={
                <ProtectedRoute>
                  <SecuritySettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/consultations" element={<ConsultationsPage />} />
              <Route path="/services" element={<ServicesPage />} /> 
              <Route path="/doctors" element={<DoctorsPage />} />
               <Route path="/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
          </div>
        </Router>
      </InfoModalProvider>
    </AuthProvider>
  );
}

export default App;