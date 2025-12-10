import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRooms } from '@/data/mockData';
import { Plus, Trash2, Edit, BedDouble } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RoomType, CleaningStatus, RoomStatus, Room } from '@/types/booking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roomTypes: RoomType[] = ['Standard', 'Deluxe', 'Suite', 'Premium'];

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    roomNo: '',
    roomType: 'Standard' as RoomType,
    pricePerDay: '',
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.roomNo) {
      toast({ title: "Error", description: "Room number is required", variant: "destructive" });
      return;
    }

    if (editingRoom) {
      setRooms(prev => prev.map(r => 
        r.roomNo === editingRoom.roomNo 
          ? { ...r, roomNo: formData.roomNo, roomType: formData.roomType }
          : r
      ));
      toast({ title: "Room updated", description: `Room ${formData.roomNo} has been updated.` });
    } else {
      if (rooms.find(r => r.roomNo === formData.roomNo)) {
        toast({ title: "Error", description: "Room number already exists", variant: "destructive" });
        return;
      }
      const newRoom: Room = {
        roomNo: formData.roomNo,
        roomType: formData.roomType,
        status: 'Available' as RoomStatus,
        cleaningStatus: 'Clean' as CleaningStatus,
      };
      setRooms(prev => [...prev, newRoom]);
      toast({ title: "Room added", description: `Room ${formData.roomNo} has been added.` });
    }

    setFormData({ roomNo: '', roomType: 'Standard', pricePerDay: '' });
    setEditingRoom(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({ roomNo: room.roomNo, roomType: room.roomType, pricePerDay: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (roomNo: string) => {
    setRooms(prev => prev.filter(r => r.roomNo !== roomNo));
    toast({ title: "Room deleted", description: `Room ${roomNo} has been removed.` });
  };

  const statusColors = {
    'Available': 'bg-status-available text-white',
    'Checked-In': 'bg-status-occupied text-white',
    'Checked-Out': 'bg-muted-foreground text-white',
    'Reserved': 'bg-status-reserved text-white',
    'Maintenance': 'bg-status-maintenance text-white',
  };

  return (
    <MainLayout title="Room Management" subtitle="Add, edit, and manage hotel rooms">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Card className="px-4 py-2 shadow-card">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                <span className="font-semibold">{rooms.length}</span>
                <span className="text-muted-foreground">Total Rooms</span>
              </div>
            </Card>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingRoom(null); setFormData({ roomNo: '', roomType: 'Standard', pricePerDay: '' }); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </DialogTitle>
                <DialogDescription>
                  {editingRoom ? 'Update room details' : 'Enter the details for the new room'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="roomNo">Room Number *</Label>
                  <Input
                    id="roomNo"
                    placeholder="e.g., 101, 201A"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Room Type *</Label>
                  <Select 
                    value={formData.roomType} 
                    onValueChange={(value: RoomType) => setFormData({ ...formData, roomType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price Per Day (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    {editingRoom ? 'Update Room' : 'Add Room'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rooms Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">All Rooms</CardTitle>
            <CardDescription>Manage your hotel room inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Room No</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Cleaning</TableHead>
                  <TableHead className="font-semibold">Current Guest</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.roomNo} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-primary">{room.roomNo}</TableCell>
                    <TableCell>{room.roomType}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[room.status]}>{room.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{room.cleaningStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {room.currentGuest || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(room.roomNo)}
                          disabled={room.status === 'Checked-In'}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RoomManagement;
