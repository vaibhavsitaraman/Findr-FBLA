import { Card } from "./ui/card";
import {
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Camera,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

export function StatsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  // Mock statistics data
  const stats = {
    totalItems: 247,
    recoveredToday: 12,
    aiDetected: 156,
    totalRecovered: 189,
    nextDonationDate: "March 15, 2026",
    daysUntilDonation: 23,
  };

  // Chart data
  const weeklyData = [
    { day: "Mon", lost: 8, found: 6 },
    { day: "Tue", lost: 12, found: 9 },
    { day: "Wed", lost: 15, found: 11 },
    { day: "Thu", lost: 10, found: 8 },
    { day: "Fri", lost: 14, found: 12 },
    { day: "Sat", lost: 6, found: 5 },
    { day: "Sun", lost: 4, found: 3 },
  ];

  const categoryData = [
    { name: "Backpacks", value: 45, color: "#3b82f6" },
    { name: "Electronics", value: 38, color: "#1e40af" },
    { name: "Clothing", value: 32, color: "#22c55e" },
    { name: "Keys", value: 28, color: "#f59e0b" },
    { name: "Water Bottles", value: 24, color: "#64748b" },
    { name: "Books", value: 22, color: "#a855f7" },
    { name: "Other", value: 58, color: "#cbd5e1" },
  ];

  const monthlyTrend = [
    { month: "Oct", items: 52 },
    { month: "Nov", items: 68 },
    { month: "Dec", items: 45 },
    { month: "Jan", items: 73 },
    { month: "Feb", items: 82 },
  ];

  const recoveryRate = Math.round(
    (stats.totalRecovered / stats.totalItems) * 100,
  );

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
          transition: "background 0.1s ease-out",
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 relative z-20">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2 text-white"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "2.5rem",
            }}
          >
            Lost & Found Statistics
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time insights into campus lost and found activity
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Items */}
          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Items</span>
              <Package className="size-5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl text-white">
                {stats.totalItems}
              </span>
              <span className="text-gray-500 text-sm">items logged</span>
            </div>
          </Card>

          {/* Recovered Today */}
          <Card
            className="p-6 border border-green-500/20 bg-green-500/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-green-500/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-200/80 text-sm">Recovered Today</span>
              <CheckCircle className="size-5 text-green-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl text-green-100">
                {stats.recoveredToday}
              </span>
              <span className="text-green-200/60 text-sm">items claimed</span>
            </div>
          </Card>

          {/* AI Detected */}
          <Card
            className="p-6 border border-orange-500/20 bg-orange-500/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-orange-500/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(249,115,22,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-200/80 text-sm">AI Detected</span>
              <Camera className="size-5 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl text-orange-100">
                {stats.aiDetected}
              </span>
              <span className="text-orange-200/60 text-sm">by cameras</span>
            </div>
          </Card>

          {/* Recovery Rate */}
          <Card
            className="p-6 border border-blue-500/20 bg-blue-500/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-200/80 text-sm">Recovery Rate</span>
              <TrendingUp className="size-5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl text-blue-100">
                {recoveryRate}%
              </span>
              <span className="text-blue-200/60 text-sm">success rate</span>
            </div>
          </Card>
        </div>

        {/* Donation Info Banner */}
        <Card
          className="p-6 mb-8 border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-500/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:from-orange-500/15 hover:to-orange-500/8 cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)",
            boxShadow:
              "0 8px 32px rgba(249,115,22,0.3), 0 0 0 1px rgba(249,115,22,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500 shadow-lg shadow-orange-500/20">
              <Calendar className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-orange-100">
                Next Donation Date
              </h3>
              <p className="text-orange-200/80">
                Unclaimed items will be donated on{" "}
                <span className="font-semibold text-orange-300">
                  {stats.nextDonationDate}
                </span>{" "}
                ({stats.daysUntilDonation} days remaining)
              </p>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity */}
          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <h3 className="mb-6 text-xl font-semibold text-white">
              Weekly Activity
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    style={{ fontSize: "0.875rem" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "0.875rem" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="lost"
                    fill="#f59e0b"
                    name="Items Lost"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="found"
                    fill="#22c55e"
                    name="Items Found"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Items by Category */}
          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <h3 className="mb-6 text-xl font-semibold text-white">
              Items by Category
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card
          className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <h3 className="mb-6 text-xl font-semibold text-white">
            Monthly Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  style={{ fontSize: "0.875rem" }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "0.875rem" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="items"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Lost Items"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <h4 className="mb-2 text-gray-400 font-medium">Peak Lost Time</h4>
            <p className="font-bold mb-1 text-2xl text-blue-400">
              2:00 - 4:00 PM
            </p>
            <p className="text-gray-500 text-sm">
              Most items are lost during class transitions
            </p>
          </Card>

          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <h4 className="mb-2 text-gray-400 font-medium">Top Location</h4>
            <p className="font-bold mb-1 text-2xl text-purple-400">Library</p>
            <p className="text-gray-500 text-sm">
              Most items are found in study areas
            </p>
          </Card>

          <Card
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <h4 className="mb-2 text-gray-400 font-medium">
              Avg. Recovery Time
            </h4>
            <p className="font-bold mb-1 text-2xl text-green-400">2.3 days</p>
            <p className="text-gray-500 text-sm">
              Items are typically claimed quickly
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
