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
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import {
  AuditService,
  FoundItemService,
  LostItemService,
  UserService,
} from "../../lib/database";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSchoolId, setAdminSchoolId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image_url: "",
  });
  const [editDraft, setEditDraft] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    status: "active" as "active" | "claimed" | "resolved" | "donated",
  });

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setItems([]);
          setIsLoading(false);
          return;
        }

        const profile = await UserService.getUserByAuthId(user.id);
        if (!profile) {
          toast.error("User profile not found");
          setItems([]);
          setIsLoading(false);
          return;
        }

        setIsAdmin(profile.role === "admin");
        setAdminSchoolId(profile.school_id);

        const schoolId = profile.school_id;
        const [lostItems, foundItems] = await Promise.all([
          LostItemService.getLostItemsBySchool(schoolId),
          FoundItemService.getFoundItemsBySchool(schoolId),
        ]);

        const transformedLostItems: LostItem[] = (lostItems ?? []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          location: item.location || "Unknown location",
          timestamp: new Date(item.created_at).toLocaleString(),
          status: (item.status === "claimed" ? "claimed" : "pending") as LostItem["status"],
          aiDetected: false,
          confidence: undefined,
          category: item.category || "Other",
          imageUrl: item.image_url,
          postedBy: item.users?.full_name,
          claimCount: 0,
        }));

        const transformedFoundItems: LostItem[] = (foundItems ?? []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          location: item.location || "Unknown location",
          timestamp: new Date(item.created_at).toLocaleString(),
          status: (item.status === "claimed" ? "claimed" : "pending") as LostItem["status"],
          aiDetected: false,
          confidence: undefined,
          category: item.category || "Found Item",
          imageUrl: item.image_url,
          postedBy: item.users?.full_name,
          claimCount: 0,
        }));

        const allItems: LostItem[] = [...transformedLostItems, ...transformedFoundItems];
        if (!isMounted) return;
        setItems(allItems);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load items";
        toast.error(message);
        setItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadItems();
    return () => {
      isMounted = false;
    };
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

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const profile = await UserService.getUserByAuthId(user.id);
      if (!profile) return;

      const { data: claimData, error: claimError } = await supabase
        .from("claims")
        .select("id, listing_id, claimant_id, status, created_at")
        .eq("listing_id", id)
        .eq("claimant_id", profile.id)
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

        if (claim.status === "approved") {
          const { data: pickup } = await supabase
            .from("found_items")
            .select("pickup_location, pickup_date")
            .eq("matched_lost_item_id", id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (pickup) {
            setSelectedPickupLocation(pickup.pickup_location ?? null);
            setSelectedPickupAt(pickup.pickup_date ?? null);
          }
        }
      }
    }
  };

  const createAdminListing = async () => {
    if (!isAdmin || !adminSchoolId) return;
    if (!createDraft.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== "admin") {
        toast.error("Admin access required");
        return;
      }

      const { data: row, error } = await supabase
        .from("found_items")
        .insert({
          user_id: profile.id,
          title: createDraft.title,
          description: createDraft.description || null,
          category: createDraft.category || null,
          location: createDraft.location || null,
          image_url: createDraft.image_url || null,
          status: "active",
        })
        .select(
          `
          id,
          title,
          description,
          category,
          location,
          status,
          image_url,
          created_at,
          users(full_name)
        `,
        )
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      await AuditService.logAction({
        user_id: profile.id,
        action: "moderation.create_listing",
        details: { id: row?.id },
      });

      const card: LostItem = {
        id: row.id,
        title: row.title,
        description: row.description || "",
        location: row.location || "Unknown location",
        timestamp: new Date(row.created_at).toLocaleString(),
        status: row.status === "claimed" ? "claimed" : "pending",
        aiDetected: false,
        confidence: undefined,
        category: row.category || "Found Item",
        imageUrl: row.image_url || undefined,
        postedBy: (row as any).users?.full_name,
        claimCount: 0,
      };

      setItems((prev) => [card, ...prev]);
      setIsCreateDialogOpen(false);
      setCreateDraft({ title: "", description: "", category: "", location: "", image_url: "" });
      toast.success("Listing created");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create listing";
      toast.error(message);
    }
  };

  const handleConfirmClaim = async () => {
    if (!selectedItem) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in again");
      return;
    }

    const profile = await UserService.getUserByAuthId(user.id);
    if (!profile) {
      toast.error("User profile not found");
      return;
    }

    const { error } = await supabase.from("claims").insert({
      listing_id: selectedItem.id,
      claimant_id: profile.id,
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

  const handleAdminEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSelectedItem(item);
    setEditDraft({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      status: "active",
    });
    setIsEditDialogOpen(true);
  };

  const handleAdminDelete = async (id: string) => {
    if (!isAdmin || !adminSchoolId) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== "admin") {
        toast.error("Admin access required");
        return;
      }

      // Verify item belongs to admin's school before mutating
      const { data: lostScoped } = await supabase
        .from("lost_items")
        .select("id, users!inner(school_id)")
        .eq("id", id)
        .eq("users.school_id", profile.school_id)
        .maybeSingle();

      const { data: foundScoped } = await supabase
        .from("found_items")
        .select("id, users!inner(school_id)")
        .eq("id", id)
        .eq("users.school_id", profile.school_id)
        .maybeSingle();

      if (!lostScoped && !foundScoped) {
        toast.error("Item not found for your school");
        return;
      }

      // Try deleting from lost_items first; if not found, delete from found_items.
      const { error: lostDeleteError } = await supabase
        .from("lost_items")
        .delete()
        .eq("id", id);

      if (lostDeleteError) {
        const { error: foundDeleteError } = await supabase
          .from("found_items")
          .delete()
          .eq("id", id);
        if (foundDeleteError) throw foundDeleteError;
      }

      await AuditService.logAction({
        user_id: profile.id,
        action: "moderation.delete_item",
        details: { id },
      });

      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Item deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete item";
      toast.error(message);
    }
  };

  const saveAdminEdit = async () => {
    if (!selectedItem) return;
    if (!isAdmin) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== "admin") {
        toast.error("Admin access required");
        return;
      }

      // Verify item belongs to admin's school before mutating
      const { data: lostScoped } = await supabase
        .from("lost_items")
        .select("id, users!inner(school_id)")
        .eq("id", selectedItem.id)
        .eq("users.school_id", profile.school_id)
        .maybeSingle();

      const { data: foundScoped } = await supabase
        .from("found_items")
        .select("id, users!inner(school_id)")
        .eq("id", selectedItem.id)
        .eq("users.school_id", profile.school_id)
        .maybeSingle();

      if (!lostScoped && !foundScoped) {
        toast.error("Item not found for your school");
        return;
      }

      // Update in lost_items first; if not found, update in found_items.
      const { data: lostRow, error: lostUpdateError } = await supabase
        .from("lost_items")
        .update({
          title: editDraft.title,
          description: editDraft.description,
          category: editDraft.category,
          location: editDraft.location,
          status: editDraft.status,
        })
        .eq("id", selectedItem.id)
        .select("id")
        .maybeSingle();

      if (lostUpdateError || !lostRow) {
        const { error: foundUpdateError } = await supabase
          .from("found_items")
          .update({
            title: editDraft.title,
            description: editDraft.description,
            category: editDraft.category,
            location: editDraft.location,
            status: editDraft.status,
          })
          .eq("id", selectedItem.id);
        if (foundUpdateError) throw foundUpdateError;
      }

      await AuditService.logAction({
        user_id: profile.id,
        action: "moderation.edit_item",
        details: { id: selectedItem.id },
      });

      setItems((prev) =>
        prev.map((x) =>
          x.id === selectedItem.id
            ? {
                ...x,
                title: editDraft.title,
                description: editDraft.description,
                category: editDraft.category,
                location: editDraft.location,
              }
            : x,
        ),
      );
      setIsEditDialogOpen(false);
      toast.success("Item updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update item";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
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

            {isAdmin && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Add Listing
              </Button>
            )}
          </div>
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
                onEdit={isAdmin ? handleAdminEdit : undefined}
                onDelete={isAdmin ? handleAdminDelete : undefined}
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

              <div className="p-4 rounded-xl text-sm bg-gradient-to-br from-indigo-600/20 to-indigo-800/10 border border-indigo-500/30 backdrop-blur-sm">
                <p className="font-semibold mb-2 text-indigo-400">
                  Pickup Details
                </p>
                {selectedClaimStatus === "approved" && selectedPickupLocation ? (
                  <>
                    <p className="text-indigo-200">{selectedPickupLocation}</p>
                    {selectedPickupAt && (
                      <p className="text-indigo-200/80 mt-1">
                        {new Date(selectedPickupAt).toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-indigo-200">
                    Pickup location is shown after admin approval.
                  </p>
                )}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-blue-500/30 text-white shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-serif text-2xl">
              Edit Listing
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Admin-only moderation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={editDraft.title}
              onChange={(e) => setEditDraft((p) => ({ ...p, title: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Title"
            />
            <Input
              value={editDraft.category}
              onChange={(e) => setEditDraft((p) => ({ ...p, category: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Category"
            />
            <Input
              value={editDraft.location}
              onChange={(e) => setEditDraft((p) => ({ ...p, location: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Location"
            />
            <Input
              value={editDraft.description}
              onChange={(e) =>
                setEditDraft((p) => ({ ...p, description: e.target.value }))
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={saveAdminEdit}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-blue-500/30 text-white shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-serif text-2xl">
              Add Listing
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Admin-only listing creation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={createDraft.title}
              onChange={(e) => setCreateDraft((p) => ({ ...p, title: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Title"
            />
            <Input
              value={createDraft.category}
              onChange={(e) => setCreateDraft((p) => ({ ...p, category: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Category"
            />
            <Input
              value={createDraft.location}
              onChange={(e) => setCreateDraft((p) => ({ ...p, location: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Location"
            />
            <Input
              value={createDraft.description}
              onChange={(e) =>
                setCreateDraft((p) => ({ ...p, description: e.target.value }))
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Description"
            />
            <Input
              value={createDraft.image_url}
              onChange={(e) => setCreateDraft((p) => ({ ...p, image_url: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              placeholder="Image URL (optional)"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={createAdminListing}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
