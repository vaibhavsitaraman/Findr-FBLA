import { useEffect, useMemo, useState } from 'react';
import { DetectionCard, LostItem } from './DetectionCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';

type ListingRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  source: 'ai' | 'user';
  status: 'active' | 'claimed' | 'resolved' | 'donated';
  detected_at: string | null;
  camera_id: string | null;
  camera_lat: number | null;
  camera_lng: number | null;
  ai_confidence: number | null;
  estimated_location_text: string | null;
  pickup_location_text: string | null;
  pickup_at: string | null;
  created_at: string;
};

type ClaimStatus = 'submitted' | 'approved' | 'rejected' | 'cancelled';

type ClaimRow = {
  id: string;
  listing_id: string;
  claimant_id: string;
  status: ClaimStatus;
  created_at: string;
};

export function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<LostItem[]>([]);
  const [selectedClaimStatus, setSelectedClaimStatus] = useState<ClaimStatus | null>(null);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string | null>(null);
  const [selectedPickupAt, setSelectedPickupAt] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, description, category, source, status, detected_at, camera_id, camera_lat, camera_lng, ai_confidence, estimated_location_text, pickup_location_text, pickup_at, created_at')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        toast.error(error.message);
        setItems([]);
        setIsLoading(false);
        return;
      }

      const rows = (data as ListingRow[]) ?? [];
      const mapped: LostItem[] = rows.map((r) => {
        const locationText = r.source === 'ai'
          ? (r.camera_id ? `Camera ${r.camera_id}${r.camera_lat != null && r.camera_lng != null ? ` (${r.camera_lat.toFixed(5)}, ${r.camera_lng.toFixed(5)})` : ''}` : (r.estimated_location_text ?? 'Unknown location'))
          : (r.estimated_location_text ?? 'Unknown location');

        const ts = r.source === 'ai'
          ? (r.detected_at ?? r.created_at)
          : r.created_at;

        const status: LostItem['status'] = r.status === 'claimed' ? 'claimed' : (r.source === 'ai' ? 'detected' : 'pending');

        return {
          id: r.id,
          title: r.title,
          description: r.description,
          location: locationText,
          timestamp: new Date(ts).toLocaleString(),
          status,
          aiDetected: r.source === 'ai',
          confidence: r.ai_confidence ?? undefined,
          category: r.category,
        };
      });

      setItems(mapped);
      setIsLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }), [items, searchQuery, categoryFilter, statusFilter]);

  const handleClaim = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setSelectedClaimStatus(null);
      setSelectedPickupLocation(null);
      setSelectedPickupAt(null);
      setShowClaimDialog(true);

      const { data: sessionRes } = await supabase.auth.getSession();
      const userId = sessionRes.session?.user.id;
      if (!userId) return;

      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .select('id, listing_id, claimant_id, status, created_at')
        .eq('listing_id', id)
        .eq('claimant_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (claimError) {
        toast.error(claimError.message);
        return;
      }

      if (claimData) {
        const claim = claimData as ClaimRow;
        setSelectedClaimStatus(claim.status);
      }

      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('pickup_location_text, pickup_at')
        .eq('id', id)
        .maybeSingle();

      if (listingError) {
        return;
      }

      if (listingData) {
        const pickup = listingData as { pickup_location_text: string | null; pickup_at: string | null };
        setSelectedPickupLocation(pickup.pickup_location_text);
        setSelectedPickupAt(pickup.pickup_at);
      }
    }
  };

  const handleConfirmClaim = async () => {
    if (!selectedItem) return;

    const { data: sessionRes } = await supabase.auth.getSession();
    const userId = sessionRes.session?.user.id;
    if (!userId) {
      toast.error('Please sign in again');
      return;
    }

    const { error } = await supabase.from('claims').insert({
      listing_id: selectedItem.id,
      claimant_id: userId,
      status: 'submitted',
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Claim submitted', {
      description: 'Staff will review and publish pickup details after approval.',
    });

    setSelectedClaimStatus('submitted');
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
              Showing <span className="font-semibold text-blue-400">{filteredItems.length}</span> of {items.length} items
            </p>
          </div>
        </div>

        {/* Items Grid */}
        {!isLoading && (
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
        )}

        {isLoading && (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">Loading listings...</p>
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
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
                <p className="font-semibold mb-1 text-blue-400">Pickup Details:</p>
                {selectedClaimStatus === 'approved' && selectedPickupLocation ? (
                  <>
                    <p>{selectedPickupLocation}</p>
                    {selectedPickupAt && (
                      <p className="mt-2 text-blue-300/80">Pickup date: {new Date(selectedPickupAt).toLocaleString()}</p>
                    )}
                  </>
                ) : (
                  <p>Hidden until staff approves your claim.</p>
                )}
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
                  Submit Claim
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
