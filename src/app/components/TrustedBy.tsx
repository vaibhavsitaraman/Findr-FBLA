import { useEffect, useRef } from 'react';

export function TrustedBy() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock partners/campuses
  const partners = [
    { name: 'Stanford', logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d50c20f?auto=format&fit=crop&q=80&w=200&h=80' },
    { name: 'MIT', logo: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&q=80&w=200&h=80' },
    { name: 'Berkeley', logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d50c20f?auto=format&fit=crop&q=80&w=200&h=80' },
    { name: 'UCLA', logo: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&q=80&w=200&h=80' },
    { name: 'Harvard', logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d50c20f?auto=format&fit=crop&q=80&w=200&h=80' },
    { name: 'Yale', logo: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&q=80&w=200&h=80' },
  ];

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-4 mb-8">
        <div className="relative border-t border-b border-white/10 py-8">
          {/* Dashed lines decorations */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
          
          <h3 className="text-center text-sm font-semibold tracking-wider uppercase text-gray-400 mb-8 font-sans">
            Trusted by Top Campuses
          </h3>

          <div className="relative w-full overflow-hidden">
            <div 
              className="flex items-center gap-16 animate-scroll whitespace-nowrap"
              style={{
                animation: 'scroll 30s linear infinite',
                width: 'max-content'
              }}
            >
              {[...partners, ...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                  <span className="text-2xl font-bold text-white font-serif tracking-tight">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
