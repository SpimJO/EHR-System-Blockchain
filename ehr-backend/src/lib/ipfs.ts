import axios from "axios";
import FormData from "form-data";

/**
 * IPFS Configuration
 */
export const ipfsConfig = {
    // Pinata API (recommended for production)
    pinata: {
        apiKey: process.env.PINATA_API_KEY || "",
        secretApiKey: process.env.PINATA_SECRET_API_KEY || "",
        uploadUrl: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        gatewayUrl: "https://gateway.pinata.cloud/ipfs/"
    },
    
    // Local IPFS node (for development)
    local: {
        apiUrl: process.env.IPFS_API_URL || "http://localhost:5001/api/v0",
        gatewayUrl: process.env.IPFS_GATEWAY_URL || "http://localhost:8080/ipfs/"
    },

    // Use Pinata or local
    usePinata: process.env.USE_PINATA === "true"
};

/**
 * Upload file to IPFS
 * @param fileBuffer - File content as Buffer
 * @param fileName - Original filename
 * @returns IPFS hash (CID)
 */
export async function uploadToIPFS(
    fileBuffer: Buffer,
    fileName: string
): Promise<string> {
    try {
        if (ipfsConfig.usePinata) {
            return await uploadToPinata(fileBuffer, fileName);
        } else {
            return await uploadToLocalIPFS(fileBuffer, fileName);
        }
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw new Error("Failed to upload file to IPFS");
    }
}

/**
 * Upload to Pinata (managed IPFS service)
 */
async function uploadToPinata(
    fileBuffer: Buffer,
    fileName: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);

    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            encrypted: "true",
            encryption: "AES-128"
        }
    });
    formData.append("pinataMetadata", metadata);

    const response = await axios.post(
        ipfsConfig.pinata.uploadUrl,
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: ipfsConfig.pinata.apiKey,
                pinata_secret_api_key: ipfsConfig.pinata.secretApiKey
            }
        }
    );

    return response.data.IpfsHash;
}

/**
 * Upload to local IPFS node
 */
async function uploadToLocalIPFS(
    fileBuffer: Buffer,
    fileName: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);

    const response = await axios.post(
        `${ipfsConfig.local.apiUrl}/add`,
        formData,
        {
            headers: formData.getHeaders()
        }
    );

    return response.data.Hash;
}

/**
 * Get IPFS gateway URL for a hash
 * @param ipfsHash - IPFS hash (CID)
 * @returns Full gateway URL
 */
export function getIPFSUrl(ipfsHash: string): string {
    if (ipfsConfig.usePinata) {
        return `${ipfsConfig.pinata.gatewayUrl}${ipfsHash}`;
    } else {
        return `${ipfsConfig.local.gatewayUrl}${ipfsHash}`;
    }
}

/**
 * Download file from IPFS
 * @param ipfsHash - IPFS hash (CID)
 * @returns File buffer
 */
export async function downloadFromIPFS(ipfsHash: string): Promise<Buffer> {
    try {
        const url = getIPFSUrl(ipfsHash);
        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error("Error downloading from IPFS:", error);
        throw new Error("Failed to download file from IPFS");
    }
}

/**
 * Validate IPFS configuration
 */
export function validateIPFSConfig(): void {
    if (ipfsConfig.usePinata) {
        if (!ipfsConfig.pinata.apiKey || !ipfsConfig.pinata.secretApiKey) {
            console.warn("⚠️  Pinata API credentials not configured");
        }
    }
}
