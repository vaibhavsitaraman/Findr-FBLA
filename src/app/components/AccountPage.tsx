import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Mail, Calendar, Package, CheckCircle, Clock, Edit, Settings, Bell } from 'lucide-react';

interface AccountPageProps {
  userName: string;
  userEmail: string;
}

export function AccountPage({ userName, userEmail }: AccountPageProps) {
  // Mock user data
  const userStats = {
    itemsPosted: 3,
    itemsClaimed: 5,
    itemsReturned: 2,
    memberSince: 'September 2025',
  };

  const userActivity = [
    {
      id: '1',
      type: 'claimed',
      item: 'Black Backpack',
      date: 'Today at 3:45 PM',
      status: 'Ready for pickup',
    },
    {
      id: '2',
      type: 'posted',
      item: 'Blue Water Bottle',
      date: 'Yesterday at 2:30 PM',
      status: 'Active',
    },
    {
      id: '3',
      type: 'returned',
      item: 'AirPods Pro Case',
      date: '2 days ago',
      status: 'Completed',
    },
    {
      id: '4',
      type: 'claimed',
      item: 'Red Hoodie',
      date: '3 days ago',
      status: 'Picked up',
    },
    {
      id: '5',
      type: 'posted',
      item: 'Textbook',
      date: '5 days ago',
      status: 'Found - Claimed by owner',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'claimed':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'posted':
        return <Package className="size-5 text-blue-500" />;
      case 'returned':
        return <CheckCircle className="size-5 text-orange-500" />;
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const getActivityBadgeColor = (status: string) => {
    if (status.includes('Ready') || status.includes('Active')) {
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
    }
    if (status.includes('Completed') || status.includes('Picked up') || status.includes('Found')) {
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' };
    }
    return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' };
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
              fontSize: '2.5rem'
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
            <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div 
                  className="size-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20"
                >
                  <User className="size-10 text-white" />
                </div>
                <h2 className="mb-1 text-2xl font-bold text-white">
                  {userName}
                </h2>
                <p 
                  className="mb-6 flex items-center gap-2 text-gray-400"
                >
                  <Mail className="size-4" />
                  {userEmail}
                </p>
                <div 
                  className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                >
                  <Calendar className="size-4 text-blue-400" />
                  Member since {userStats.memberSince}
                </div>
                <div className="grid w-full gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white justify-start"
                  >
                    <Edit className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white justify-start"
                  >
                    <Settings className="size-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                <span className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Package className="size-4 text-blue-400" />
                </span>
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">
                    Items Posted
                  </span>
                  <span 
                    className="font-bold text-lg text-blue-400"
                  >
                    {userStats.itemsPosted}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">
                    Items Claimed
                  </span>
                  <span 
                    className="font-bold text-lg text-green-400"
                  >
                    {userStats.itemsClaimed}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-sm">
                    Items Returned
                  </span>
                  <span 
                    className="font-bold text-lg text-orange-400"
                  >
                    {userStats.itemsReturned}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
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
                              {activity.type === 'claimed' && 'You claimed this item'}
                              {activity.type === 'posted' && 'You posted this item'}
                              {activity.type === 'returned' && 'You returned this item'}
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
            <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                <span className="size-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Bell className="size-4 text-orange-400" />
                </span>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive updates when items are found' },
                  { title: 'AI Detection Alerts', desc: 'Get notified of AI-detected items' },
                  { title: 'Donation Reminders', desc: 'Reminders before items are donated' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="font-medium mb-1 text-white">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {item.desc}
                      </p>
                    </div>
                    <div 
                      className="size-10 rounded-full flex items-center justify-center cursor-pointer bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    >
                      <CheckCircle className="size-5 text-green-500" />
                    </div>
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
