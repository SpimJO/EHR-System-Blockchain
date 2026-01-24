import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

const colorClasses = {
    blue: {
        border: 'border-l-blue-500',
        bg: 'bg-blue-100',
        icon: 'text-blue-600',
        text: 'text-blue-600',
    },
    green: {
        border: 'border-l-green-500',
        bg: 'bg-green-100',
        icon: 'text-green-600',
        text: 'text-green-600',
    },
    orange: {
        border: 'border-l-orange-500',
        bg: 'bg-orange-100',
        icon: 'text-orange-600',
        text: 'text-orange-600',
    },
    purple: {
        border: 'border-l-purple-500',
        bg: 'bg-purple-100',
        icon: 'text-purple-600',
        text: 'text-purple-600',
    },
    red: {
        border: 'border-l-red-500',
        bg: 'bg-red-100',
        icon: 'text-red-600',
        text: 'text-red-600',
    },
};

export function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'blue',
    trend,
    className,
}: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <Card
            className={cn(
                'border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                colors.border,
                className
            )}
        >
            <CardContent className="flex items-center gap-4 pt-6">
                <div
                    className={cn(
                        'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
                        colors.bg
                    )}
                >
                    <Icon className={cn('w-7 h-7', colors.icon)} />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {value}
                        </h3>
                        {trend && (
                            <span
                                className={cn(
                                    'text-sm font-semibold',
                                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                                )}
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}
