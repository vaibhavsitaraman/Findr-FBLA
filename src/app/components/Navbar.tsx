import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import findrLogo from "../../images/logo findr.png";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  isDarkMode: boolean;
  userRole?: string;
}

const activeButtonStyle = {
  background:
    "linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
  color: "#ffffff",
  boxShadow:
    "0 2px 12px rgba(30, 58, 138, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(59, 130, 246, 0.4)",
  fontWeight: "600",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(4px)",
};

export function Navbar({
  currentPage,
  onNavigate,
  isLoggedIn,
  onLogin,
  onLogout,
  userName,
  userRole,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 12);
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true); // Keep it "scrolled" (fixed) when logged in
    }
  }, [isLoggedIn]);

  const navItems = [
    { name: "Landing", path: "landing", requiresAuth: false },
    { name: "Listings", path: "listings", requiresAuth: true },
    { name: "Query", path: "query", requiresAuth: true },
    { name: "Stats", path: "stats", requiresAuth: false },
    { name: "Cameras", path: "cameras", requiresAuth: true, requiresAdmin: true },
    { name: "Admin", path: "admin", requiresAuth: true, requiresAdmin: true },
    { name: "Staff", path: "staff", requiresAuth: true, requiresAdmin: true },
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none flex justify-center">
      <nav
        className={`pointer-events-auto border ${
          isLoggedIn ? "w-full" : isScrolled ? "rounded-2xl mt-3" : "w-full"
        }`}
        style={{
          width: isLoggedIn ? "100%" : isScrolled ? "80%" : "100%",
          background: isLoggedIn
            ? "linear-gradient(135deg, rgba(8, 15, 40, 0.95) 0%, rgba(15, 35, 100, 0.85) 50%, rgba(20, 50, 140, 0.8) 100%)"
            : isScrolled
              ? "linear-gradient(135deg, rgba(8, 15, 40, 0.55) 0%, rgba(15, 35, 100, 0.45) 50%, rgba(20, 50, 140, 0.4) 100%)"
              : "transparent",
          borderColor: isLoggedIn
            ? "rgba(59, 130, 246, 0.6)"
            : isScrolled
              ? "rgba(59, 130, 246, 0.4)"
              : "transparent",
          boxShadow: isLoggedIn
            ? "0 4px 24px rgba(8, 15, 40, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
            : isScrolled
              ? "0 8px 32px rgba(8, 15, 40, 0.5), 0 0 0 1px rgba(99, 150, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "none",
          backdropFilter: isLoggedIn
            ? "blur(20px) saturate(180%)"
            : isScrolled
              ? "blur(28px) saturate(180%)"
              : "blur(0px)",
          transition: isLoggedIn
            ? "none"
            : "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="container mx-auto max-w-7xl flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <img
              src={findrLogo}
              alt="Findr"
              className="h-6 md:h-8 w-auto drop-shadow-[0_0_18px_rgba(59,130,246,0.7)]"
            />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsScrolled(!isScrolled)}
          >
            <div className="flex flex-col gap-1">
              <div className="w-6 h-0.5 bg-white rounded"></div>
              <div className="w-6 h-0.5 bg-white rounded"></div>
              <div className="w-6 h-0.5 bg-white rounded"></div>
            </div>
          </button>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              // Hide staff option if not admin
              if (item.requiresAdmin && userRole !== "admin") {
                return null;
              }

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.requiresAuth && !isLoggedIn) {
                      onLogin();
                    } else {
                      onNavigate(item.path);
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 text-white/90 hover:text-white"
                  style={
                    currentPage === item.path
                      ? activeButtonStyle
                      : { color: "#cbd5e1", background: "transparent" }
                  }
                >
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden text-xs">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Account/Login */}
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-white/10 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate("account")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 text-white/90 hover:text-white"
                  style={
                    currentPage === "account"
                      ? activeButtonStyle
                      : { color: "#cbd5e1", background: "transparent" }
                  }
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">
                    {userName || "Account"}
                  </span>
                  <span className="sm:hidden text-xs">Account</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 text-white/90 hover:text-white"
                  style={{
                    color: "#cbd5e1",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden text-xs">Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={activeButtonStyle}
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden text-xs">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
