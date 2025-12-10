import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingTable } from '@/components/dashboard/BookingTable';
import { mockBookings, mockRooms, getTodayCheckIns, getTodayCheckOuts, getPendingPayments } from '@/data/mockData';
import { 
  CalendarCheck, 
  CalendarX, 
  Clock, 
  IndianRupee,
  TrendingUp,
  Users,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Admin = () => {
  const todayCheckIns = getTodayCheckIns();
  const todayCheckOuts = getTodayCheckOuts();
  const pendingPayments = getPendingPayments();

  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const pendingAmount = mockBookings.reduce((sum, b) => sum + b.balanceAmount, 0);
  const occupancyRate = (mockRooms.filter(r => r.status === 'Checked-In').length / mockRooms.length) * 100;

  return (
    <MainLayout title="Admin Panel" subtitle="Complete overview and management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            trend={{ value: 15, isPositive: true }}
            variant="accent"
            delay={0}
          />
          <StatCard
            title="Pending Amount"
            value={`₹${pendingAmount.toLocaleString()}`}
            subtitle={`${pendingPayments.length} bookings`}
            icon={Clock}
            variant="warning"
            delay={100}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate.toFixed(0)}%`}
            icon={TrendingUp}
            variant="primary"
            delay={200}
          />
          <StatCard
            title="Total Guests"
            value={mockBookings.filter(b => b.roomStatus === 'Checked-In').length}
            subtitle="Currently staying"
            icon={Users}
            delay={300}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-status-available" />
                Google Sheets Sync
              </CardTitle>
              <CardDescription>
                Connected to your master spreadsheet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last synced: 5 minutes ago</p>
                  <Badge className="mt-2 bg-status-available">Connected</Badge>
                </div>
                <Button variant="outline">Sync Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-status-cleaning" />
                Alerts & Notifications
              </CardTitle>
              <CardDescription>
                Important updates requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30">
                    {pendingPayments.length}
                  </Badge>
                  <span>Pending payments to collect</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-status-cleaning/10 text-status-cleaning border-status-cleaning/30">
                    {mockRooms.filter(r => r.cleaningStatus === 'Dirty').length}
                  </Badge>
                  <span>Rooms need cleaning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All Bookings
              <Badge variant="secondary">{mockBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="checkins" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Today's Check-ins
              <Badge variant="secondary">{todayCheckIns.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="checkouts" className="gap-2">
              <CalendarX className="h-4 w-4" />
              Today's Check-outs
              <Badge variant="secondary">{todayCheckOuts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending Payments
              <Badge variant="secondary">{pendingPayments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="animate-fade-in">
            <BookingTable bookings={mockBookings} />
          </TabsContent>

          <TabsContent value="checkins" className="animate-fade-in">
            {todayCheckIns.length > 0 ? (
              <BookingTable bookings={todayCheckIns} />
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No check-ins scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checkouts" className="animate-fade-in">
            {todayCheckOuts.length > 0 ? (
              <BookingTable bookings={todayCheckOuts} />
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <CalendarX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No check-outs scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="animate-fade-in">
            {pendingPayments.length > 0 ? (
              <BookingTable bookings={pendingPayments} />
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">All payments are collected</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
