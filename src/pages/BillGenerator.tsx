import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Printer, Download, User, Phone, MapPin, Calendar, BedDouble, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoomType } from '@/types/booking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillData {
  guestName: string;
  contactNumber: string;
  address: string;
  adults: number;
  children: number;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  roomType: RoomType;
  roomNo: string;
  pricePerDay: number;
  numberOfDays: number;
  extraBedCharge: number;
  foodCharges: number;
  beverageCharges: number;
  laundryCharges: number;
  serviceCharges: number;
  discountPercent: number;
  advancePaid: number;
  billType: 'booking' | 'checkout';
}

const initialBillData: BillData = {
  guestName: '',
  contactNumber: '',
  address: '',
  adults: 1,
  children: 0,
  checkInDate: '',
  checkInTime: '14:00',
  checkOutDate: '',
  checkOutTime: '11:00',
  roomType: 'Standard',
  roomNo: '',
  pricePerDay: 1500,
  numberOfDays: 1,
  extraBedCharge: 0,
  foodCharges: 0,
  beverageCharges: 0,
  laundryCharges: 0,
  serviceCharges: 0,
  discountPercent: 0,
  advancePaid: 0,
  billType: 'checkout',
};

const BillGenerator = () => {
  const [billData, setBillData] = useState<BillData>(initialBillData);
  const [showBill, setShowBill] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const calculateDays = () => {
    if (billData.checkInDate && billData.checkOutDate) {
      const checkIn = new Date(billData.checkInDate);
      const checkOut = new Date(billData.checkOutDate);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return billData.numberOfDays;
  };

  const roomCharge = billData.pricePerDay * calculateDays();
  const subtotal = roomCharge + billData.extraBedCharge + billData.foodCharges + 
                   billData.beverageCharges + billData.laundryCharges + billData.serviceCharges;
  const discount = subtotal * (billData.discountPercent / 100);
  const grandTotal = subtotal - discount;
  const balanceDue = grandTotal - billData.advancePaid;

  const generateBill = () => {
    if (!billData.guestName || !billData.contactNumber || !billData.checkInDate || !billData.checkOutDate) {
      toast({ title: "Missing Information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setShowBill(true);
    toast({ title: "Bill Generated", description: "Your bill has been generated successfully" });
  };

  const handlePrint = () => {
    const printContent = billRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>Hotel Bill</title>');
      printWindow?.document.write('<style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd}.text-right{text-align:right}.font-bold{font-weight:bold}.text-center{text-align:center}.border-t{border-top:2px solid #333}.mt-4{margin-top:16px}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl{font-size:1.5rem}.bg-gray{background:#f5f5f5}</style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(printContent.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  const billNumber = `BILL-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <MainLayout title="Bill Generator" subtitle="Generate professional hotel bills for guests">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Guest Information
              </CardTitle>
              <CardDescription>Enter guest and booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Guest Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={billData.guestName}
                    onChange={(e) => setBillData({ ...billData, guestName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Contact Number *</Label>
                  <Input
                    placeholder="10-digit mobile"
                    value={billData.contactNumber}
                    onChange={(e) => setBillData({ ...billData, contactNumber: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  placeholder="Complete address"
                  value={billData.address}
                  onChange={(e) => setBillData({ ...billData, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Adults *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={billData.adults}
                    onChange={(e) => setBillData({ ...billData, adults: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Children</Label>
                  <Input
                    type="number"
                    min={0}
                    value={billData.children}
                    onChange={(e) => setBillData({ ...billData, children: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Stay Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-In Date *</Label>
                  <Input
                    type="date"
                    value={billData.checkInDate}
                    onChange={(e) => setBillData({ ...billData, checkInDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Check-In Time</Label>
                  <Input
                    type="time"
                    value={billData.checkInTime}
                    onChange={(e) => setBillData({ ...billData, checkInTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-Out Date *</Label>
                  <Input
                    type="date"
                    value={billData.checkOutDate}
                    onChange={(e) => setBillData({ ...billData, checkOutDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Check-Out Time</Label>
                  <Input
                    type="time"
                    value={billData.checkOutTime}
                    onChange={(e) => setBillData({ ...billData, checkOutTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Room No *</Label>
                  <Input
                    placeholder="e.g., 101"
                    value={billData.roomNo}
                    onChange={(e) => setBillData({ ...billData, roomNo: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Room Type</Label>
                  <Select 
                    value={billData.roomType} 
                    onValueChange={(value: RoomType) => setBillData({ ...billData, roomType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price/Day (₹)</Label>
                  <Input
                    type="number"
                    value={billData.pricePerDay}
                    onChange={(e) => setBillData({ ...billData, pricePerDay: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display">Additional Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Extra Bed (₹)</Label>
                  <Input
                    type="number"
                    value={billData.extraBedCharge}
                    onChange={(e) => setBillData({ ...billData, extraBedCharge: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Food Charges (₹)</Label>
                  <Input
                    type="number"
                    value={billData.foodCharges}
                    onChange={(e) => setBillData({ ...billData, foodCharges: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Beverages (₹)</Label>
                  <Input
                    type="number"
                    value={billData.beverageCharges}
                    onChange={(e) => setBillData({ ...billData, beverageCharges: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Laundry (₹)</Label>
                  <Input
                    type="number"
                    value={billData.laundryCharges}
                    onChange={(e) => setBillData({ ...billData, laundryCharges: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Service (₹)</Label>
                  <Input
                    type="number"
                    value={billData.serviceCharges}
                    onChange={(e) => setBillData({ ...billData, serviceCharges: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    max={100}
                    value={billData.discountPercent}
                    onChange={(e) => setBillData({ ...billData, discountPercent: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Advance Paid (₹)</Label>
                  <Input
                    type="number"
                    value={billData.advancePaid}
                    onChange={(e) => setBillData({ ...billData, advancePaid: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label>Bill Type</Label>
                <Select 
                  value={billData.billType} 
                  onValueChange={(value: 'booking' | 'checkout') => setBillData({ ...billData, billType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking Confirmation</SelectItem>
                    <SelectItem value="checkout">Checkout Bill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={generateBill}>
            <FileText className="h-5 w-5 mr-2" />
            Generate Professional Bill
          </Button>
        </div>

        {/* Bill Preview Section */}
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            {showBill && (
              <>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Bill
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </>
            )}
          </div>

          <Card className="shadow-elevated">
            <CardContent className="p-0">
              {!showBill ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground">No Bill Generated Yet</h3>
                  <p className="text-muted-foreground mt-2">Fill in the guest details and generate a bill to see the preview here.</p>
                </div>
              ) : (
                <div ref={billRef} className="p-8 bg-card">
                  {/* Bill Header */}
                  <div className="text-center border-b-2 border-primary pb-4 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Building2 className="h-10 w-10 text-primary" />
                      <h1 className="font-display text-3xl font-bold text-primary">StayManager</h1>
                    </div>
                    <p className="text-muted-foreground">Premium Hospitality</p>
                    <p className="text-sm text-muted-foreground mt-1">123 Hotel Street, City - 123456 | Phone: +91 98765 43210</p>
                  </div>

                  {/* Bill Info */}
                  <div className="flex justify-between mb-6">
                    <div>
                      <p className="font-semibold text-lg">
                        {billData.billType === 'booking' ? 'BOOKING CONFIRMATION' : 'CHECKOUT BILL'}
                      </p>
                      <p className="text-sm text-muted-foreground">Bill No: {billNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Date: {currentDate}</p>
                      <p className="text-sm">Room: {billData.roomNo}</p>
                    </div>
                  </div>

                  {/* Guest Details */}
                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">Guest Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {billData.guestName}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {billData.contactNumber}</p>
                      <p><span className="text-muted-foreground">Guests:</span> {billData.adults} Adults, {billData.children} Children</p>
                      <p><span className="text-muted-foreground">Room Type:</span> {billData.roomType}</p>
                      <p><span className="text-muted-foreground">Check-In:</span> {billData.checkInDate} at {billData.checkInTime}</p>
                      <p><span className="text-muted-foreground">Check-Out:</span> {billData.checkOutDate} at {billData.checkOutTime}</p>
                    </div>
                    {billData.address && (
                      <p className="text-sm mt-2"><span className="text-muted-foreground">Address:</span> {billData.address}</p>
                    )}
                  </div>

                  {/* Charges Table */}
                  <table className="w-full mb-6">
                    <thead>
                      <tr className="border-b-2 border-foreground">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2">Room Charges ({calculateDays()} nights × ₹{billData.pricePerDay})</td>
                        <td className="text-right py-2">{roomCharge.toLocaleString()}</td>
                      </tr>
                      {billData.extraBedCharge > 0 && (
                        <tr className="border-b border-border">
                          <td className="py-2">Extra Bed Charges</td>
                          <td className="text-right py-2">{billData.extraBedCharge.toLocaleString()}</td>
                        </tr>
                      )}
                      {billData.foodCharges > 0 && (
                        <tr className="border-b border-border">
                          <td className="py-2">Food Charges</td>
                          <td className="text-right py-2">{billData.foodCharges.toLocaleString()}</td>
                        </tr>
                      )}
                      {billData.beverageCharges > 0 && (
                        <tr className="border-b border-border">
                          <td className="py-2">Beverages & Snacks</td>
                          <td className="text-right py-2">{billData.beverageCharges.toLocaleString()}</td>
                        </tr>
                      )}
                      {billData.laundryCharges > 0 && (
                        <tr className="border-b border-border">
                          <td className="py-2">Laundry Charges</td>
                          <td className="text-right py-2">{billData.laundryCharges.toLocaleString()}</td>
                        </tr>
                      )}
                      {billData.serviceCharges > 0 && (
                        <tr className="border-b border-border">
                          <td className="py-2">Service Charges</td>
                          <td className="text-right py-2">{billData.serviceCharges.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="border-t-2 border-foreground pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {billData.discountPercent > 0 && (
                      <div className="flex justify-between text-status-available">
                        <span>Discount ({billData.discountPercent}%)</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Grand Total</span>
                      <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                    {billData.advancePaid > 0 && (
                      <div className="flex justify-between text-status-available">
                        <span>Advance Paid</span>
                        <span>- ₹{billData.advancePaid.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-primary">
                      <span>Balance Due</span>
                      <span>₹{balanceDue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
                    <p>Thank you for staying with us!</p>
                    <p className="mt-1">We hope to see you again soon.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BillGenerator;
