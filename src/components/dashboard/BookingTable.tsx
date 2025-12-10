import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BookingTableProps {
  bookings: Booking[];
  title?: string;
  showActions?: boolean;
}

const paymentStatusStyles = {
  'Paid': 'bg-status-available text-white',
  'Partial': 'bg-status-cleaning text-white',
  'Pending': 'bg-status-maintenance text-white',
};

const roomStatusStyles = {
  'Available': 'bg-status-available/10 text-status-available border-status-available/30',
  'Checked-In': 'bg-status-occupied/10 text-status-occupied border-status-occupied/30',
  'Checked-Out': 'bg-muted text-muted-foreground border-muted-foreground/30',
  'Reserved': 'bg-status-reserved/10 text-status-reserved border-status-reserved/30',
  'Maintenance': 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30',
};

export function BookingTable({ bookings, title, showActions = true }: BookingTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {title && (
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Booking ID</TableHead>
              <TableHead className="font-semibold">Guest</TableHead>
              <TableHead className="font-semibold">Room</TableHead>
              <TableHead className="font-semibold">Check-In</TableHead>
              <TableHead className="font-semibold">Check-Out</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold text-right">Amount</TableHead>
              {showActions && <TableHead className="font-semibold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-primary">
                  {booking.bookingId}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.mobileNo}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">Room {booking.roomNo}</p>
                    <p className="text-sm text-muted-foreground">{booking.roomType}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {booking.checkInDate}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {booking.checkOutDate}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", roomStatusStyles[booking.roomStatus])}
                  >
                    {booking.roomStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("font-medium", paymentStatusStyles[booking.paymentStatus])}>
                    {booking.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ₹{booking.finalPayableAmount.toLocaleString()}
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
