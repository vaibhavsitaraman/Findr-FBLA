import { useEffect, useMemo, useState } from "react";
import { DetectionCard, LostItem } from "./DetectionCard";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "sonner";

type ListingRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  source: "ai" | "user";
  status: "active" | "claimed" | "resolved" | "donated";
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

type ClaimStatus = "submitted" | "approved" | "rejected" | "cancelled";

type ClaimRow = {
  id: string;
  listing_id: string;
  claimant_id: string;
  status: ClaimStatus;
  created_at: string;
};

export function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<LostItem[]>([]);
  const [selectedClaimStatus, setSelectedClaimStatus] =
    useState<ClaimStatus | null>(null);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<
    string | null
  >(null);
  const [selectedPickupAt, setSelectedPickupAt] = useState<string | null>(null);

  // Mock data for development
  const mockItems: LostItem[] = [
    {
      id: "1",
      title: "Black North Face Backpack",
      description:
        "Black North Face backpack with laptop compartment. Contains textbooks and notebooks.",
      location: "Camera 3 (34.05223, -118.24368)",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
      status: "detected",
      aiDetected: true,
      confidence: 94,
      category: "Backpack",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      title: 'MacBook Pro 13"',
      description:
        "Space Gray MacBook Pro with stickers on the lid. Last seen in library.",
      location: "Main Library - Study Area A",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString(),
      status: "pending",
      aiDetected: false,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      title: "Car Key Fob",
      description:
        "Honda car key fob with red keychain. Small scratch on the back.",
      location: "Camera 7 (34.05245, -118.24312)",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString(),
      status: "detected",
      aiDetected: true,
      confidence: 87,
      category: "Keys",
      imageUrl: "/src/images/car_key_fob.jpg",
    },
    {
      id: "4",
      title: "Black Water Bottle",
      description: "Black water bottle with black cap. Has some minor dents.",
      location: "Student Union - Food Court",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleString(),
      status: "claimed",
      aiDetected: false,
      category: "Water Bottle",
      imageUrl: "/src/images/water bottle image.png",
    },
    {
      id: "5",
      title: "iPhone 13 Pro",
      description:
        "Graphite iPhone 13 Pro in clear case. Screen has small crack in corner.",
      location: "Camera 12 (34.05289, -118.24298)",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toLocaleString(),
      status: "detected",
      aiDetected: true,
      confidence: 91,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "6",
      title: "Wireless Earbuds",
      description:
        "White wireless earbuds in charging case. Brand: AirPods Pro.",
      location: "Gym - Locker Room",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString(),
      status: "pending",
      aiDetected: false,
      category: "Electronics",
      imageUrl: "/src/images/airpods pro.jpeg",
      postedBy: "current-user",
      claimCount: 3,
    },
    {
      id: "7",
      title: "Math Textbook",
      description:
        "Calculus: Early Transcendentals 8th Edition. Has highlighting and notes.",
      location: "Math Building - Room 201",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toLocaleString(),
      status: "pending",
      aiDetected: false,
      category: "Books",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "8",
      title: "Leather Wallet",
      description:
        "Brown leather wallet with multiple card slots. Contains student ID.",
      location: "Camera 5 (34.05267, -118.24345)",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toLocaleString(),
      status: "detected",
      aiDetected: true,
      confidence: 89,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1565404713113-2b3c1e8c7a5b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "9",
      title: "Sunglasses",
      description:
        "Ray-Ban aviator sunglasses with gold frames. Case included.",
      location: "Campus Quad - Benches",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toLocaleString(),
      status: "pending",
      aiDetected: false,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1473496914038-9a5e1b8d2d8a?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "10",
      title: "Jacket",
      description: "Black denim jacket with silver zipper. Size Medium.",
      location: "Science Building - Lobby",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toLocaleString(),
      status: "claimed",
      aiDetected: false,
      category: "Clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "11",
      title: "USB-C Cable",
      description: "6ft USB-C charging cable. White color. Brand: Anker.",
      location: "Camera 9 (34.05234, -118.24321)",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toLocaleString(),
      status: "detected",
      aiDetected: true,
      confidence: 82,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "12",
      title: "Notebook Set",
      description:
        "Set of 5 spiral notebooks. Various colors: blue, green, red, yellow, purple.",
      location: "Art Building - Studio 3",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
      status: "pending",
      aiDetected: false,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=400&q=80",
    },
  ];

  useEffect(() => {
    const loadItems = async () => {
      try {
        // Fetch real lost items from Supabase
        const { data: lostItems, error: lostError } = await supabase
          .from("lost_items")
          .select(
            `
            *,
            users!inner(
              full_name,
              email
            )
          `,
          )
          .order("created_at", { ascending: false });

        // Fetch real found items from Supabase
        const { data: foundItems, error: foundError } = await supabase
          .from("found_items")
          .select(
            `
            *,
            users!inner(
              full_name,
              email
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (lostError || foundError) {
          console.error("Error fetching items:", { lostError, foundError });
          // Fall back to mock data if there's an error
          setItems(mockItems);
          setIsLoading(false);
          return;
        }

        // Transform lost items to match the interface
        const transformedLostItems = lostItems.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          location: item.location || "Unknown location",
          timestamp: new Date(item.created_at).toLocaleString(),
          status: item.status,
          aiDetected: false, // Real items are user-posted
          confidence: undefined,
          category: item.category || "Other",
          imageUrl: item.image_url,
          postedBy: item.users.full_name,
          claimCount: 0, // Would need to be calculated from claims table
        }));

        // Transform found items to match the interface
        const transformedFoundItems = foundItems.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          location: item.location || "Unknown location",
          timestamp: new Date(item.created_at).toLocaleString(),
          status: item.status,
          aiDetected: false,
          confidence: undefined,
          category: "Found Item", // Different category for found items
          imageUrl: item.image_url,
          postedBy: item.users.full_name,
          claimCount: 0,
        }));

        // Combine all real data with mock data
        const allItems = [
          ...transformedLostItems,
          ...transformedFoundItems,
          ...mockItems,
        ];

        setItems(allItems);
      } catch (error) {
        console.error("Error loading items:", error);
        // Fall back to mock data
        setItems(mockItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [items, searchQuery, categoryFilter, statusFilter],
  );

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
        .from("claims")
        .select("id, listing_id, claimant_id, status, created_at")
        .eq("listing_id", id)
        .eq("claimant_id", userId)
        .order("created_at", { ascending: false })
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
        .from("listings")
        .select("pickup_location_text, pickup_at")
        .eq("id", id)
        .maybeSingle();

      if (listingError) {
        return;
      }

      if (listingData) {
        const pickup = listingData as {
          pickup_location_text: string | null;
          pickup_at: string | null;
        };
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
      toast.error("Please sign in again");
      return;
    }

    const { error } = await supabase.from("claims").insert({
      listing_id: selectedItem.id,
      claimant_id: userId,
      status: "submitted",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Claim submitted", {
      description:
        "Staff will review and publish pickup details after approval.",
    });

    setSelectedClaimStatus("submitted");
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
              fontSize: "2.5rem",
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
              Showing{" "}
              <span className="font-semibold text-blue-400">
                {filteredItems.length}
              </span>{" "}
              of {items.length} items
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
        <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-blue-500/30 text-white shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-serif text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Claim Item
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              To help protect owners, please verify your identity to claim this
              item.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/5 border border-blue-500/20 backdrop-blur-sm">
                <h4 className="font-semibold mb-1 text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {selectedItem.title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {selectedItem.description}
                </p>
              </div>

              {/* Pickup Location Information */}
              <div className="p-4 rounded-xl text-sm bg-gradient-to-br from-indigo-600/20 to-indigo-800/10 border border-indigo-500/30 backdrop-blur-sm">
                <p className="font-semibold mb-2 text-indigo-400">
                  Where to Pick Up:
                </p>
                <p className="text-indigo-200">
                  Security Office - Main Building, Room 101
                </p>
                <p className="text-indigo-200/80 mt-1">
                  Hours: Monday-Friday 8:00 AM - 6:00 PM
                </p>
              </div>

              <div className="p-4 rounded-xl text-sm bg-gradient-to-br from-orange-600/20 to-orange-800/10 border border-orange-500/30 backdrop-blur-sm">
                <p className="text-orange-200">
                  Please bring your school ID or show proof of ownership when
                  picking up the item. After clicking submit, you will be shown
                  a confirmation number. You must show that number when
                  retrieving the item.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-600/20 hover:border-blue-400/40 bg-transparent backdrop-blur-sm transition-all duration-300"
                  onClick={() => setShowClaimDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium border-0 shadow-lg backdrop-blur-sm transition-all duration-300"
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
