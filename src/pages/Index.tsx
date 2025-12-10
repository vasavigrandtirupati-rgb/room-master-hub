import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RoomStatusCard } from '@/components/dashboard/RoomStatusCard';
import { BookingTable } from '@/components/dashboard/BookingTable';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockRooms, mockBookings, getTodayCheckIns, getTodayCheckOuts, getPendingPayments } from '@/data/mockData';
import { 
  BedDouble, 
  CalendarCheck, 
  CalendarX, 
  IndianRupee,
  Users,
  Clock
} from 'lucide-react';

const Index = () => {
  const availableRooms = mockRooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = mockRooms.filter(r => r.status === 'Checked-In').length;
  const todayCheckIns = getTodayCheckIns();
  const todayCheckOuts = getTodayCheckOuts();
  const pendingPayments = getPendingPayments();

  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const pendingAmount = mockBookings.reduce((sum, b) => sum + b.balanceAmount, 0);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's your hotel overview.">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Available Rooms"
            value={availableRooms}
            subtitle={`of ${mockRooms.length} total rooms`}
            icon={BedDouble}
            variant="success"
            delay={0}
          />
          <StatCard
            title="Occupied Rooms"
            value={occupiedRooms}
            subtitle={`${Math.round((occupiedRooms / mockRooms.length) * 100)}% occupancy`}
            icon={Users}
            variant="primary"
            delay={100}
          />
          <StatCard
            title="Today's Check-ins"
            value={todayCheckIns.length}
            subtitle="Expected arrivals"
            icon={CalendarCheck}
            delay={200}
          />
          <StatCard
            title="Today's Check-outs"
            value={todayCheckOuts.length}
            subtitle="Scheduled departures"
            icon={CalendarX}
            delay={300}
          />
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Today's Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            trend={{ value: 12, isPositive: true }}
            variant="accent"
            delay={400}
          />
          <StatCard
            title="Pending Payments"
            value={`₹${pendingAmount.toLocaleString()}`}
            subtitle={`${pendingPayments.length} bookings`}
            icon={Clock}
            variant="warning"
            delay={500}
          />
          <QuickActions />
        </div>

        {/* Room Overview */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Room Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-status-available"></span>
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-status-occupied"></span>
                Occupied
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-status-cleaning"></span>
                Cleaning
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-status-maintenance"></span>
                Maintenance
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockRooms.map((room) => (
              <RoomStatusCard key={room.roomNo} room={room} />
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
          <BookingTable 
            bookings={mockBookings} 
            title="Recent Bookings"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
