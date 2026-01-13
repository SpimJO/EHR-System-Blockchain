/**
 * Patients Routes (Figure 47)
 * 
 * Endpoints for managing patient lists (doctor/staff view)
 */

import { Router } from 'express';
import baseRouter from '@/lib/baseRouter';
import PatientsController from '@/network/controllers/patients.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

class PatientsRoute extends baseRouter {
    public path = '/patients';
    public router: Router = Router();
    private controller = new PatientsController();

    constructor() {
        super();
        this.initRoutes();
    }

    protected initRoutes(): void {
        // GET /api/patients/my - Get list of patients I have access to
        this.router.get(
            '/my',
            apiKeyMiddleware,
            authMiddleware,
            roleGuard(['DOCTOR', 'STAFF']),
            this.controller.getMyPatients.bind(this.controller)
        );
    }
}

export default new PatientsRoute().router;
