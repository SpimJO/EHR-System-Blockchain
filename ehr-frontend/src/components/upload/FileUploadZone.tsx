import { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CloudUploadIcon,
    FileIcon,
    CheckCircle2Icon,
    XCircleIcon,
    LockIcon,
    ShieldCheckIcon,
    AlertCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
    onFileSelect?: (file: File) => void;
    onUpload?: (file: File) => Promise<void>;
    acceptedTypes?: string[];
    maxSize?: number; // in MB
    showEncryptionNotice?: boolean;
    className?: string;
}

export function FileUploadZone({
    onFileSelect,
    onUpload,
    acceptedTypes = [
        '.pdf',
        '.jpg',
        '.jpeg',
        '.png',
        '.doc',
        '.docx',
        '.dicom',
    ],
    maxSize = 10,
    showEncryptionNotice = true,
    className,
}: FileUploadZoneProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return {
                valid: false,
                error: `File size exceeds ${maxSize}MB limit`,
            };
        }

        // Check file type
        const fileName = file.name.toLowerCase();
        const hasValidExtension = acceptedTypes.some((type) =>
            fileName.endsWith(type.replace('.', ''))
        );

        if (!hasValidExtension) {
            return {
                valid: false,
                error: `File type not supported. Accepted: ${acceptedTypes.join(', ')}`,
            };
        }

        return { valid: true };
    };

    const handleFileChange = useCallback(
        (file: File) => {
            const validation = validateFile(file);

            if (!validation.valid) {
                setErrorMessage(validation.error || 'Invalid file');
                setUploadStatus('error');
                return;
            }

            setSelectedFile(file);
            setErrorMessage('');
            setUploadStatus('idle');
            onFileSelect?.(file);
        },
        [onFileSelect, acceptedTypes, maxSize]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileChange(file);
            }
        },
        [handleFileChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !onUpload) return;

        setUploadStatus('uploading');
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            await onUpload(selectedFile);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadStatus('success');
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(
                error instanceof Error ? error.message : 'Upload failed'
            );
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
        setErrorMessage('');
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Upload Zone */}
            <Card
                className={cn(
                    'relative overflow-hidden transition-all duration-300 border-2 border-dashed',
                    isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : uploadStatus === 'success'
                            ? 'border-green-400 bg-green-50'
                            : uploadStatus === 'error'
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <CardContent className="p-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon */}
                        <div
                            className={cn(
                                'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
                                uploadStatus === 'success'
                                    ? 'bg-green-100'
                                    : uploadStatus === 'error'
                                        ? 'bg-red-100'
                                        : 'bg-blue-100 group-hover:bg-blue-200'
                            )}
                        >
                            {uploadStatus === 'success' ? (
                                <CheckCircle2Icon className="w-10 h-10 text-green-600" />
                            ) : uploadStatus === 'error' ? (
                                <XCircleIcon className="w-10 h-10 text-red-600" />
                            ) : (
                                <CloudUploadIcon
                                    className={cn(
                                        'w-10 h-10 transition-all duration-300',
                                        isDragging
                                            ? 'text-blue-600 scale-110'
                                            : 'text-blue-500'
                                    )}
                                />
                            )}
                        </div>

                        {/* Text */}
                        {uploadStatus === 'success' ? (
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-green-700">
                                    Upload Successful!
                                </p>
                                <p className="text-sm text-green-600">
                                    File encrypted and uploaded to blockchain
                                </p>
                            </div>
                        ) : uploadStatus === 'error' ? (
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-red-700">
                                    Upload Failed
                                </p>
                                <p className="text-sm text-red-600">{errorMessage}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-gray-700">
                                    {isDragging
                                        ? 'Drop file here'
                                        : selectedFile
                                            ? selectedFile.name
                                            : 'Select or drag file to upload'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {acceptedTypes.join(', ')} • Max {maxSize}MB
                                </p>
                            </div>
                        )}

                        {/* Selected File Info */}
                        {selectedFile && uploadStatus === 'idle' && (
                            <div className="w-full bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                                <FileIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={reset}
                                    className="flex-shrink-0"
                                >
                                    <XCircleIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Upload Progress */}
                        {uploadStatus === 'uploading' && (
                            <div className="w-full space-y-2">
                                <Progress value={uploadProgress} className="h-2" />
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Encrypting and uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {uploadStatus === 'idle' || uploadStatus === 'error' ? (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() =>
                                            document.getElementById('file-input')?.click()
                                        }
                                    >
                                        <FileIcon className="w-4 h-4 mr-2" />
                                        Choose File
                                    </Button>
                                    {selectedFile && onUpload && (
                                        <Button
                                            variant="default"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={handleUpload}
                                        >
                                            <CloudUploadIcon className="w-4 h-4 mr-2" />
                                            Upload & Encrypt
                                        </Button>
                                    )}
                                </>
                            ) : uploadStatus === 'success' ? (
                                <Button variant="outline" onClick={reset}>
                                    Upload Another File
                                </Button>
                            ) : null}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept={acceptedTypes.join(',')}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>

                {/* Animated border effect */}
                {isDragging && (
                    <div className="absolute inset-0 border-4 border-blue-400 rounded-lg animate-pulse pointer-events-none" />
                )}
            </Card>

            {/* Encryption Notice */}
            {showEncryptionNotice && (
                <Alert className="border-blue-200 bg-blue-50">
                    <LockIcon className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-800 ml-2">
                        <span className="font-semibold">End-to-End Encryption: </span>
                        Your file will be encrypted with AES-256 encryption before uploading
                        to IPFS. Only authorized users with blockchain permissions can
                        decrypt and view your records.
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldCheckIcon className="w-4 h-4" />
                            <span className="text-xs">
                                Transaction will be verified on Ethereum blockchain
                            </span>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
