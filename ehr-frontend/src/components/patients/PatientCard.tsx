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
    FileTextIcon,
    ClockIcon,
    ShieldCheckIcon,
    EyeIcon,
    UserIcon,
    CalendarIcon,
    ActivityIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientCardProps {
    patient: {
        id: string;
        name: string;
        email?: string;
        avatar?: string;
        recordCount: number;
        grantedAt: string | number;
        lastAccessed?: string | number;
        blockchainAddress?: string;
        transactionHash?: string;
        age?: number;
        gender?: string;
    };
    onViewRecords?: (id: string) => void;
    className?: string;
}

export function PatientCard({
    patient,
    onViewRecords,
    className,
}: PatientCardProps) {
    const formatTimestamp = (timestamp: string | number) => {
        const date =
            typeof timestamp === 'number'
                ? new Date(timestamp * 1000)
                : new Date(timestamp);

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
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

    const truncateAddress = (address: string) => {
        if (address.length <= 16) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300 border-2 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1',
                className
            )}
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top green indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />

            <CardHeader className="relative pb-3">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-16 h-16 border-3 border-white shadow-lg ring-2 ring-green-100 group-hover:ring-green-300 group-hover:scale-110 transition-all">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xl">
                            {getInitials(patient.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">
                            {patient.name}
                        </h3>
                        {patient.email && (
                            <p className="text-sm text-gray-500 mt-0.5 truncate">
                                {patient.email}
                            </p>
                        )}

                        {/* Patient Details */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {patient.age && (
                                <Badge variant="secondary" className="text-xs">
                                    <UserIcon className="w-3 h-3 mr-1" />
                                    {patient.age} yrs
                                </Badge>
                            )}
                            {patient.gender && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                    {patient.gender}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative space-y-3">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Record Count */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <FileTextIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700 uppercase">
                                Records
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                            {patient.recordCount}
                        </p>
                    </div>

                    {/* Last Accessed */}
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                            <ActivityIcon className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-700 uppercase">
                                Activity
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-purple-900 mt-2">
                            {patient.lastAccessed
                                ? formatTimestamp(patient.lastAccessed)
                                : 'Never'}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Blockchain Info */}
                <div className="space-y-2">
                    {/* Access Granted */}
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>Access granted</span>
                        </div>
                        <span className="font-medium text-gray-900">
                            {formatTimestamp(patient.grantedAt)}
                        </span>
                    </div>

                    {/* Blockchain Verification */}
                    {patient.transactionHash && (
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <ShieldCheckIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-purple-700">
                                    Granted on Ethereum
                                </p>
                                {patient.blockchainAddress && (
                                    <p className="text-xs text-purple-600 font-mono truncate">
                                        {truncateAddress(patient.blockchainAddress)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="relative pt-3 border-t">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all group/button"
                    onClick={() => onViewRecords?.(patient.id)}
                >
                    <EyeIcon className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform" />
                    View Medical Records
                </Button>
            </CardFooter>

            {/* Hover glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
        </Card>
    );
}
