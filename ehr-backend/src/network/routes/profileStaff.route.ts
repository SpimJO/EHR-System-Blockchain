/**
 * Staff Profile Routes (Figure 48)
 * 
 * Endpoints for medical staff profile management
 */

import { Router } from 'express';
import ProfileStaffController from '@/network/controllers/profileStaff.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

const profileStaff: Router = Router();
const profileStaffController = new ProfileStaffController();

// GET /api/profile/staff/my - Get my staff profile
profileStaff.get(
    '/my',
    apiKeyMiddleware,
    authMiddleware,
    roleGuard(['STAFF']),
    (req, res, next) => profileStaffController.getMyProfile(req, res, next)
);

// PUT /api/profile/staff/my - Update my staff profile
profileStaff.put(
    '/my',
    apiKeyMiddleware,
    authMiddleware,
    roleGuard(['STAFF']),
    (req, res, next) => profileStaffController.updateMyProfile(req, res, next)
);

export default profileStaff;
