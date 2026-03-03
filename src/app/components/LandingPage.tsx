import {
  Camera,
  Sparkles,
  Search,
  Shield,
  Clock,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrustedBy } from "./TrustedBy";
import { FeatureTabs } from "./FeatureTabs";
import { useState, useEffect } from "react";
import findrAiCore from "../../images/findr_ai_core.png";
import findrLogoOnly from "../../images/findr_logo_only.png";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  isDarkMode: boolean;
}

export function LandingPage({
  onNavigate,
  onLogin,
  isLoggedIn,
  isDarkMode,
}: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Camera,
      title: "AI-Powered Detection",
      description:
        "Automatic detection of lost items using advanced computer vision and YOLO v11 technology.",
      color: "from-blue-500 to-cyan-400",
      image:
        "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800",
    },
    {
      icon: Search,
      title: "Real-Time Query",
      description:
        "Quickly find your lost items with powerful natural language search.",
      color: "from-purple-500 to-pink-400",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    },
    {
      icon: Shield,
      title: "Secure Verification",
      description:
        "ID verification and face matching ensure items reach their rightful owners.",
      color: "from-emerald-500 to-green-400",
      image:
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800",
    },
    {
      icon: Clock,
      title: "Instant Updates",
      description:
        "Get notified immediately when your lost item is detected or claimed.",
      color: "from-orange-500 to-amber-400",
      image:
        "https://images.unsplash.com/photo-1579389083395-4507e98b5e67?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const howItWorks = [
    {
      number: 1,
      title: "AI detects items.",
      description:
        "Our YOLO v11 computer vision system monitors security cameras 24/7. When an item is detected, it's instantly logged.",
      imageUrl:
        "https://images.unsplash.com/photo-1757323148943-2ae82a19ec9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNhbWVyYSUyMHN1cnZlaWxsYW5jZSUyMHN5c3RlbXxlbnwxfHx8fDE3NzE1NTgxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      number: 2,
      title: "Smart matching.",
      description:
        "We match detected items against lost item reports using vector similarity and location data.",
      imageUrl:
        "https://images.unsplash.com/photo-1762329397003-f35d51b38d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGFwcCUyMGludGVyZmFjZSUyMHN0dWRlbnR8ZW58MXx8fHwxNzcxNTU4MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      number: 3,
      title: "Claim & Verify.",
      description:
        "Owners are notified and can claim their item through the app. Verification is handled securely on pickup.",
      imageUrl:
        "https://images.unsplash.com/photo-1591291105374-ca96d4213ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHZlcmlmaWNhdGlvbiUyMElEJTIwYmFkZ2V8ZW58MXx8fHwxNzcxNTU4MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center pt-20">
        {/* Sky Gradient Background - Cluely Style */}
        <div
          className="absolute inset-0 -z-10 transition-colors duration-700"
          style={{
            background: isDarkMode
              ? "radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 100%)"
              : "radial-gradient(ellipse at top, #dbeafe 0%, #ffffff 100%)",
          }}
        >
          {/* Animated Mesh Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.5) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(147, 51, 234, 0.5) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.5) 0px, transparent 50%)",
              filter: "blur(100px)",
            }}
          />

          {/* Blue Ambient Gradient Blob */}
          <div
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "800px",
                height: "800px",
                borderRadius: "50%",
                background: isDarkMode
                  ? "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(37,99,235,0.15) 40%, transparent 70%)"
                  : "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(147,197,253,0.12) 40%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
          </div>
          {/* Mountain Landscape SVG - Cluely Motif */}
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ height: "35%", minHeight: "200px" }}
          >
            <path
              fill={
                isDarkMode
                  ? "rgba(30, 58, 138, 0.4)"
                  : "rgba(191, 219, 254, 0.4)"
              }
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path
              fill={
                isDarkMode
                  ? "rgba(30, 64, 175, 0.6)"
                  : "rgba(147, 197, 253, 0.6)"
              }
              fillOpacity="1"
              d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path
              fill={
                isDarkMode
                  ? "rgba(30, 64, 175, 0.9)"
                  : "rgba(96, 165, 250, 0.8)"
              }
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 relative z-10">
          {/* Glowing Moon/Globe Effect */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "60%",
              left: "50%",
              transform: `translateX(-50%) translateY(-50%) scale(${0.8 + Math.min(scrollY / 400, 1) * 0.2})`,
              width: "150vw",
              height: "150vw",
              maxWidth: "1400px",
              maxHeight: "1400px",
              opacity: 0.6 + Math.min(scrollY / 300, 1) * 0.4,
              transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              zIndex: 1,
            }}
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle, rgba(30, 58, 138, 0.5) 0%, rgba(15, 23, 42, 0.4) 30%, rgba(30, 58, 138, 0.3) 60%, transparent 100%)"
                  : "radial-gradient(circle, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.35) 30%, rgba(30, 58, 138, 0.25) 60%, transparent 100%)",
                filter: "blur(100px)",
                transform: "translateZ(0)",
              }}
            />
            {/* Inner core */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4) 0%, rgba(30, 58, 138, 0.35) 40%, rgba(15, 23, 42, 0.3) 70%, transparent 100%)"
                  : "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.35) 0%, rgba(30, 58, 138, 0.3) 40%, rgba(15, 23, 42, 0.25) 70%, transparent 100%)",
                filter: "blur(80px)",
                transform: "translateZ(0)",
              }}
            />
            {/* Bright center */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.3) 0%, rgba(59, 130, 246, 0.25) 30%, rgba(30, 58, 138, 0.2) 60%, transparent 100%)"
                  : "radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.2) 30%, rgba(30, 58, 138, 0.15) 60%, transparent 100%)",
                filter: "blur(60px)",
                transform: "translateZ(0)",
              }}
            />
          </div>

          <div className="flex flex-col items-center text-center gap-10 relative z-10">
            {/* Cluely-style pill badge */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-foreground shadow-lg">
                <Sparkles className="size-4 text-blue-500" />
                <span
                  className={isDarkMode ? "text-blue-200" : "text-blue-700"}
                >
                  Findr is live
                </span>
              </span>
            </div>

            {/* Hero Heading with EB Garamond */}
            <div
              className="max-w-5xl space-y-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h1
                className="tracking-tight"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "clamp(3.5rem, 8vw, 6rem)",
                  lineHeight: "0.95",
                  color: isDarkMode ? "#ffffff" : "#1e3a8a",
                  textShadow: isDarkMode
                    ? "0 0 40px rgba(59, 130, 246, 0.3)"
                    : "none",
                }}
              >
                See it. Claim it.
                <span className="italic text-blue-500">Get it.</span>
              </h1>

              <p
                className="mx-auto max-w-3xl text-base md:text-lg opacity-90"
                style={{
                  color: isDarkMode ? "#cbd5e1" : "#475569",
                  lineHeight: "1.6",
                }}
              >
                Findr transforms lost & found management with{" "}
                <span
                  className="relative px-2.5 py-1 rounded-md"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)"
                      : "linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    color: "#ffffff",
                    boxShadow:
                      "0 2px 12px rgba(30, 58, 138, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    display: "inline-block",
                    fontWeight: "600",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  camera-assisted detection
                </span>{" "}
                and{" "}
                <span
                  className="relative px-2.5 py-1 rounded-md"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)"
                      : "linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    color: "#ffffff",
                    boxShadow:
                      "0 2px 12px rgba(30, 58, 138, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    display: "inline-block",
                    fontWeight: "600",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  individualized, account-based item listings
                </span>{" "}
                for{" "}
                <span
                  className="relative px-2.5 py-1 rounded-md"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)"
                      : "linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    color: "#ffffff",
                    boxShadow:
                      "0 2px 12px rgba(30, 58, 138, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    display: "inline-block",
                    fontWeight: "600",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  faster returns
                </span>
                .
              </p>
            </div>

            {/* CTA Buttons - Conversion Style */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => onNavigate("listings")}
                    className="group relative px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 text-white overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                      transform: "scale(1)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {/* Ripple effect overlay */}
                    <span
                      className="ripple-effect absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.3) 40%, rgba(96,165,250,0.2) 60%, transparent 80%)",
                        transform: "scale(0)",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Launch App
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="group relative px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 text-white overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                      transform: "scale(1)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {/* Ripple effect overlay */}
                    <span
                      className="ripple-effect absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.3) 40%, rgba(96,165,250,0.2) 60%, transparent 80%)",
                        transform: "scale(0)",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Start Finding
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Floating UI Element - Glassmorphism */}
            <div
              className="mt-12 p-4 rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5 shadow-2xl max-w-4xl w-full animate-fade-in-up hidden md:block"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-4 mb-4 px-4">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-muted-foreground opacity-70">
                  findr_ai_core_system.tsx
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-black/40 aspect-[21/9] flex items-center justify-center group">
                <img
                  src={findrAiCore}
                  alt="Findr AI Core System"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Conversion Style */}
      <TrustedBy />

      {/* Four Ways / Features - Horizontal Row Style */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Four ways we secure <br />
            your belongings.
          </h2>
        </div>

        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,64,175,0.5) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  transition: "all 0.4s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,64,175,0.9) 35%, rgba(59,130,246,0.85) 100%)";
                  e.currentTarget.style.borderColor =
                    "rgba(191, 219, 254, 0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(15,23,42,0.8), inset 0 1px 0 rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,64,175,0.5) 100%)";
                  e.currentTarget.style.borderColor =
                    "rgba(148, 163, 184, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="absolute inset-0 backdrop-blur-sm" />
                <div className="relative p-6 flex flex-col h-full min-h-[300px]">
                  <div className="bg-white/10 w-fit p-3 rounded-xl backdrop-blur-md mb-4 shadow-lg group-hover:bg-white/20 transition-colors">
                    <feature.icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Tabs - Conversion Style */}
      <FeatureTabs />

      {/* Meeting Notes / How it Works - Cluely 3 Steps Layout */}
      {/* How it Works - Left content, Right images */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Recover items in 3 steps
            </h2>
            <p className="text-xl text-muted-foreground">
              The easiest way to get your stuff back.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
            {/* Left: Stacked Steps */}
            <div className="flex flex-col lg:w-1/2">
              {/* Step 1 */}
              <div className="flex gap-6" style={{ minHeight: "280px" }}>
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                    1
                  </div>
                  <div className="w-px flex-1 mt-3 bg-border" />
                </div>
                <div className="pb-16 pt-1">
                  <h3 className="text-3xl font-bold mb-3">
                    {howItWorks[0].title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {howItWorks[0].description}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6" style={{ minHeight: "280px" }}>
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                    2
                  </div>
                  <div className="w-px flex-1 mt-3 bg-border" />
                </div>
                <div className="pb-16 pt-1">
                  <h3 className="text-3xl font-bold mb-3">
                    {howItWorks[1].title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {howItWorks[1].description}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6" style={{ minHeight: "280px" }}>
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                    3
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-3xl font-bold mb-3">
                    {howItWorks[2].title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {howItWorks[2].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Stacked Images */}
            <div className="lg:w-1/2 w-full flex flex-col gap-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <img
                  src="src/images/ai model 2.png"
                  alt="AI detection visualization"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <img
                  src="src/images/MatchingPNG.png"
                  alt="Smart matching visualization"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <img
                  src="src/images/Claimmake.png"
                  alt="Claim and verify"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA - Conversion Style */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <img
              src={findrLogoOnly}
              alt="Findr"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold mb-8"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Ready to secure your campus?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-background/80">
            Join the network of smart campuses using Findr to protect what
            matters.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="group relative px-8 py-4 bg-background text-foreground rounded-full font-bold text-lg overflow-hidden"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Ripple effect overlay */}
              <span
                className="ripple-effect absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,200,0.2) 40%, rgba(150,150,150,0.1) 60%, transparent 80%)",
                  transform: "scale(0)",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <span className="relative z-10">Get Started Now</span>
            </button>
            <button
              className="group relative px-8 py-4 border border-background/30 text-background rounded-full font-bold text-lg overflow-hidden"
              style={{
                transform: "scale(1)",
                transition:
                  "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* Ripple effect overlay */}
              <span
                className="ripple-effect absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(200,200,200,0.15) 40%, rgba(150,150,150,0.1) 60%, transparent 80%)",
                  transform: "scale(0)",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <span className="relative z-10">Contact Sales</span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .group:hover .ripple-effect {
          animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
