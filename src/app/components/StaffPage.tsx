import { useEffect, useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { AuditService, FoundItemService, LostItemService, UserService } from '../../lib/database';

type ClaimStatus = 'submitted' | 'approved' | 'rejected' | 'cancelled';

type ClaimRow = {
  id: string;
  listing_id: string;
  claimant_id: string;
  status: ClaimStatus;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
  };
};

type FoundItemRow = {
  id: string;
  title: string;
  status: string;
  pickup_location: string | null;
  pickup_date: string | null;
};

export function StaffPage() {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | ClaimStatus>('submitted');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupAt, setPickupAt] = useState('');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const [foundItems, setFoundItems] = useState<FoundItemRow[]>([]);
  const [selectedFoundItemId, setSelectedFoundItemId] = useState<string>('');
  const [foundPickupLocation, setFoundPickupLocation] = useState('');
  const [foundPickupAt, setFoundPickupAt] = useState('');

  const visibleClaims = useMemo(() => {
    if (statusFilter === 'all') return claims;
    return claims.filter((c) => c.status === statusFilter);
  }, [claims, statusFilter]);

  const listingOptions = useMemo(() => {
    const map = new Map<string, ClaimRow['listing']>();
    for (const c of claims) {
      if (c.listing?.id) map.set(c.listing.id, c.listing);
    }
    return Array.from(map.values()).filter(Boolean) as NonNullable<ClaimRow['listing']>[];
  }, [claims]);

  const foundItemOptions = useMemo(() => {
    return foundItems;
  }, [foundItems]);

  const updateClaimStatus = async (
    claimId: string,
    newStatus: Exclude<ClaimStatus, 'submitted'>,
  ) => {
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      const target = claims.find((c) => c.id === claimId);
      if (!target) {
        toast.error('Claim not found');
        return;
      }

      const { error } = await supabase
        .from('claims')
        .update({ status: newStatus })
        .eq('id', claimId);

      if (error) throw error;

      await AuditService.logAction({
        user_id: profile.id,
        action: `claims.${newStatus}`,
        details: { claim_id: claimId, listing_id: target.listing_id },
      });

      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c)),
      );
      toast.success(`Claim ${newStatus}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update claim';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          toast.error('Please sign in again');
          return;
        }

        const profile = await UserService.getUserByAuthId(user.id);
        if (!profile || profile.role !== 'admin') {
          toast.error('Admin access required');
          return;
        }

        const schoolId = profile.school_id;
        const lostItems = await LostItemService.getLostItemsBySchool(schoolId);
        const lostIds = (lostItems ?? []).map((li: any) => li.id);

        const found = await FoundItemService.getFoundItemsBySchool(schoolId);

        if (lostIds.length === 0) {
          if (!isMounted) return;
          setClaims([]);
          setFoundItems(((found as unknown) as FoundItemRow[]) ?? []);
          setIsLoading(false);
          return;
        }

        const { data: claimsData, error: claimsError } = await supabase
          .from('claims')
          .select('id, listing_id, claimant_id, status, created_at')
          .in('listing_id', lostIds)
          .order('created_at', { ascending: false });

        if (claimsError) throw claimsError;

        const listingById = new Map<string, any>();
        for (const li of (lostItems as any[]) ?? []) {
          listingById.set(li.id, {
            id: li.id,
            title: li.title,
            description: li.description,
            category: li.category,
            status: li.status,
          });
        }

        const stitchedClaims: ClaimRow[] = (((claimsData as unknown) as ClaimRow[]) ?? []).map((c) => ({
          ...c,
          listing: listingById.get(c.listing_id),
        }));

        if (!isMounted) return;
        setClaims(stitchedClaims);
        setFoundItems(((found as unknown) as FoundItemRow[]) ?? []);
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load staff portal';
        if (!isMounted) return;
        toast.error(message);
        setClaims([]);
        setFoundItems([]);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedListingId) return;
    const listing = listingOptions.find((l) => l.id === selectedListingId);
    if (!listing) return;
    setPickupLocation('');
    setPickupAt('');
  }, [selectedListingId, listingOptions]);

  useEffect(() => {
    if (!selectedFoundItemId) return;
    const fi = foundItemOptions.find((f) => f.id === selectedFoundItemId);
    if (!fi) return;

    setFoundPickupLocation(fi.pickup_location ?? '');
    setFoundPickupAt(fi.pickup_date ? fi.pickup_date.slice(0, 16) : '');
  }, [selectedFoundItemId, foundItemOptions]);

  const approveAllClaimsForListing = async () => {
    if (!selectedListingId) {
      toast.error('Select a listing');
      return;
    }

    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      const { error: claimsError } = await supabase
        .from('claims')
        .update({ status: 'approved' })
        .eq('listing_id', selectedListingId)
        .eq('status', 'submitted');

      if (claimsError) throw claimsError;

      await LostItemService.updateLostItem(selectedListingId, { status: 'claimed' } as any);

      await AuditService.logAction({
        user_id: profile.id,
        action: 'claims.approve_all_for_lost_item',
        details: { listing_id: selectedListingId },
      });

      toast.success('Approved submitted claims');

      setClaims((prev) =>
        prev.map((c) =>
          c.listing_id === selectedListingId && c.status === 'submitted'
            ? { ...c, status: 'approved' }
            : c,
        ),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve claims';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveFoundItemPickup = async () => {
    if (!selectedFoundItemId) {
      toast.error('Select a found item');
      return;
    }
    if (!foundPickupLocation.trim()) {
      toast.error('Enter a pickup location');
      return;
    }
    if (!foundPickupAt) {
      toast.error('Enter a pickup date/time');
      return;
    }

    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = user ? await UserService.getUserByAuthId(user.id) : null;
      if (!profile || profile.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      await FoundItemService.updateFoundItem(selectedFoundItemId, {
        pickup_location: foundPickupLocation,
        pickup_date: new Date(foundPickupAt).toISOString(),
      } as any);

      await AuditService.logAction({
        user_id: profile.id,
        action: 'found_items.set_pickup',
        details: { found_item_id: selectedFoundItemId },
      });

      setFoundItems((prev) =>
        prev.map((f) =>
          f.id === selectedFoundItemId
            ? {
                ...f,
                pickup_location: foundPickupLocation,
                pickup_date: new Date(foundPickupAt).toISOString(),
              }
            : f,
        ),
      );

      toast.success('Pickup details saved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save pickup details';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1
            className="mb-2 text-white"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '2.5rem',
            }}
          >
            Staff Portal
          </h1>
          <p className="text-gray-300 text-lg">Approve claims and set pickup location/date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-white font-medium">Filter claims</div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Select listing</div>
                <Select value={selectedListingId} onValueChange={setSelectedListingId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Choose a listing" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    {listingOptions.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Pickup location</div>
                <Input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  placeholder="(managed on Found Items below)"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Pickup date/time</div>
                <Input
                  type="datetime-local"
                  value={pickupAt}
                  onChange={(e) => setPickupAt(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  disabled
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={approveAllClaimsForListing}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Approve submitted claims + publish pickup'}
              </Button>

              <div className="text-gray-400 text-xs">This approves all submitted claims for the selected listing and publishes pickup details to all claimants.</div>

              <div className="pt-4 border-t border-white/10" />

              <div className="space-y-2">
                <div className="text-white font-medium">Select found item (pickup)</div>
                <Select value={selectedFoundItemId} onValueChange={setSelectedFoundItemId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Choose a found item" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    {foundItemOptions.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Found-item pickup location</div>
                <Input
                  value={foundPickupLocation}
                  onChange={(e) => setFoundPickupLocation(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  placeholder="e.g., Main Office - Building A, Room 101"
                />
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Found-item pickup date/time</div>
                <Input
                  type="datetime-local"
                  value={foundPickupAt}
                  onChange={(e) => setFoundPickupAt(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={saveFoundItemPickup}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save pickup details for found item'}
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">Claims</div>
              <div className="text-gray-400 text-sm">
                {isLoading ? 'Loading...' : `${visibleClaims.length} shown / ${claims.length} total`}
              </div>
            </div>

            <div className="space-y-3">
              {visibleClaims.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">{c.listing?.title ?? c.listing_id}</div>
                      <div className="text-gray-400 text-sm truncate">Claim ID: {c.id}</div>
                      <div className="text-gray-500 text-xs">Submitted: {new Date(c.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded border border-white/10 text-gray-300">{c.status}</div>
                      {c.status === 'submitted' && (
                        <>
                          <Button
                            variant="outline"
                            className="h-8 px-3 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
                            disabled={isSaving}
                            onClick={() => updateClaimStatus(c.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 px-3 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
                            disabled={isSaving}
                            onClick={() => updateClaimStatus(c.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!isLoading && visibleClaims.length === 0 && (
                <div className="text-gray-400 text-sm">No claims found for this filter.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
