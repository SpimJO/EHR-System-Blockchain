/**
 * Patients Routes (Figure 47)
 * 
 * Endpoints for managing patient lists (doctor/staff view)
 */

import { Router } from 'express';
import PatientsController from '@/network/controllers/patients.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

const patients: Router = Router();
const patientsController = new PatientsController();

// GET /api/patients/my - Get list of patients I have access to
patients.get(
    '/my',
    apiKeyMiddleware,
    authMiddleware,
    roleGuard(['DOCTOR', 'STAFF']),
    (req, res, next) => patientsController.getMyPatients(req, res, next)
);

export default patients;
