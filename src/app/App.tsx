import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AlertBar } from './components/AlertBar';
import { LandingPage } from './components/LandingPage';
import { ListingsPage } from './components/ListingsPage';
import { QueryPage } from './components/QueryPage';
import { StatsPage } from './components/StatsPage';
import { AccountPage } from './components/AccountPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type Page = 'landing' | 'listings' | 'query' | 'stats' | 'account';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // isDarkMode is now always true conceptually, we can remove the state or just keep it true
  const isDarkMode = true;

  // Show alert bar only on certain pages
  const showAlertBar = ['listings', 'query', 'stats', 'account'].includes(currentPage);

  // Apply dark mode class to document always
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = () => {
    // Mock login - in production this would be real authentication
    setIsLoggedIn(true);
    setUserName('Alex Johnson');
    setUserEmail('alex.johnson@school.edu');
    toast.success('Successfully logged in!', {
      description: 'Welcome back to Findr',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setCurrentPage('landing');
    toast.info('Logged out successfully');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaim = (itemId: string) => {
    toast.success('Item claimed successfully!', {
      description: 'Please visit the main office to pick up your item.',
      duration: 5000,
    });
    console.log('Claimed item:', itemId);
  };

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Exclude animations and transforms from smooth transitions */
        *:where([style*="animation"], [style*="transform"]) {
          transition-property: background-color, border-color, color;
        }
      `}</style>

      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          },
        }}
      />

      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userName={userName}
        isDarkMode={isDarkMode}
      />

      {/* Alert Bar */}
      {showAlertBar && <AlertBar />}

      {/* Page Content */}
      <main>
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            isDarkMode={isDarkMode}
          />
        )}

        {currentPage === 'listings' && isLoggedIn && (
          <ListingsPage onClaim={handleClaim} />
        )}

        {currentPage === 'query' && isLoggedIn && (
          <QueryPage />
        )}

        {currentPage === 'stats' && (
          <StatsPage />
        )}

        {currentPage === 'account' && isLoggedIn && (
          <AccountPage userName={userName} userEmail={userEmail} />
        )}

        {/* Redirect to login if trying to access protected pages */}
        {!isLoggedIn && ['listings', 'query', 'account'].includes(currentPage) && (
          <div 
            className="min-h-screen flex items-center justify-center"
          >
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
              <h2 
                className="mb-4"
                style={{ 
                  fontFamily: "'EB Garamond', serif",
                  color: '#f8fafc',
                  fontSize: '2rem'
                }}
              >
                Please sign in to access this page
              </h2>
              <button
                onClick={handleLogin}
                className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#3b82f6' }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-16 py-8 bg-card/50 backdrop-blur-md"
        style={{ borderColor: 'rgba(148, 163, 184, 0.1)' }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 
                className="font-bold mb-2"
                style={{ 
                  fontSize: '1.5rem',
                  fontFamily: "'EB Garamond', serif",
                  color: '#f8fafc'
                }}
              >
                Findr
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
                "See it. Claim it. Get it."
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
                Making campus lost & found faster, smarter, and more secure.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: '#f8fafc' }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('listings')}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                  >
                    View Listings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('query')}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                  >
                    Report Lost Item
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('stats')}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                  >
                    Statistics
                  </button>
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: '#f8fafc' }}>
                Powered By
              </h4>
              <ul className="space-y-2" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                <li>🎥 Security Camera Integration</li>
                <li>🤖 YOLO v11 AI Detection</li>
                <li>⚛️ React & TypeScript</li>
                <li>🗄️ PostgreSQL Database</li>
                <li>📱 Swift Mobile App (iOS)</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div 
            className="mt-8 pt-8 text-center border-t"
            style={{ borderColor: 'rgba(148, 163, 184, 0.1)' }}
          >
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              © 2026 Findr. All rights reserved. Built with ❤️ for campus communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
