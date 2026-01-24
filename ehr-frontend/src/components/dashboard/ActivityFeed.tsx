import {
    UploadIcon,
    EyeIcon,
    KeyIcon,
    BellIcon,
    FileTextIcon,
    UserCheckIcon,
    ClockIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditLogEntry } from '@/types/api.types';
import { BlockchainBadge } from '@/components/blockchain/BlockchainBadge';

interface ActivityFeedProps {
    activities: AuditLogEntry[];
    maxItems?: number;
    showBlockchain?: boolean;
    className?: string;
}

const activityIcons: Record<string, { icon: typeof UploadIcon; color: string }> = {
    upload: { icon: UploadIcon, color: 'blue' },
    access: { icon: EyeIcon, color: 'green' },
    permission: { icon: KeyIcon, color: 'purple' },
    request: { icon: BellIcon, color: 'orange' },
    record: { icon: FileTextIcon, color: 'blue' },
    grant: { icon: UserCheckIcon, color: 'green' },
    default: { icon: ClockIcon, color: 'gray' },
};

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
};

export function ActivityFeed({
    activities,
    maxItems = 10,
    showBlockchain = true,
    className,
}: ActivityFeedProps) {
    const displayedActivities = activities.slice(0, maxItems);

    const getActivityType = (action: string): keyof typeof activityIcons => {
        const lowercaseAction = action.toLowerCase();
        if (lowercaseAction.includes('upload')) return 'upload';
        if (lowercaseAction.includes('access') || lowercaseAction.includes('view')) return 'access';
        if (lowercaseAction.includes('permission') || lowercaseAction.includes('revoke'))
            return 'permission';
        if (lowercaseAction.includes('request')) return 'request';
        if (lowercaseAction.includes('record')) return 'record';
        if (lowercaseAction.includes('grant') || lowercaseAction.includes('approve')) return 'grant';
        return 'default';
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    if (displayedActivities.length === 0) {
        return (
            <div className={cn('text-center py-12', className)}>
                <ClockIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">
                    Activity will appear here as you use the system
                </p>
            </div>
        );
    }

    return (
        <div className={cn('space-y-3', className)}>
            {displayedActivities.map((activity, index) => {
                const activityType = getActivityType(activity.action);
                const { icon: Icon, color } = activityIcons[activityType];
                const colorClass = colorClasses[color as keyof typeof colorClasses];

                return (
                    <div
                        key={activity.id || index}
                        className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={cn(
                                    'p-2 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-110',
                                    colorClass
                                )}
                            >
                                <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                                            {activity.action}
                                        </p>
                                        {activity.description && (
                                            <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
                                        )}
                                    </div>
                                    <time className="text-xs text-gray-500 shrink-0">
                                        {formatTimestamp(activity.timestamp)}
                                    </time>
                                </div>

                                {activity.actor && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        by <span className="font-medium">{activity.actor}</span>
                                    </p>
                                )}

                                {showBlockchain && activity.transactionHash && (
                                    <div className="mt-2">
                                        <BlockchainBadge
                                            transactionHash={activity.transactionHash}
                                            blockNumber={activity.blockNumber}
                                            variant="verified"
                                            showEtherscan={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
