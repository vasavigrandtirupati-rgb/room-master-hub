import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'success';
  delay?: number;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary text-primary-foreground',
  accent: 'gradient-accent text-accent-foreground',
  warning: 'bg-status-cleaning/10 border-status-cleaning',
  success: 'bg-status-available/10 border-status-available',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 shadow-card border border-border transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 animate-slide-up",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-display font-semibold">{value}</p>
          {subtitle && (
            <p className={cn(
              "mt-1 text-sm",
              variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              "mt-2 text-sm font-medium",
              trend.isPositive ? 'text-status-available' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from yesterday
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === 'default' ? 'bg-primary/10' : 'bg-white/20'
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'default' ? 'text-primary' : ''
          )} />
        </div>
      </div>
    </div>
  );
}
