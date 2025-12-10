import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBookings } from '@/data/mockData';
import { Coffee, UtensilsCrossed, Shirt, Plus, Search, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const chargeCategories = [
  { id: 'beverages', label: 'Beverages', icon: Coffee, items: [
    { name: 'Tea', price: 20 },
    { name: 'Coffee', price: 30 },
    { name: 'Soft Drink', price: 50 },
    { name: 'Water Bottle', price: 25 },
    { name: 'Juice', price: 60 },
  ]},
  { id: 'food', label: 'Food', icon: UtensilsCrossed, items: [
    { name: 'Breakfast', price: 200 },
    { name: 'Lunch', price: 350 },
    { name: 'Dinner', price: 400 },
    { name: 'Snacks', price: 100 },
    { name: 'Room Service', price: 150 },
  ]},
  { id: 'laundry', label: 'Laundry', icon: Shirt, items: [
    { name: 'Shirt', price: 40 },
    { name: 'Pants', price: 50 },
    { name: 'Suit', price: 200 },
    { name: 'Dress', price: 150 },
    { name: 'Express Service', price: 100 },
  ]},
];

const Charges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [charges, setCharges] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const checkedInBookings = mockBookings.filter(b => b.roomStatus === 'Checked-In');

  const handleSearch = () => {
    const booking = checkedInBookings.find(
      b => b.bookingId.toLowerCase() === searchQuery.toLowerCase() ||
           b.roomNo === searchQuery ||
           b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (booking) {
      setSelectedBooking(booking);
      setCharges({});
    } else {
      toast({
        title: "Booking not found",
        description: "No checked-in guest found.",
        variant: "destructive",
      });
    }
  };

  const addCharge = (itemName: string, price: number) => {
    setCharges(prev => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + price,
    }));
    toast({
      title: "Charge added",
      description: `Added ${itemName} - ₹${price}`,
    });
  };

  const totalNewCharges = Object.values(charges).reduce((sum, val) => sum + val, 0);

  const saveCharges = () => {
    toast({
      title: "Charges saved",
      description: `₹${totalNewCharges.toLocaleString()} added to Room ${selectedBooking?.roomNo}`,
    });
    setCharges({});
  };

  return (
    <MainLayout title="Additional Charges" subtitle="Add beverages, food, laundry and other charges">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Select Room</CardTitle>
            <CardDescription>
              Search or select a checked-in room to add charges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter room number or guest name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                {checkedInBookings.map((booking) => (
                  <Button
                    key={booking.id}
                    variant={selectedBooking?.id === booking.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setCharges({});
                    }}
                  >
                    Room {booking.roomNo}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charges Interface */}
        {selectedBooking && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charge Items */}
            <div className="lg:col-span-2">
              <Card className="shadow-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-display">
                    Add Charges - Room {selectedBooking.roomNo}
                  </CardTitle>
                  <CardDescription>{selectedBooking.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="beverages">
                    <TabsList className="grid w-full grid-cols-3">
                      {chargeCategories.map((cat) => (
                        <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {chargeCategories.map((category) => (
                      <TabsContent key={category.id} value={category.id} className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {category.items.map((item) => (
                            <Button
                              key={item.name}
                              variant="outline"
                              className="h-auto flex-col py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => addCharge(item.name, item.price)}
                            >
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm opacity-70">₹{item.price}</span>
                            </Button>
                          ))}
                        </div>

                        {/* Custom Charge */}
                        <div className="mt-6 pt-4 border-t space-y-3">
                          <Label>Custom Charge</Label>
                          <div className="flex gap-3">
                            <Input placeholder="Item name" className="flex-1" id="customName" />
                            <Input placeholder="Amount" type="number" className="w-32" id="customAmount" />
                            <Button 
                              variant="secondary"
                              onClick={() => {
                                const name = (document.getElementById('customName') as HTMLInputElement).value;
                                const amount = parseInt((document.getElementById('customAmount') as HTMLInputElement).value);
                                if (name && amount) {
                                  addCharge(name, amount);
                                  (document.getElementById('customName') as HTMLInputElement).value = '';
                                  (document.getElementById('customAmount') as HTMLInputElement).value = '';
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Running Total */}
            <div>
              <Card className="shadow-card sticky top-6 animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-display">Current Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(charges).length === 0 ? (
                      <p className="text-muted-foreground text-sm">No charges added yet</p>
                    ) : (
                      Object.entries(charges).map(([name, amount]) => (
                        <div key={name} className="flex justify-between items-center">
                          <span>{name}</span>
                          <Badge variant="secondary">₹{amount}</Badge>
                        </div>
                      ))
                    )}
                    
                    {Object.entries(charges).length > 0 && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{totalNewCharges.toLocaleString()}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" onClick={saveCharges}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Charges
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Existing Charges */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">
                      Existing Charges
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Beverages</span>
                        <span>₹{selectedBooking.beverageCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food</span>
                        <span>₹{selectedBooking.foodCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Laundry</span>
                        <span>₹{selectedBooking.laundryCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service</span>
                        <span>₹{selectedBooking.serviceCharges}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Charges;
