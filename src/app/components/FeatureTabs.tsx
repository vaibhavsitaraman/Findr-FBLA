import { useState } from "react";
import { User, Briefcase } from "lucide-react";
import studentsView from "../../images/Students_view.png";
import forStaffView from "../../images/forstaff.png";

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      title: "For Students",
      icon: User,
      description:
        "Quickly report lost items or browse the database. Get notified instantly when your stuff is found.",
      image: studentsView,
    },
    {
      id: 1,
      title: "For Staff",
      icon: Briefcase,
      description:
        "Efficiently log found items with AI detection. Manage inventory and process claims with ease.",
      image: forStaffView,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Headings & Tabs */}
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-4xl font-bold font-serif text-white">
              Designed for Everyone
            </h2>

            <div className="space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border border-white/10 ${
                    activeTab === tab.id
                      ? "bg-white/10 shadow-lg scale-105 backdrop-blur-md"
                      : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`p-2 rounded-lg ${activeTab === tab.id ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-gray-400"}`}
                    >
                      <tab.icon className="size-6" />
                    </div>
                    <h3
                      className={`text-xl font-semibold ${activeTab === tab.id ? "text-white" : "text-gray-300"}`}
                    >
                      {tab.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${activeTab === tab.id ? "text-gray-200" : "text-gray-500"}`}
                  >
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Image/Content */}
          <div className="lg:w-2/3 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeTab === tab.id ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={tab.image}
                  alt={tab.title}
                  className={`w-full h-full object-cover ${
                    tab.id === 0 ? "object-contain" : "object-cover"
                  } opacity-80`}
                  style={{
                    objectFit: tab.id === 0 ? "contain" : "cover",
                    objectPosition: tab.id === 1 ? "left" : "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-white">
                    <tab.icon className="size-4 text-blue-400" />
                    <span className="text-sm font-medium">
                      {tab.title} View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
