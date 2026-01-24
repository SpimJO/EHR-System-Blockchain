import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2Icon,
    XCircleIcon,
    ClockIcon,
    CalendarIcon,
    InfoIcon,
    UserIcon,
    BriefcaseIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessRequestCardProps {
    request: {
        id: string;
        requesterName: string;
        requesterEmail?: string;
        requesterRole?: string;
        requesterSpecialty?: string;
        requesterDepartment?: string;
        requesterAvatar?: string;
        reason: string;
        status: 'pending' | 'approved' | 'denied';
        requestedAt: string;
        duration?: string;
        respondedAt?: string;
    };
    onApprove?: (id: string) => void;
    onDeny?: (id: string) => void;
    viewMode?: 'patient' | 'doctor'; // patient sees incoming, doctor sees outgoing
    className?: string;
}

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: ClockIcon,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle2Icon,
    },
    denied: {
        label: 'Denied',
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: XCircleIcon,
    },
};

export function AccessRequestCard({
    request,
    onApprove,
    onDeny,
    viewMode = 'patient',
    className,
}: AccessRequestCardProps) {
    const config = statusConfig[request.status];
    const StatusIcon = config.icon;

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300 border-2',
                request.status === 'pending'
                    ? 'border-orange-200 bg-gradient-to-br from-orange-50/50 to-white hover:border-orange-300 hover:shadow-lg'
                    : request.status === 'approved'
                        ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-white'
                        : 'border-gray-200 bg-gray-50/50',
                request.status === 'pending' && 'hover:-translate-y-0.5',
                className
            )}
        >
            {/* Status indicator bar */}
            <div
                className={cn(
                    'absolute top-0 left-0 right-0 h-1',
                    request.status === 'pending' && 'bg-orange-500',
                    request.status === 'approved' && 'bg-green-500',
                    request.status === 'denied' && 'bg-red-500'
                )}
            />

            <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border-2 border-white shadow-md ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage src={request.requesterAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                            {getInitials(request.requesterName)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                    {request.requesterName}
                                </h3>
                                {request.requesterEmail && (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {request.requesterEmail}
                                    </p>
                                )}
                            </div>
                            <Badge variant="outline" className={cn('capitalize', config.color)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                            </Badge>
                        </div>

                        {/* Role & Specialty */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {request.requesterRole && (
                                <Badge variant="secondary" className="capitalize">
                                    <UserIcon className="w-3 h-3 mr-1" />
                                    {request.requesterRole}
                                </Badge>
                            )}
                            {request.requesterSpecialty && (
                                <Badge variant="secondary">
                                    <BriefcaseIcon className="w-3 h-3 mr-1" />
                                    {request.requesterSpecialty}
                                </Badge>
                            )}
                            {request.requesterDepartment && !request.requesterSpecialty && (
                                <Badge variant="secondary">
                                    <BriefcaseIcon className="w-3 h-3 mr-1" />
                                    {request.requesterDepartment}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
                {/* Reason */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start gap-2 mb-1.5">
                        <InfoIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Reason for Access
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pl-6">
                        {request.reason}
                    </p>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>
                            Requested {formatRelativeTime(request.requestedAt)}
                        </span>
                    </div>
                    {request.duration && (
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Duration: {request.duration}</span>
                        </div>
                    )}
                    {request.respondedAt && (
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2Icon className="w-3.5 h-3.5" />
                            <span>
                                Responded {formatRelativeTime(request.respondedAt)}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Action Buttons (only for pending requests in patient view) */}
            {request.status === 'pending' && viewMode === 'patient' && (
                <>
                    <Separator />
                    <CardFooter className="flex gap-3 pt-4">
                        <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                            onClick={() => onApprove?.(request.id)}
                        >
                            <CheckCircle2Icon className="w-4 h-4 mr-2" />
                            Approve Access
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow-md transition-all"
                            onClick={() => onDeny?.(request.id)}
                        >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Deny
                        </Button>
                    </CardFooter>
                </>
            )}

            {/* Approved/Denied indicator */}
            {request.status !== 'pending' && (
                <>
                    <Separator />
                    <CardFooter className="pt-3">
                        <div
                            className={cn(
                                'w-full text-center py-2 rounded-lg text-sm font-semibold',
                                request.status === 'approved'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                            )}
                        >
                            {request.status === 'approved'
                                ? '✓ Access Granted'
                                : '✗ Access Denied'}
                        </div>
                    </CardFooter>
                </>
            )}

            {/* Pulse animation for pending */}
            {request.status === 'pending' && (
                <div className="absolute -inset-0.5 bg-orange-400 rounded-lg opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10 animate-pulse" />
            )}
        </Card>
    );
}
