import { Camera, User } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  isDarkMode: boolean;
}

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogin, onLogout, userName }: NavbarProps) {
  const navItems = [
    { name: 'Landing', path: 'landing', requiresAuth: false },
    { name: 'Listings', path: 'listings', requiresAuth: true },
    { name: 'Query', path: 'query', requiresAuth: true },
    { name: 'Stats', path: 'stats', requiresAuth: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/20">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <Camera className="size-8 text-blue-500" />
            <div 
              className="absolute -top-1 -right-1 size-3 rounded-full bg-orange-400"
            />
          </div>
          <span 
            className="font-bold tracking-tight text-white" 
            style={{ 
              fontSize: '1.5rem',
              fontFamily: "'EB Garamond', serif",
            }}
          >
            Findr
          </span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={currentPage === item.path ? 'default' : 'ghost'}
              onClick={() => {
                if (item.requiresAuth && !isLoggedIn) {
                  onLogin();
                } else {
                  onNavigate(item.path);
                }
              }}
              className={currentPage === item.path 
                ? 'bg-blue-600 text-white hover:bg-blue-700 font-medium' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'}
            >
              {item.name}
            </Button>
          ))}

          {/* Account/Login */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
              <Button
                variant={currentPage === 'account' ? 'default' : 'ghost'}
                onClick={() => onNavigate('account')}
                className={`flex items-center gap-2 ${currentPage === 'account' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
              >
                <User className="size-4" />
                <span>{userName || 'Account'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-sm border-white/20 text-gray-300 hover:bg-white/10 hover:text-white bg-transparent"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={onLogin}
              className="ml-4 bg-blue-600 text-white hover:bg-blue-700 font-medium px-6"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
