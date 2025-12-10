import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RoomStatusCard } from '@/components/dashboard/RoomStatusCard';
import { mockRooms } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RoomStatus } from '@/types/booking';

const statusFilters: { label: string; value: RoomStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'Available' },
  { label: 'Occupied', value: 'Checked-In' },
  { label: 'Reserved', value: 'Reserved' },
  { label: 'Checked-Out', value: 'Checked-Out' },
  { label: 'Maintenance', value: 'Maintenance' },
];

const Rooms = () => {
  const [filter, setFilter] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = filter === 'all' 
    ? mockRooms 
    : mockRooms.filter(room => room.status === filter);

  const statusCounts = {
    all: mockRooms.length,
    Available: mockRooms.filter(r => r.status === 'Available').length,
    'Checked-In': mockRooms.filter(r => r.status === 'Checked-In').length,
    Reserved: mockRooms.filter(r => r.status === 'Reserved').length,
    'Checked-Out': mockRooms.filter(r => r.status === 'Checked-Out').length,
    Maintenance: mockRooms.filter(r => r.status === 'Maintenance').length,
  };

  return (
    <MainLayout title="Rooms" subtitle="Monitor and manage room status">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <Button
              key={status.value}
              variant={filter === status.value ? 'default' : 'outline'}
              onClick={() => setFilter(status.value)}
              className="gap-2"
            >
              {status.label}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1",
                  filter === status.value && "bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                {statusCounts[status.value]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredRooms.map((room, index) => (
            <div 
              key={room.roomNo}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <RoomStatusCard room={room} />
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms found with the selected filter.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Rooms;
