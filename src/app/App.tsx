import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { AlertBar } from "./components/AlertBar";
import { LandingPage } from "./components/LandingPage";
import { ListingsPage } from "./components/ListingsPage";
import { QueryPage } from "./components/QueryPage";
import { StatsPage } from "./components/StatsPage";
import { AccountPage } from "./components/AccountPage";
import { AuthDialog } from "./components/AuthDialog";
import { StaffPage } from "./components/StaffPage";
import { AdminPage } from "./components/AdminPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { UserService } from "../lib/database";

type Page =
  | "landing"
  | "listings"
  | "query"
  | "stats"
  | "account"
  | "admin"
  | "staff";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // isDarkMode is now always true conceptually, we can remove the state or just keep it true
  const isDarkMode = true;

  // Show alert bar only on certain pages
  const showAlertBar = [
    "listings",
    "query",
    "stats",
    "account",
    "staff",
  ].includes(currentPage);

  // Apply dark mode class to document always
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        toast.error(error.message);
        return;
      }

      const session = data.session;
      setIsLoggedIn(Boolean(session));
      setUserEmail(session?.user.email ?? "");
      setUserName(
        (session?.user.user_metadata?.full_name as string | undefined) ?? "",
      );

      if (session?.user.id) {
        const profile = await UserService.getUserByAuthId(session.user.id);
        setUserRole(profile?.role ?? "");
      } else {
        setUserRole("");
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: unknown, session: unknown) => {
        if (!isMounted) return;
        const typedSession = session as {
          user: {
            id: string;
            email?: string | null;
            user_metadata?: { full_name?: unknown; role?: unknown };
          };
        } | null;
        setIsLoggedIn(Boolean(typedSession));
        setUserEmail(typedSession?.user.email ?? "");
        setUserName(
          (typedSession?.user.user_metadata?.full_name as string | undefined) ??
            "",
        );

        if (typedSession?.user) {
          UserService.getUserByAuthId(typedSession.user.id)
            .then((profile) => {
              if (!isMounted) return;
              setUserRole(profile?.role ?? "");
            })
            .catch(() => {
              if (!isMounted) return;
              setUserRole("");
            });
        } else {
          setUserRole("");
        }

        if (event === "SIGNED_IN" && typedSession) {
          toast.success("Successfully signed in!", {
            description: "Welcome back to Findr",
          });
        }
      },
    );

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setIsAuthDialogOpen(true);
  };

  const handleLogout = () => {
    supabase.auth
      .signOut()
      .then((res: { error: { message: string } | null }) => {
        if (res.error) {
          toast.error(res.error.message);
          return;
        }
        setUserName("");
        setUserEmail("");
        setUserRole("");
        setCurrentPage("landing");
        toast.info("Logged out successfully");
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to sign out";
        toast.error(message);
      });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid rgba(148, 163, 184, 0.1)",
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
        userRole={userRole}
      />

      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />

      {/* Alert Bar */}
      {showAlertBar && <AlertBar />}

      {/* Page Content */}
      <main>
        {currentPage === "landing" && (
          <LandingPage
            onNavigate={handleNavigate}
            onLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            isDarkMode={isDarkMode}
          />
        )}

        {currentPage === "listings" && isLoggedIn && <ListingsPage />}

        {currentPage === "query" && isLoggedIn && <QueryPage />}

        {currentPage === "stats" && <StatsPage />}

        {currentPage === "account" && isLoggedIn && (
          <AccountPage userName={userName} userEmail={userEmail} />
        )}

        {currentPage === "admin" && isLoggedIn && userRole === "admin" && (
          <AdminPage />
        )}

        {currentPage === "staff" && isLoggedIn && userRole === "admin" && (
          <StaffPage />
        )}

        {/* Redirect to login if trying to access protected pages */}
        {!isLoggedIn &&
          ["listings", "query", "account", "admin", "staff"].includes(
            currentPage,
          ) && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    color: "#f8fafc",
                    fontSize: "2rem",
                  }}
                >
                  Please sign in to access this page
                </h2>
                <button
                  onClick={handleLogin}
                  className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16 py-8 backdrop-blur-md relative overflow-hidden"
        style={{
          borderColor: "rgba(148, 163, 184, 0.1)",
          background: "rgba(15, 23, 42, 0.8)",
        }}
      >
        {/* Purple glow at the bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "70%",
            height: "180px",
            background:
              "radial-gradient(ellipse at bottom, rgba(147, 51, 234, 0.35) 0%, rgba(109, 40, 217, 0.15) 40%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "'EB Garamond', serif",
                  color: "#f8fafc",
                }}
              >
                Findr
              </h3>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
              >
                "See it. Claim it. Get it."
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  marginTop: "0.5rem",
                }}
              >
                Making campus lost & found faster, smarter, and more secure.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: "#f8fafc" }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigate("landing")}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: "#94a3b8", fontSize: "0.875rem" }}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("listings")}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: "#94a3b8", fontSize: "0.875rem" }}
                  >
                    View Listings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("query")}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: "#94a3b8", fontSize: "0.875rem" }}
                  >
                    Report Lost Item
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("stats")}
                    className="hover:underline hover:text-blue-400 transition-colors"
                    style={{ color: "#94a3b8", fontSize: "0.875rem" }}
                  >
                    Statistics
                  </button>
                </li>
              </ul>
            </div>

            {/* Our Stack */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: "#f8fafc" }}>
                Our Stack
              </h4>
              <ul
                className="space-y-2"
                style={{ color: "#94a3b8", fontSize: "0.875rem" }}
              >
                <li>🎥 Security Camera Integration</li>
                <li>🤖 YOLO v11 AI Detection</li>
                <li>⚛️ React & TypeScript</li>
                <li>🗄️ PostgreSQL Database</li>
                <li>📱 Swift Mobile App (iOS)</li>
              </ul>
            </div>

            {/* iOS Download */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: "#f8fafc" }}>
                Get the App
              </h4>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  marginBottom: "0.75rem",
                }}
              >
                Download our iOS app and get notified the moment your item is
                found.
              </p>
              <a
                href="https://apps.apple.com/your-app-link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-transform duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#f8fafc",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on the App Store
              </a>
            </div>
          </div>
          {/* Copyright */}
          <div
            className="mt-8 pt-8 text-center border-t"
            style={{ borderColor: "rgba(148, 163, 184, 0.1)" }}
          >
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              © 2026 Findr. All rights reserved. Built with ❤️ for campus
              communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
