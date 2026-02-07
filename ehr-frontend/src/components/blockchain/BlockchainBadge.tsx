import { ShieldCheckIcon, ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockchainBadgeProps {
    transactionHash?: string;
    blockNumber?: number;
    variant?: 'verified' | 'pending' | 'onchain';
    showEtherscan?: boolean;
    className?: string;
}

export function BlockchainBadge({
    transactionHash,
    blockNumber,
    variant = 'verified',
    showEtherscan = true,
    className,
}: BlockchainBadgeProps) {
    const variantStyles = {
        verified: 'bg-purple-100 text-purple-700 border-purple-200',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        onchain: 'bg-green-100 text-green-700 border-green-200',
    };

    const getEtherscanUrl = () => {
        if (!transactionHash) return '#';
        const baseUrl = import.meta.env.VITE_ETHERSCAN_BASE_URL || 'https://etherscan.io';
        return `${baseUrl}/tx/${transactionHash}`;
    };

    const truncateHash = (hash: string) => {
        if (hash.length <= 16) return hash;
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200',
                variantStyles[variant],
                className
            )}
        >
            <ShieldCheckIcon className="w-3 h-3" />
            <span>
                {variant === 'verified' && 'Verified on Ethereum'}
                {variant === 'pending' && 'Pending Confirmation'}
                {variant === 'onchain' && 'On-Chain'}
            </span>

            {transactionHash && showEtherscan && (
                <a
                    href={getEtherscanUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="font-mono">{truncateHash(transactionHash)}</span>
                    <ExternalLinkIcon className="w-3 h-3" />
                </a>
            )}

            {blockNumber && (
                <span className="ml-1 opacity-70">
                    Block #{blockNumber}
                </span>
            )}
        </div>
    );
}
