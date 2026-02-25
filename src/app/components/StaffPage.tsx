import { useEffect, useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

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
    source: 'ai' | 'user';
    status: string;
    pickup_location_text: string | null;
    pickup_at: string | null;
  };
};

export function StaffPage() {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | ClaimStatus>('submitted');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupAt, setPickupAt] = useState('');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('claims')
        .select('id, listing_id, claimant_id, status, created_at, listing:listings(id, title, description, category, source, status, pickup_location_text, pickup_at)')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        toast.error(error.message);
        setClaims([]);
        setIsLoading(false);
        return;
      }

      setClaims(((data as unknown) as ClaimRow[]) ?? []);
      setIsLoading(false);
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

    setPickupLocation(listing.pickup_location_text ?? '');
    setPickupAt(listing.pickup_at ? listing.pickup_at.slice(0, 16) : '');
  }, [selectedListingId, listingOptions]);

  const approveAllClaimsForListing = async () => {
    if (!selectedListingId) {
      toast.error('Select a listing');
      return;
    }
    if (!pickupLocation.trim()) {
      toast.error('Enter a pickup location');
      return;
    }
    if (!pickupAt) {
      toast.error('Enter a pickup date/time');
      return;
    }

    setIsSaving(true);
    try {
      const { error: claimsError } = await supabase
        .from('claims')
        .update({ status: 'approved' })
        .eq('listing_id', selectedListingId)
        .eq('status', 'submitted');

      if (claimsError) throw claimsError;

      const { error: listingError } = await supabase
        .from('listings')
        .update({
          pickup_location_text: pickupLocation,
          pickup_at: new Date(pickupAt).toISOString(),
          status: 'claimed',
        })
        .eq('id', selectedListingId);

      if (listingError) throw listingError;

      toast.success('Approved claims and set pickup details');

      const { data, error } = await supabase
        .from('claims')
        .select('id, listing_id, claimant_id, status, created_at, listing:listings(id, title, description, category, source, status, pickup_location_text, pickup_at)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(((data as unknown) as ClaimRow[]) ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve claims';
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
                  placeholder="e.g., Main Office - Building A, Room 101"
                />
              </div>

              <div className="space-y-2">
                <div className="text-white font-medium">Pickup date/time</div>
                <Input
                  type="datetime-local"
                  value={pickupAt}
                  onChange={(e) => setPickupAt(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
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
                    <div className="text-xs px-2 py-1 rounded border border-white/10 text-gray-300">{c.status}</div>
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
