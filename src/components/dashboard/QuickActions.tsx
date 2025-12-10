import { Button } from '@/components/ui/button';
import { Plus, LogIn, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'New Booking', icon: Plus, onClick: () => navigate('/bookings?action=new'), variant: 'default' as const },
    { label: 'Check-In', icon: LogIn, onClick: () => navigate('/check-in'), variant: 'outline' as const },
    { label: 'Check-Out', icon: LogOut, onClick: () => navigate('/check-out'), variant: 'outline' as const },
    { label: 'Search', icon: Search, onClick: () => navigate('/bookings'), variant: 'secondary' as const },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            onClick={action.onClick}
            className="h-auto flex-col gap-2 py-4"
          >
            <action.icon className="h-5 w-5" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
