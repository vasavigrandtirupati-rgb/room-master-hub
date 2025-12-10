import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBookings } from '@/data/mockData';
import { Search, Star, CreditCard, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CheckOut = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { toast } = useToast();

  const checkedInBookings = mockBookings.filter(b => b.roomStatus === 'Checked-In');

  const handleSearch = () => {
    const booking = checkedInBookings.find(
      b => b.bookingId.toLowerCase() === searchQuery.toLowerCase() ||
           b.mobileNo.includes(searchQuery) ||
           b.roomNo === searchQuery ||
           b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (booking) {
      setSelectedBooking(booking);
    } else {
      toast({
        title: "Booking not found",
        description: "No checked-in booking found with the provided details.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = () => {
    toast({
      title: "Check-out successful!",
      description: `${selectedBooking?.name} has been checked out from Room ${selectedBooking?.roomNo}.`,
    });
    setSelectedBooking(null);
    setSearchQuery('');
    setRating(0);
    setFeedback('');
  };

  const totalCharges = selectedBooking ? (
    selectedBooking.totalRoomCharge +
    selectedBooking.extraBedCharge +
    selectedBooking.extraPersonCharge +
    selectedBooking.beverageCharges +
    selectedBooking.waterBottleAmount +
    selectedBooking.foodCharges +
    selectedBooking.laundryCharges +
    selectedBooking.serviceCharges +
    selectedBooking.damagesCharges
  ) : 0;

  const discount = selectedBooking ? (totalCharges * selectedBooking.discountPercent / 100) : 0;
  const finalAmount = totalCharges - discount;

  return (
    <MainLayout title="Check-Out" subtitle="Process guest departures and collect payments">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Find Guest</CardTitle>
            <CardDescription>
              Search by booking ID, room number, guest name, or phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter booking ID, room, name, or phone..."
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

            {/* Quick Select from Checked-In */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Currently Checked-In:</p>
              <div className="flex flex-wrap gap-2">
                {checkedInBookings.map((booking) => (
                  <Button
                    key={booking.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                    className="gap-2"
                  >
                    Room {booking.roomNo} - {booking.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Details */}
        {selectedBooking && (
          <Card className="shadow-card animate-scale-in">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-xl">
                    Check-Out: Room {selectedBooking.roomNo}
                  </CardTitle>
                  <CardDescription>
                    {selectedBooking.name} • {selectedBooking.bookingId}
                  </CardDescription>
                </div>
                <Badge className="bg-status-occupied">Checked-In</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Charges Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Charges Breakdown
                  </h4>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Charges ({selectedBooking.noOfDays} nights)</span>
                      <span>₹{selectedBooking.totalRoomCharge.toLocaleString()}</span>
                    </div>
                    {selectedBooking.extraBedCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Extra Bed</span>
                        <span>₹{selectedBooking.extraBedCharge.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.beverageCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beverages & Snacks</span>
                        <span>₹{selectedBooking.beverageCharges.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.foodCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Food Charges</span>
                        <span>₹{selectedBooking.foodCharges.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.laundryCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Laundry</span>
                        <span>₹{selectedBooking.laundryCharges.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.serviceCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Charges</span>
                        <span>₹{selectedBooking.serviceCharges.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.waterBottleAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Water Bottles</span>
                        <span>₹{selectedBooking.waterBottleAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>₹{totalCharges.toLocaleString()}</span>
                      </div>
                      {selectedBooking.discountPercent > 0 && (
                        <div className="flex justify-between text-status-available">
                          <span>Discount ({selectedBooking.discountPercent}%)</span>
                          <span>-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold mt-2">
                        <span>Total Amount</span>
                        <span>₹{finalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-status-available">
                        <span>Paid</span>
                        <span>₹{selectedBooking.amountPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-status-maintenance font-semibold">
                        <span>Balance Due</span>
                        <span>₹{selectedBooking.balanceAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                {selectedBooking.balanceAmount > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-foreground">Collect Payment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount Collecting</Label>
                        <Input 
                          type="number" 
                          defaultValue={selectedBooking.balanceAmount}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Guest Feedback
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star 
                              className={cn(
                                "h-8 w-8",
                                star <= rating 
                                  ? "fill-accent text-accent" 
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Comments</Label>
                      <Textarea
                        placeholder="Any feedback from the guest..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleCheckOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Complete Check-Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CheckOut;
