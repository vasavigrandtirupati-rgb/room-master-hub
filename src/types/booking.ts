export type RoomStatus = 'Available' | 'Checked-In' | 'Checked-Out' | 'Reserved' | 'Maintenance';
export type CleaningStatus = 'Clean' | 'Dirty' | 'In Progress';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending';
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Premium';

export interface Booking {
  id: string;
  bookedBy: string;
  bookingId: string;
  bookingSource: string;
  name: string;
  mobileNo: string;
  email: string;
  address: string;
  arrivedFrom: string;
  purposeOfVisit: string;
  idProofType: string;
  idProofNumber: string;
  checkInDate: string;
  checkInTime: string;
  noOfDays: number;
  extendedDays: number;
  checkOutDate: string;
  checkOutTime: string;
  roomType: RoomType;
  roomNo: string;
  adult: number;
  child: number;
  roomStatus: RoomStatus;
  cleaningStatus: CleaningStatus;
  keyReturned: boolean;
  roomChargePerDay: number;
  totalRoomCharge: number;
  extraBedCharge: number;
  extraPersonCharge: number;
  beverageCharges: number;
  waterBottleAmount: number;
  foodCharges: number;
  laundryCharges: number;
  serviceCharges: number;
  damagesCharges: number;
  discountPercent: number;
  finalPayableAmount: number;
  amountPaid: number;
  balanceAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  donorOwnerName: string;
  donorPhone: string;
  donorId: string;
  reference: string;
  noteRemarks: string;
  checkoutDoneBy: string;
  feedbackRating: number;
  feedbackComment: string;
  recordId: string;
  createdAt: string;
  lastUpdated: string;
  syncedToApp: boolean;
}

export interface Room {
  roomNo: string;
  roomType: RoomType;
  status: RoomStatus;
  cleaningStatus: CleaningStatus;
  currentGuest?: string;
  checkOutDate?: string;
}
