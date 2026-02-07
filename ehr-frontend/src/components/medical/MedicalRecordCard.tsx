import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
    FileTextIcon,
    DownloadIcon,
    EyeIcon,
    MoreVerticalIcon,
    TrashIcon,
    ShareIcon,
    CalendarIcon,
    FileIcon,
    ShieldCheckIcon,
    ClockIcon,
    UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MedicalRecordCardProps {
    record: {
        id: string;
        title: string;
        description?: string;
        recordType: string;
        recordDate: string;
        uploadedAt: string;
        fileSize?: string;
        uploadedBy?: string;
        isVerified?: boolean;
        transactionHash?: string;
        encryptionType?: string;
    };
    onView?: (id: string) => void;
    onDownload?: (id: string) => void;
    onDelete?: (id: string) => void;
    onShare?: (id: string) => void;
    className?: string;
}

const recordTypeConfig = {
    lab: {
        label: 'Lab Results',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: '🧪',
    },
    prescription: {
        label: 'Prescription',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: '💊',
    },
    imaging: {
        label: 'Imaging',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: '🔬',
    },
    diagnosis: {
        label: 'Diagnosis',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: '🩺',
    },
    other: {
        label: 'Other',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: '📄',
    },
};

export function MedicalRecordCard({
    record,
    onView,
    onDownload,
    onDelete,
    onShare,
    className,
}: MedicalRecordCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const recordConfig =
        recordTypeConfig[record.recordType as keyof typeof recordTypeConfig] ||
        recordTypeConfig.other;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Card
                className={cn(
                    'group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-blue-300',
                    className
                )}
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-200 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                {recordConfig.icon}
                            </div>
                        </div>

                        {/* Title & Type */}
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                {record.title}
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className={cn('capitalize font-semibold', recordConfig.color)}
                            >
                                {recordConfig.label}
                            </Badge>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => onView?.(record.id)}>
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDownload?.(record.id)}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onShare?.(record.id)}>
                                    <ShareIcon className="mr-2 h-4 w-4" />
                                    Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="relative space-y-3">
                    {/* Description */}
                    {record.description && (
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                            {record.description}
                        </CardDescription>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{formatDate(record.recordDate)}</span>
                        </div>
                        {record.fileSize && (
                            <div className="flex items-center gap-1.5">
                                <FileIcon className="w-3.5 h-3.5" />
                                <span>{record.fileSize}</span>
                            </div>
                        )}
                        {record.uploadedBy && (
                            <div className="flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" />
                                <span>{record.uploadedBy}</span>
                            </div>
                        )}
                    </div>

                    {/* Encryption Badge */}
                    <div className="flex items-center gap-2 pt-2">
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                        >
                            <ShieldCheckIcon className="w-3 h-3 mr-1" />
                            {record.encryptionType || 'AES-256'} Encrypted
                        </Badge>
                        {record.isVerified && (
                            <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                                ✓ Blockchain Verified
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="relative flex gap-2 pt-4 border-t">
                    <Button
                        size="sm"
                        variant="default"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => onView?.(record.id)}
                    >
                        <EyeIcon className="w-4 h-4 mr-1.5" />
                        View
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-blue-50"
                        onClick={() => onDownload?.(record.id)}
                    >
                        <DownloadIcon className="w-4 h-4 mr-1.5" />
                        Download
                    </Button>
                </CardFooter>

                {/* Hover glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medical Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{record.title}"? This action
                            cannot be undone. The record will be permanently removed from the
                            blockchain.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete?.(record.id)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
