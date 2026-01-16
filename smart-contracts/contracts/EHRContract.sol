// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EHRContract
 * @dev Electronic Health Records Smart Contract
 * Manages patient records, access control, and audit trails on blockchain
 */
contract EHRContract {
    // Events
    event RecordUploaded(
        address indexed patient,
        string recordId,
        string ipfsHash,
        uint256 timestamp
    );
    
    event AccessRequested(
        address indexed patient,
        address indexed requester,
        uint256 timestamp
    );
    
    event AccessGranted(
        address indexed patient,
        address indexed authorizedUser,
        uint256 timestamp
    );
    
    event AccessRevoked(
        address indexed patient,
        address indexed revokedUser,
        uint256 timestamp
    );

    // Structs
    struct MedicalRecord {
        string recordId;
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }

    struct AccessRequest {
        address requester;
        uint256 requestedAt;
        RequestStatus status;
        bool exists;
    }

    enum RequestStatus {
        PENDING,
        APPROVED,
        DENIED
    }

    // State Variables
    mapping(address => MedicalRecord[]) public patientRecords;
    mapping(address => mapping(address => bool)) public authorizedUsers;
    mapping(address => AccessRequest[]) public accessRequests;
    mapping(address => address[]) public authorizedUsersList;

    // Modifiers
    modifier onlyPatient() {
        require(msg.sender != address(0), "Invalid sender");
        _;
    }

    modifier hasAccess(address _patient) {
        require(
            msg.sender == _patient || authorizedUsers[_patient][msg.sender],
            "Access denied"
        );
        _;
    }

    /**
     * @dev Upload a medical record to blockchain
     * @param recordId Unique identifier for the record
     * @param ipfsHash IPFS hash of the encrypted file
     */
    function uploadRecord(string memory recordId, string memory ipfsHash) 
        external 
        onlyPatient 
    {
        patientRecords[msg.sender].push(MedicalRecord({
            recordId: recordId,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            exists: true
        }));

        emit RecordUploaded(msg.sender, recordId, ipfsHash, block.timestamp);
    }

    /**
     * @dev Request access to patient's medical records
     * @param patientAddress Address of the patient
     */
    function requestAccess(address patientAddress) external {
        require(patientAddress != address(0), "Invalid patient address");
        require(msg.sender != patientAddress, "Cannot request access to own records");
        require(!authorizedUsers[patientAddress][msg.sender], "Already has access");

        // Check if pending request already exists
        AccessRequest[] storage requests = accessRequests[patientAddress];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == msg.sender && requests[i].status == RequestStatus.PENDING) {
                revert("Pending request already exists");
            }
        }

        accessRequests[patientAddress].push(AccessRequest({
            requester: msg.sender,
            requestedAt: block.timestamp,
            status: RequestStatus.PENDING,
            exists: true
        }));

        emit AccessRequested(patientAddress, msg.sender, block.timestamp);
    }

    /**
     * @dev Approve access request
     * @param requesterAddress Address of the requester
     */
    function approveAccess(address requesterAddress) external {
        require(requesterAddress != address(0), "Invalid requester address");
        require(!authorizedUsers[msg.sender][requesterAddress], "Already authorized");

        // Find and update the request
        AccessRequest[] storage requests = accessRequests[msg.sender];
        bool found = false;
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == requesterAddress && requests[i].status == RequestStatus.PENDING) {
                requests[i].status = RequestStatus.APPROVED;
                found = true;
                break;
            }
        }
        require(found, "No pending request found");

        // Grant access
        authorizedUsers[msg.sender][requesterAddress] = true;
        authorizedUsersList[msg.sender].push(requesterAddress);

        emit AccessGranted(msg.sender, requesterAddress, block.timestamp);
    }

    /**
     * @dev Deny access request
     * @param requesterAddress Address of the requester
     */
    function denyAccess(address requesterAddress) external {
        require(requesterAddress != address(0), "Invalid requester address");

        // Find and update the request
        AccessRequest[] storage requests = accessRequests[msg.sender];
        bool found = false;
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == requesterAddress && requests[i].status == RequestStatus.PENDING) {
                requests[i].status = RequestStatus.DENIED;
                found = true;
                break;
            }
        }
        require(found, "No pending request found");
    }

    /**
     * @dev Revoke access from authorized user
     * @param userAddress Address of the user to revoke
     */
    function revokeAccess(address userAddress) external {
        require(userAddress != address(0), "Invalid user address");
        require(authorizedUsers[msg.sender][userAddress], "User not authorized");

        authorizedUsers[msg.sender][userAddress] = false;

        // Remove from authorized users list
        address[] storage usersList = authorizedUsersList[msg.sender];
        for (uint i = 0; i < usersList.length; i++) {
            if (usersList[i] == userAddress) {
                usersList[i] = usersList[usersList.length - 1];
                usersList.pop();
                break;
            }
        }

        emit AccessRevoked(msg.sender, userAddress, block.timestamp);
    }

    /**
     * @dev Get patient's record count
     * @param patientAddress Address of the patient
     * @return Number of records
     */
    function getPatientRecordCount(address patientAddress) 
        external 
        view 
        returns (uint256) 
    {
        return patientRecords[patientAddress].length;
    }

    /**
     * @dev Get patient's records (if authorized)
     * @param patientAddress Address of the patient
     * @return Array of medical records
     */
    function getPatientRecords(address patientAddress) 
        external 
        view 
        hasAccess(patientAddress)
        returns (MedicalRecord[] memory) 
    {
        return patientRecords[patientAddress];
    }

    /**
     * @dev Get list of authorized users for patient
     * @param patientAddress Address of the patient
     * @return Array of authorized addresses
     */
    function getAuthorizedUsers(address patientAddress) 
        external 
        view 
        returns (address[] memory) 
    {
        return authorizedUsersList[patientAddress];
    }

    /**
     * @dev Get pending access requests for patient
     * @param patientAddress Address of the patient
     * @return Array of access requests
     */
    function getPendingAccessRequests(address patientAddress) 
        external 
        view 
        returns (AccessRequest[] memory) 
    {
        AccessRequest[] storage allRequests = accessRequests[patientAddress];
        
        // Count pending requests
        uint256 pendingCount = 0;
        for (uint i = 0; i < allRequests.length; i++) {
            if (allRequests[i].status == RequestStatus.PENDING) {
                pendingCount++;
            }
        }

        // Create array of pending requests
        AccessRequest[] memory pending = new AccessRequest[](pendingCount);
        uint256 index = 0;
        for (uint i = 0; i < allRequests.length; i++) {
            if (allRequests[i].status == RequestStatus.PENDING) {
                pending[index] = allRequests[i];
                index++;
            }
        }

        return pending;
    }

    /**
     * @dev Check if user has access to patient records
     * @param patientAddress Address of the patient
     * @param userAddress Address of the user
     * @return Boolean indicating access
     */
    function hasAccess(address patientAddress, address userAddress) 
        external 
        view 
        returns (bool) 
    {
        return userAddress == patientAddress || authorizedUsers[patientAddress][userAddress];
    }
}

