import { useState } from 'react';
import { DetectionCard, LostItem } from './DetectionCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface ListingsPageProps {
  onClaim: (id: string) => void;
}

export function ListingsPage({ onClaim }: ListingsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  // Mock data for lost items
  const mockItems: LostItem[] = [
    {
      id: '1',
      title: 'Black Backpack',
      description: 'JanSport black backpack with blue zipper. Contains textbooks and laptop.',
      location: 'Building A, 2nd Floor, Camera A',
      timestamp: 'Today at 3:12 PM',
      status: 'detected',
      aiDetected: true,
      confidence: 87,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      category: 'Backpack',
    },
    {
      id: '2',
      title: 'Blue Water Bottle',
      description: 'Hydro Flask water bottle, cobalt blue color with stickers.',
      location: 'Library, 3rd Floor Study Room',
      timestamp: 'Today at 1:45 PM',
      status: 'pending',
      aiDetected: true,
      confidence: 92,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
      category: 'Water Bottle',
      postedBy: 'John Smith',
    },
    {
      id: '3',
      title: 'AirPods Pro Case',
      description: 'White AirPods Pro charging case, slightly scratched on the back.',
      location: 'Cafeteria, Table 12',
      timestamp: 'Yesterday at 5:30 PM',
      status: 'detected',
      aiDetected: true,
      confidence: 78,
      imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop',
      category: 'Electronics',
    },
    {
      id: '4',
      title: 'Red Hoodie',
      description: 'Nike red hoodie, size M. Left in gym locker room.',
      location: 'Gymnasium, Locker Room B',
      timestamp: 'Yesterday at 2:15 PM',
      status: 'pending',
      aiDetected: false,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
      category: 'Clothing',
      postedBy: 'Sarah Johnson',
    },
    {
      id: '5',
      title: 'Car Keys with Tesla Fob',
      description: 'Set of car keys with Tesla Model 3 key fob and house keys.',
      location: 'Building C, Hallway near Room 304',
      timestamp: '2 days ago at 11:20 AM',
      status: 'detected',
      aiDetected: true,
      confidence: 95,
      imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop',
      category: 'Keys',
    },
    {
      id: '6',
      title: 'MacBook Pro 14"',
      description: 'Space Gray MacBook Pro with case. Found in study area.',
      location: 'Library, 1st Floor Computer Lab',
      timestamp: '3 days ago at 4:45 PM',
      status: 'claimed',
      aiDetected: true,
      confidence: 89,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: 'Electronics',
      claimedBy: 'Michael Chen',
    },
    {
      id: '7',
      title: 'Prescription Glasses',
      description: 'Black frame prescription glasses in a hard case.',
      location: 'Student Center, Study Lounge',
      timestamp: '3 days ago at 10:30 AM',
      status: 'pending',
      aiDetected: false,
      imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
      category: 'Accessories',
      postedBy: 'Emily Davis',
    },
    {
      id: '8',
      title: 'Textbook: "Introduction to Psychology"',
      description: 'Psychology textbook, 5th edition, with highlighted pages.',
      location: 'Building B, Room 205',
      timestamp: '4 days ago at 2:00 PM',
      status: 'detected',
      aiDetected: true,
      confidence: 84,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
      category: 'Books',
    },
  ];

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleClaim = (id: string) => {
    const item = mockItems.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setShowClaimDialog(true);
    }
  };

  const handleConfirmClaim = () => {
    if (selectedItem) {
      onClaim(selectedItem.id);
      setShowClaimDialog(false);
      setSelectedItem(null);
    }
  };

  const handleReport = (id: string) => {
    alert(`Report submitted for item ${id}. Our team will review it shortly.`);
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
            Lost & Found Listings
          </h1>
          <p className="text-gray-300 text-lg">
            Browse all detected and posted lost items on campus
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Search by item name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white/5 border-white/10 text-white">
                <Filter className="size-4 mr-2 text-blue-400" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Backpack">Backpack</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Keys">Keys</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Water Bottle">Water Bottle</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="detected">AI Detected</SelectItem>
                <SelectItem value="pending">User Posted</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Showing <span className="font-semibold text-blue-400">{filteredItems.length}</span> of {mockItems.length} items
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <DetectionCard
              key={item.id}
              item={item}
              onClaim={handleClaim}
              onReport={handleReport}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">
              No items found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Claim Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="bg-[#1e293b] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-serif text-2xl">Claim Item</DialogTitle>
            <DialogDescription className="text-gray-400">
              To help protect owners, please verify your identity to claim this item.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="font-semibold mb-1 text-white">
                  {selectedItem.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {selectedItem.description}
                </p>
              </div>

              <div className="p-4 rounded-lg text-sm bg-blue-500/10 text-blue-200 border border-blue-500/20">
                <p className="font-semibold mb-1 text-blue-400">Pickup Location:</p>
                <p>Main Office - Building A, Room 101</p>
                <p className="mt-2 text-blue-300/80">Hours: Monday-Friday, 9:00 AM - 5:00 PM</p>
              </div>

              <div className="p-4 rounded-lg text-sm bg-orange-500/10 text-orange-200 border border-orange-500/20">
                <p>Please bring your school ID or show proof of ownership when picking up the item.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => setShowClaimDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                  onClick={handleConfirmClaim}
                >
                  Confirm Claim
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
