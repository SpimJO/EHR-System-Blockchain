
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowDownIcon, MinusIcon, TrendingUpIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  iconClassName?: string;
  variant?: 'default' | 'gradient' | 'outline';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconClassName,
  variant = 'default'
}: StatsCardProps) {
  const isGradient = variant === 'gradient';
  
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      isGradient 
        ? "bg-gradient-to-br from-primary via-primary to-orange-500 text-white border-0 shadow-lg shadow-primary/20" 
        : "border-border/50 bg-card hover:border-primary/20 hover:shadow-primary/5",
      className
    )}>
      {/* Decorative Background */}
      {!isGradient && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      )}
      {isGradient && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      )}
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className={cn(
              "text-sm font-medium",
              isGradient ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <h2 className={cn(
              "text-3xl font-bold tracking-tight tabular-nums",
              isGradient ? "text-white" : "text-foreground"
            )}>
              {value}
            </h2>
          </div>
          
          <div className={cn(
            "flex items-center justify-center p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            isGradient 
              ? "bg-white/20 text-white" 
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
            iconClassName
          )}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        
        {(description || trend) && (
          <div className={cn(
            "mt-4 pt-4 flex items-center text-xs",
            isGradient ? "border-t border-white/20" : "border-t border-border/50"
          )}>
            {trend && (
              <div className={cn(
                "flex items-center font-semibold px-2 py-1 rounded-full mr-2 gap-1",
                isGradient ? (
                  trend.trend === 'up' ? "text-emerald-100 bg-emerald-500/30" :
                  trend.trend === 'down' ? "text-rose-100 bg-rose-500/30" : 
                  "text-white/80 bg-white/20"
                ) : (
                  trend.trend === 'up' ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20" :
                  trend.trend === 'down' ? "text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/20" :
                  "text-muted-foreground bg-muted"
                )
              )}>
                {trend.trend === 'up' && <TrendingUpIcon className="w-3 h-3" />}
                {trend.trend === 'down' && <ArrowDownIcon className="w-3 h-3" />}
                {trend.trend === 'neutral' && <MinusIcon className="w-3 h-3" />}
                {trend.trend === 'up' ? '+' : ''}{trend.value}%
              </div>
            )}
            <span className={cn(
              isGradient ? "text-white/70" : "text-muted-foreground"
            )}>
              {trend?.label || description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StatsCard };