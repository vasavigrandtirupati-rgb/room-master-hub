import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBookings } from '@/data/mockData';
import { Search, User, Phone, Calendar, BedDouble, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CheckIn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    const booking = mockBookings.find(
      b => b.bookingId.toLowerCase() === searchQuery.toLowerCase() ||
           b.mobileNo.includes(searchQuery) ||
           b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (booking) {
      setSelectedBooking(booking);
    } else {
      toast({
        title: "Booking not found",
        description: "No booking found with the provided details.",
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = () => {
    toast({
      title: "Check-in successful!",
      description: `${selectedBooking?.name} has been checked in to Room ${selectedBooking?.roomNo}.`,
    });
    setSelectedBooking(null);
    setSearchQuery('');
  };

  return (
    <MainLayout title="Check-In" subtitle="Process guest arrivals">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Find Booking</CardTitle>
            <CardDescription>
              Search by booking ID, guest name, or phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter booking ID, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {selectedBooking && (
          <Card className="shadow-card animate-scale-in">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-xl">
                    Booking Details
                  </CardTitle>
                  <CardDescription>
                    {selectedBooking.bookingId}
                  </CardDescription>
                </div>
                <Badge 
                  className={
                    selectedBooking.roomStatus === 'Reserved' 
                      ? 'bg-status-reserved' 
                      : 'bg-status-occupied'
                  }
                >
                  {selectedBooking.roomStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Guest Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground text-sm">Name</Label>
                      <p className="font-medium">{selectedBooking.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Phone</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedBooking.mobileNo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Email</Label>
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Address</Label>
                      <p className="font-medium">{selectedBooking.address}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    Booking Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Room</Label>
                        <p className="font-medium">{selectedBooking.roomNo} ({selectedBooking.roomType})</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Guests</Label>
                        <p className="font-medium">
                          {selectedBooking.adult} Adults, {selectedBooking.child} Children
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Check-In
                        </Label>
                        <p className="font-medium">
                          {selectedBooking.checkInDate} at {selectedBooking.checkInTime}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Check-Out
                        </Label>
                        <p className="font-medium">
                          {selectedBooking.checkOutDate} at {selectedBooking.checkOutTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Duration</Label>
                      <p className="font-medium">{selectedBooking.noOfDays} nights</p>
                    </div>
                  </div>
                </div>

                {/* ID Verification */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-foreground">ID Verification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idType">ID Proof Type</Label>
                      <Input 
                        id="idType" 
                        defaultValue={selectedBooking.idProofType}
                        placeholder="e.g., Passport, Aadhaar, Driver License"
                      />
                    </div>
                    <div>
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input 
                        id="idNumber" 
                        defaultValue={selectedBooking.idProofNumber}
                        placeholder="Enter ID number"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-foreground">Payment Summary</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Room Charges</span>
                      <span>₹{selectedBooking.totalRoomCharge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="text-status-available">₹{selectedBooking.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                      <span className="font-semibold">Balance Due</span>
                      <span className="font-semibold text-lg">
                        ₹{selectedBooking.balanceAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCheckIn}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Check-In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CheckIn;
