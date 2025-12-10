import { Room } from '@/types/booking';
import { cn } from '@/lib/utils';
import { User, Clock, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoomStatusCardProps {
  room: Room;
  onClick?: () => void;
}

const statusConfig = {
  'Available': { 
    bg: 'bg-status-available/10', 
    border: 'border-status-available/30',
    badge: 'bg-status-available text-white',
    icon: Sparkles
  },
  'Checked-In': { 
    bg: 'bg-status-occupied/10', 
    border: 'border-status-occupied/30',
    badge: 'bg-status-occupied text-white',
    icon: User
  },
  'Checked-Out': { 
    bg: 'bg-muted', 
    border: 'border-muted-foreground/20',
    badge: 'bg-muted-foreground text-white',
    icon: Clock
  },
  'Reserved': { 
    bg: 'bg-status-reserved/10', 
    border: 'border-status-reserved/30',
    badge: 'bg-status-reserved text-white',
    icon: Clock
  },
  'Maintenance': { 
    bg: 'bg-status-maintenance/10', 
    border: 'border-status-maintenance/30',
    badge: 'bg-status-maintenance text-white',
    icon: Wrench
  },
};

const cleaningConfig = {
  'Clean': 'text-status-available',
  'Dirty': 'text-status-maintenance',
  'In Progress': 'text-status-cleaning',
};

export function RoomStatusCard({ room, onClick }: RoomStatusCardProps) {
  const config = statusConfig[room.status];
  const StatusIcon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-card hover:-translate-y-0.5",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-display font-semibold text-foreground">
            {room.roomNo}
          </p>
          <p className="text-sm text-muted-foreground">{room.roomType}</p>
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          config.bg
        )}>
          <StatusIcon className="h-5 w-5 text-foreground" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Badge className={cn("font-medium", config.badge)}>
          {room.status}
        </Badge>

        {room.currentGuest && (
          <p className="text-sm text-foreground truncate">
            {room.currentGuest}
          </p>
        )}

        {room.checkOutDate && (
          <p className="text-xs text-muted-foreground">
            Checkout: {room.checkOutDate}
          </p>
        )}

        <p className={cn("text-xs font-medium", cleaningConfig[room.cleaningStatus])}>
          {room.cleaningStatus}
        </p>
      </div>
    </button>
  );
}
