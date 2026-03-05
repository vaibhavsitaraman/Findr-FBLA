import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  User,
  Mail,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Edit,
  Settings,
  Bell,
  X,
  School,
  IdCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  UserService,
  NotificationService,
  LostItemService,
  FoundItemService,
  SchoolService,
} from "../../lib/database";

interface AccountPageProps {
  userName: string;
  userEmail: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  school_name?: string;
  student_id?: string;
  grade?: string;
  role?: string;
}

export function AccountPage({ userName, userEmail }: AccountPageProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    aiDetection: true,
    donationReminders: false,
  });
  const [userStats, setUserStats] = useState({
    itemsPosted: 0,
    itemsClaimed: 0,
    itemsReturned: 0,
    memberSince: "",
  });
  const [userActivity, setUserActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Get user profile from database
          const profile = await UserService.getUserByAuthId(user.id);
          if (profile) {
            setUserProfile({
              full_name: profile.full_name,
              email: profile.email,
              school_name: profile.school_id
                ? (await SchoolService.getSchoolById(profile.school_id))?.name
                : undefined,
              student_id: profile.student_id,
              grade: profile.grade,
              role: profile.role,
            });

            // Get notification settings
            const notifSettings =
              await NotificationService.getNotificationSettings(profile.id);
            if (notifSettings) {
              setNotifications({
                email: notifSettings.email_notifications,
                aiDetection: notifSettings.item_found_notifications,
                donationReminders: notifSettings.donation_reminders,
              });
            }

            // Get user's lost and found items for stats
            const lostItems = await LostItemService.getLostItemsByUser(
              profile.id,
            );
            const foundItems = await FoundItemService.getFoundItemsByUser(
              profile.id,
            );

            const itemsPosted = lostItems.length;
            const itemsClaimed = lostItems.filter(
              (item) => item.status === "claimed",
            ).length;
            const itemsReturned = foundItems.filter(
              (item) => item.status === "claimed",
            ).length;

            setUserStats({
              itemsPosted,
              itemsClaimed,
              itemsReturned,
              memberSince: new Date(profile.created_at).toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" },
              ),
            });

            // Create activity feed from both lost and found items
            const activity = [
              ...lostItems.map((item) => ({
                id: item.id,
                type: item.status === "claimed" ? "claimed" : "posted",
                item: item.item_name,
                date: new Date(item.updated_at).toLocaleString(),
                status:
                  item.status === "claimed" ? "Ready for pickup" : "Active",
              })),
              ...foundItems.map((item) => ({
                id: item.id,
                type: item.status === "claimed" ? "returned" : "found",
                item: item.item_name,
                date: new Date(item.updated_at).toLocaleString(),
                status:
                  item.status === "claimed"
                    ? "Completed"
                    : "Found - Awaiting claim",
              })),
            ]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .slice(0, 5);

            setUserActivity(activity);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userName, userEmail]);

  const toggleNotification = async (type: keyof typeof notifications) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const profile = await UserService.getUserByAuthId(user.id);
        if (profile) {
          // Map notification types to database fields
          const fieldMap = {
            email: "email_notifications",
            aiDetection: "item_found_notifications",
            donationReminders: "donation_reminders",
          };

          await NotificationService.toggleNotification(
            profile.id,
            fieldMap[type] as any,
          );

          setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "claimed":
        return <CheckCircle className="size-5 text-green-500" />;
      case "posted":
        return <Package className="size-5 text-blue-500" />;
      case "returned":
        return <CheckCircle className="size-5 text-orange-500" />;
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const getActivityBadgeColor = (status: string) => {
    if (status.includes("Ready") || status.includes("Active")) {
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
      };
    }
    if (
      status.includes("Completed") ||
      status.includes("Picked up") ||
      status.includes("Found")
    ) {
      return {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/20",
      };
    }
    return {
      bg: "bg-gray-500/10",
      text: "text-gray-400",
      border: "border-gray-500/20",
    };
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2 text-white"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "2.5rem",
            }}
          >
            My Account
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your profile and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="size-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                    boxShadow:
                      "0 8px 32px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <User className="size-10 text-white" />
                </div>
                <h2
                  className="mb-1 text-2xl font-bold text-white"
                  style={{ fontFamily: "'EB Garamond', serif" }}
                >
                  {userProfile?.full_name || userName}
                </h2>
                <p className="mb-4 flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="size-4" />
                  {userProfile?.email || userEmail}
                </p>

                {/* School Information */}
                {userProfile?.school_name && (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <School className="size-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {userProfile.school_name}
                      </span>
                    </div>
                    {userProfile?.student_id && (
                      <div className="flex items-center gap-2 mb-2">
                        <IdCard className="size-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          ID: {userProfile.student_id}
                        </span>
                      </div>
                    )}
                    {userProfile?.grade && userProfile.role === "student" && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                          Grade {userProfile.grade}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                  <Calendar className="size-4 text-blue-400" />
                  Member since {userStats.memberSince}
                </div>
                <div className="grid w-full gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white justify-start transition-all duration-300"
                    style={{
                      backdropFilter: "blur(8px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <Edit className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white justify-start transition-all duration-300"
                    style={{
                      backdropFilter: "blur(8px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <Settings className="size-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <Card
              className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                <span className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Package className="size-4 text-blue-400" />
                </span>
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">Items Posted</span>
                  <span className="font-bold text-lg text-blue-400">
                    {userStats.itemsPosted}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">Items Claimed</span>
                  <span className="font-bold text-lg text-green-400">
                    {userStats.itemsClaimed}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">Items Returned</span>
                  <span className="font-bold text-lg text-orange-400">
                    {userStats.itemsReturned}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              <h3 className="mb-6 text-xl font-semibold text-white">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userActivity.map((activity) => {
                  const badgeColors = getActivityBadgeColor(activity.status);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="mt-1 p-2 rounded-lg bg-white/5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold mb-1 text-white text-base">
                              {activity.item}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {activity.type === "claimed" &&
                                "You claimed this item"}
                              {activity.type === "posted" &&
                                "You posted this item"}
                              {activity.type === "returned" &&
                                "You returned this item"}
                            </p>
                          </div>
                          <Badge
                            className={`flex-shrink-0 text-xs border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="size-3" />
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Notifications Settings */}
            <Card
              className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                <span className="size-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Bell className="size-4 text-orange-400" />
                </span>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: "email",
                    title: "Email Notifications",
                    desc: "Receive updates when items are found",
                  },
                  {
                    key: "aiDetection",
                    title: "AI Detection Alerts",
                    desc: "Get notified of AI-detected items",
                  },
                  {
                    key: "donationReminders",
                    title: "Donation Reminders",
                    desc: "Reminders before items are donated",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10"
                  >
                    <div>
                      <p className="font-medium mb-1 text-white">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        toggleNotification(
                          item.key as keyof typeof notifications,
                        )
                      }
                      className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-green-500/20 hover:bg-green-500/30"
                          : "bg-red-500/20 hover:bg-red-500/30"
                      }`}
                    >
                      {notifications[item.key as keyof typeof notifications] ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : (
                        <X className="size-5 text-red-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
