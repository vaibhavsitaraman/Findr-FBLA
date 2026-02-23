import { Camera, Sparkles, Search, Shield, Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { TrustedBy } from './TrustedBy';
import { FeatureTabs } from './FeatureTabs';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  isDarkMode: boolean;
}

export function LandingPage({ onNavigate, onLogin, isLoggedIn, isDarkMode }: LandingPageProps) {
  const features = [
    {
      icon: Camera,
      title: 'AI-Powered Detection',
      description: 'Automatic detection of lost items using advanced computer vision and YOLO v11 technology.',
      color: 'from-blue-500 to-cyan-400',
      image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800',
    },
    {
      icon: Search,
      title: 'Real-Time Query',
      description: 'Quickly find your lost items with powerful natural language search.',
      color: 'from-purple-500 to-pink-400',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    },
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'ID verification and face matching ensure items reach their rightful owners.',
      color: 'from-emerald-500 to-green-400',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
    },
    {
      icon: Clock,
      title: 'Instant Updates',
      description: 'Get notified immediately when your lost item is detected or claimed.',
      color: 'from-orange-500 to-amber-400',
      image: 'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const howItWorks = [
    {
      number: 1,
      title: 'AI detects items.',
      description: 'Our YOLO v11 computer vision system monitors security cameras 24/7. When an item is detected, it\'s instantly logged.',
      imageUrl: 'https://images.unsplash.com/photo-1757323148943-2ae82a19ec9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNhbWVyYSUyMHN1cnZlaWxsYW5jZSUyMHN5c3RlbXxlbnwxfHx8fDE3NzE1NTgxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      number: 2,
      title: 'Smart matching.',
      description: 'We match detected items against lost item reports using vector similarity and location data.',
      imageUrl: 'https://images.unsplash.com/photo-1762329397003-f35d51b38d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGFwcCUyMGludGVyZmFjZSUyMHN0dWRlbnR8ZW58MXx8fHwxNzcxNTU4MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      number: 3,
      title: 'Claim & Verify.',
      description: 'Owners are notified and can claim their item through the app. Verification is handled securely on pickup.',
      imageUrl: 'https://images.unsplash.com/photo-1591291105374-ca96d4213ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHZlcmlmaWNhdGlvbiUyMElEJTIwYmFkZ2V8ZW58MXx8fHwxNzcxNTU4MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
              ? 'radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 100%)'
              : 'radial-gradient(ellipse at top, #dbeafe 0%, #ffffff 100%)',
          }}
        >
          {/* Animated Mesh Gradient Overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.5) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(147, 51, 234, 0.5) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.5) 0px, transparent 50%)',
              filter: 'blur(100px)',
            }}
          />

          {/* Blue Ambient Gradient Blob */}
          <div 
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div 
              style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                height: '800px',
                borderRadius: '50%',
                background: isDarkMode
                  ? 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(37,99,235,0.15) 40%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(147,197,253,0.12) 40%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>
          {/* Mountain Landscape SVG - Cluely Motif */}
          <svg 
            className="absolute bottom-0 w-full" 
            viewBox="0 0 1440 320" 
            preserveAspectRatio="none"
            style={{ height: '35%', minHeight: '200px' }}
          >
            <path 
              fill={isDarkMode ? 'rgba(30, 58, 138, 0.4)' : 'rgba(191, 219, 254, 0.4)'} 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path 
              fill={isDarkMode ? 'rgba(30, 64, 175, 0.6)' : 'rgba(147, 197, 253, 0.6)'} 
              fillOpacity="1" 
              d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path 
              fill={isDarkMode ? 'rgba(30, 64, 175, 0.9)' : 'rgba(96, 165, 250, 0.8)'} 
              fillOpacity="1" 
              d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center gap-10">
            {/* Cluely-style pill badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-foreground shadow-lg">
                <Sparkles className="size-4 text-blue-500" />
                <span className={isDarkMode ? "text-blue-200" : "text-blue-700"}>Findr v2.0 is now live</span>
              </span>
            </div>

            {/* Hero Heading with EB Garamond */}
            <div className="max-w-5xl space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 
                className="tracking-tight"
                style={{ 
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                  lineHeight: '0.95',
                  color: isDarkMode ? '#ffffff' : '#1e3a8a',
                  textShadow: isDarkMode ? '0 0 40px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                The new standard for <br />
                <span className="italic text-blue-500">lost & found</span> on campus.
              </h1>
              
              <p 
                className="mx-auto max-w-2xl text-lg md:text-xl opacity-90"
                style={{ 
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  lineHeight: '1.6'
                }}
              >
                Findr uses AI to <b>detect</b>, <b>log</b>, and <b>match</b> lost items in <b>real-time</b>. 
                Seamlessly integrated with campus security for a safer, smarter community.
              </p>
            </div>

            {/* CTA Buttons - Conversion Style */}
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => onNavigate('listings')}
                    className="group relative px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)',
                      boxShadow: '0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Launch App
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="group relative px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)',
                      boxShadow: '0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Start Finding
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* Floating UI Element - Glassmorphism */}
            <div 
              className="mt-12 p-4 rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5 shadow-2xl max-w-4xl w-full animate-fade-in-up hidden md:block"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-4 mb-4 px-4">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-muted-foreground opacity-70">findr_ai_core_system.tsx</div>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-black/40 aspect-[21/9] flex items-center justify-center group">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
                  alt="Dashboard Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating Notification */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle2 className="size-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Item Detected</div>
                        <div className="text-xs text-white/60">MacBook Pro matching user #4829</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Conversion Style */}
      <TrustedBy />

      {/* Four Ways / Features - Cluely Horizontal Scroll Style */}
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

        <div className="flex overflow-x-auto pb-12 px-4 snap-x snap-mandatory gap-6 no-scrollbar lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8 lg:overflow-visible container mx-auto max-w-7xl">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="min-w-[85vw] md:min-w-[400px] lg:min-w-0 snap-start rounded-[2rem] overflow-hidden relative group h-[400px] lg:h-[500px]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90 transition-opacity group-hover:opacity-100`} />
              <img 
                src={feature.image} 
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4 shadow-lg">
                  <feature.icon className="size-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{feature.title}</h3>
                <p className="text-lg text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Tabs - Conversion Style */}
      <FeatureTabs />

      {/* Meeting Notes / How it Works - Cluely 3 Steps Layout */}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex flex-col gap-6 group">
                <div className="relative rounded-3xl overflow-hidden aspect-square bg-muted">
                  <img 
                    src={step.imageUrl} 
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 size-12 rounded-full bg-white/90 backdrop-blur text-foreground flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA - Conversion Style */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>
            Ready to secure your campus?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-background/80">
            Join the network of smart campuses using Findr to protect what matters.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-background text-foreground rounded-full font-bold text-lg hover:scale-105 transition-transform">
              Get Started Now
            </button>
            <button className="px-8 py-4 border border-background/30 text-background rounded-full font-bold text-lg hover:bg-background/10 transition-colors">
              Contact Sales
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
      `}</style>
    </div>
  );
}
