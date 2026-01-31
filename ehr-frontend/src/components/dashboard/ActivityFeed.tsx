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
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityFeedProps {
  activities: AuditLogEntry[];
  maxItems?: number;
  showBlockchain?: boolean;
  className?: string;
}

const activityIcons: Record<string, { icon: typeof UploadIcon; color: string; bg: string }> = {
  upload: { icon: UploadIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  access: { icon: EyeIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  permission: { icon: KeyIcon, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  request: { icon: BellIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  record: { icon: FileTextIcon, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  grant: { icon: UserCheckIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  default: { icon: ClockIcon, color: 'text-muted-foreground', bg: 'bg-muted' },
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

  if (displayedActivities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
          <ClockIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">No recent activity</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Activity will appear here as you use the system.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('pr-4', className)}>
      <div className="relative space-y-6 ml-2">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/50 -z-10" />

        {displayedActivities.map((activity, index) => {
          const activityType = getActivityType(activity.action);
          const { icon: Icon, color, bg } = activityIcons[activityType];

          return (
            <div key={activity.id || index} className="group relative flex gap-4 items-start">
              {/* Icon Circle */}
              <div 
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all group-hover:scale-110", 
                  color,
                  bg
                )}
              >
               <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {activity.details || formatActivityTitle(activity.action)}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                   {activity.action} by {activity.performedBy}
                </p>
                {showBlockchain && activity.txHash && (
                  <div className="pt-1">
                     <BlockchainBadge txHash={activity.txHash} variant="simple" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function formatActivityTitle(action: string): string {
    return action.charAt(0).toUpperCase() + action.slice(1);
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
