import { MapPin, Clock, Camera, AlertCircle, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface LostItem {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'detected' | 'claimed' | 'pending';
  aiDetected: boolean;
  confidence?: number;
  imageUrl?: string;
  claimedBy?: string;
  postedBy?: string;
  category: string;
}

interface DetectionCardProps {
  item: LostItem;
  onClaim: (id: string) => void;
  onReport: (id: string) => void;
  showActions?: boolean;
}

export function DetectionCard({ item, onClaim, onReport, showActions = true }: DetectionCardProps) {
  const isAIDetected = item.aiDetected;
  const isClaimed = item.status === 'claimed';
  const isPending = item.status === 'pending';

  return (
    <Card 
      className={`overflow-hidden hover:shadow-2xl transition-all duration-300 border backdrop-blur-md rounded-2xl group
        ${isClaimed 
          ? 'border-green-500/20 bg-green-500/5' 
          : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
    >
      {/* Image */}
      {item.imageUrl && (
        <div className="relative h-48 bg-black/20 overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          
          {isAIDetected && (
            <div 
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md shadow-lg"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.9)', color: 'white' }}
            >
              <Camera className="size-3" />
              AI Detected {item.confidence && `${item.confidence}%`}
            </div>
          )}
          {isClaimed && (
            <div 
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md shadow-lg"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.9)', color: 'white' }}
            >
              <Check className="size-3" />
              Claimed
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 
            className="mb-1 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors"
          >
            {item.title}
          </h3>
          <p 
            className="line-clamp-2 text-sm text-gray-400"
          >
            {item.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="size-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="text-gray-300">
              {item.location}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Clock className="size-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="text-gray-300">
              {item.timestamp}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant="secondary"
            className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
          >
            {item.category}
          </Badge>
          {item.postedBy && (
            <Badge 
              variant="outline"
              className="text-xs border-white/20 text-gray-400"
            >
              Posted by {item.postedBy}
            </Badge>
          )}
        </div>

        {/* AI Detection Info */}
        {isAIDetected && (
          <div 
            className="p-3 rounded-xl mb-4 text-xs bg-orange-500/10 text-orange-200 border border-orange-500/20"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 mt-0.5 flex-shrink-0 text-orange-400" />
              <span>
                Detected by video: {item.confidence}% confidence — last seen at {item.timestamp}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && !isClaimed && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium border-0"
              onClick={() => onClaim(item.id)}
            >
              {isPending ? 'Verify Claim' : 'Claim Item'}
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
              onClick={() => onReport(item.id)}
            >
              Report Issue
            </Button>
          </div>
        )}

        {isClaimed && item.claimedBy && (
          <div 
            className="p-3 rounded-xl text-sm text-center font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          >
            Claimed by {item.claimedBy}
          </div>
        )}
      </div>
    </Card>
  );
}
