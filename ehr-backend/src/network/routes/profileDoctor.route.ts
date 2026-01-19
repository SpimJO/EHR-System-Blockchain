/**
 * Doctor Profile Routes (Figure 43)
 * 
 * Endpoints for doctor profile management
 */

import { Router } from 'express';
import ProfileDoctorController from '@/network/controllers/profileDoctor.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

const profileDoctor: Router = Router();
const profileDoctorController = new ProfileDoctorController();

// GET /api/profile/doctor/my - Get my doctor profile
profileDoctor.get(
    '/my',
    apiKeyMiddleware,
    authMiddleware,
    roleGuard(['DOCTOR']),
    (req, res, next) => profileDoctorController.getMyProfile(req, res, next)
);

// PUT /api/profile/doctor/my - Update my doctor profile
profileDoctor.put(
    '/my',
    apiKeyMiddleware,
    authMiddleware,
    roleGuard(['DOCTOR']),
    (req, res, next) => profileDoctorController.updateMyProfile(req, res, next)
);

export default profileDoctor;
