import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LoadingSkeletonsProps {
    variant?:
    | 'stats'
    | 'record'
    | 'access-request'
    | 'patient'
    | 'activity'
    | 'dashboard';
    count?: number;
    className?: string;
}

export function LoadingSkeletons({
    variant = 'record',
    count = 3,
    className,
}: LoadingSkeletonsProps) {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    if (variant === 'stats') {
        return (
            <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
                {skeletons.map((i) => (
                    <Card key={i} className="border-l-4 border-l-gray-200 animate-pulse">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Skeleton className="h-14 w-14 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (variant === 'record') {
        return (
            <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
                {skeletons.map((i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-4 border-t">
                            <Skeleton className="h-9 flex-1" />
                            <Skeleton className="h-9 flex-1" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (variant === 'access-request') {
        return (
            <div className={cn('space-y-4', className)}>
                {skeletons.map((i) => (
                    <Card key={i} className="overflow-hidden border-2 animate-pulse">
                        <div className="h-1 bg-gray-200" />
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-14 w-14 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                            <Separator />
                            <div className="flex gap-4">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </CardContent>
                        <Separator />
                        <CardFooter className="flex gap-3 pt-4">
                            <Skeleton className="h-9 flex-1" />
                            <Skeleton className="h-9 flex-1" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (variant === 'patient') {
        return (
            <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
                {skeletons.map((i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="h-1 bg-gray-200" />
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-12" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-8 w-12" />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3 border-t">
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (variant === 'activity') {
        return (
            <div className={cn('space-y-3', className)}>
                {skeletons.map((i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border animate-pulse"
                    >
                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                                <Skeleton className="h-3 w-16 shrink-0" />
                            </div>
                            <Skeleton className="h-6 w-40 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'dashboard') {
        return (
            <div className={cn('space-y-6', className)}>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-l-4 border-l-gray-200 animate-pulse">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <Skeleton className="h-14 w-14 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card className="animate-pulse">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Access Requests */}
                    <Card className="animate-pulse">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 border-2 rounded-xl space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-12 w-full" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 flex-1" />
                                        <Skeleton className="h-8 flex-1" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
}

// Individual skeleton variants for specific use cases
export function StatsCardSkeleton() {
    return <LoadingSkeletons variant="stats" count={1} />;
}

export function MedicalRecordCardSkeleton() {
    return <LoadingSkeletons variant="record" count={1} />;
}

export function AccessRequestCardSkeleton() {
    return <LoadingSkeletons variant="access-request" count={1} />;
}

export function PatientCardSkeleton() {
    return <LoadingSkeletons variant="patient" count={1} />;
}

export function ActivityFeedSkeleton() {
    return <LoadingSkeletons variant="activity" count={5} />;
}

export function DashboardSkeleton() {
    return <LoadingSkeletons variant="dashboard" />;
}
