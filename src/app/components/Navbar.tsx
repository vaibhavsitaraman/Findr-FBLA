import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import findrLogo from '../../images/logo findr.png';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  isDarkMode: boolean;
}

const activeButtonStyle = {
  background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
  color: '#ffffff',
  boxShadow: '0 2px 12px rgba(30, 58, 138, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(59, 130, 246, 0.4)',
  fontWeight: '600',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(4px)',
};

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogin, onLogout, userName }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Landing', path: 'landing', requiresAuth: false },
    { name: 'Listings', path: 'listings', requiresAuth: true },
    { name: 'Query', path: 'query', requiresAuth: true },
    { name: 'Stats', path: 'stats', requiresAuth: false },
    { name: 'Staff', path: 'staff', requiresAuth: true },
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none flex justify-center">
      <nav
        className={`pointer-events-auto border ${isScrolled ? 'rounded-2xl mt-3' : 'w-full'}`}
        style={{
          width: isScrolled ? '80%' : '100%',
          background: isScrolled
            ? 'linear-gradient(135deg, rgba(8, 15, 40, 0.55) 0%, rgba(15, 35, 100, 0.45) 50%, rgba(20, 50, 140, 0.4) 100%)'
            : 'transparent',
          borderColor: isScrolled ? 'rgba(99, 150, 255, 0.3)' : 'transparent',
          boxShadow: isScrolled
            ? '0 8px 32px rgba(8, 15, 40, 0.5), 0 0 0 1px rgba(99, 150, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
            : 'none',
          backdropFilter: isScrolled ? 'blur(28px) saturate(180%)' : 'blur(0px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="container mx-auto max-w-7xl flex h-14 sm:h-16 items-center justify-between px-4 sm:px-5">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity ml-4"
          >
            <img
              src={findrLogo}
              alt="Findr"
              className="h-8 md:h-9 w-auto drop-shadow-[0_0_18px_rgba(59,130,246,0.7)]"
            />
          </button>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.requiresAuth && !isLoggedIn) {
                    onLogin();
                  } else {
                    onNavigate(item.path);
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={
                  currentPage === item.path
                    ? activeButtonStyle
                    : { color: '#cbd5e1', background: 'transparent' }
                }
              >
                {item.name}
              </button>
            ))}

            {/* Account/Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                <button
                  onClick={() => onNavigate('account')}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={
                    currentPage === 'account'
                      ? activeButtonStyle
                      : { color: '#cbd5e1', background: 'transparent' }
                  }
                >
                  <User className="size-4" />
                  <span>{userName || 'Account'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    color: '#cbd5e1',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="ml-4 px-6 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={activeButtonStyle}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}