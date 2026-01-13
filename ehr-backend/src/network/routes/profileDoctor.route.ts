/**
 * Doctor Profile Routes (Figure 43)
 * 
 * Endpoints for doctor profile management
 */

import { Router } from 'express';
import { baseRouter } from '@/lib/baseRouter';
import ProfileDoctorController from '@/network/controllers/profileDoctor.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

class ProfileDoctorRoute extends baseRouter {
    public path = '/profile/doctor';
    public router: Router = Router();
    private controller = new ProfileDoctorController();

    constructor() {
        super();
        this.initRoutes();
    }

    protected initRoutes(): void {
        // GET /api/profile/doctor/my - Get my doctor profile
        this.router.get(
            '/my',
            apiKeyMiddleware,
            authMiddleware,
            roleGuard(['DOCTOR']),
            this.controller.getMyProfile.bind(this.controller)
        );

        // PUT /api/profile/doctor/my - Update my doctor profile
        this.router.put(
            '/my',
            apiKeyMiddleware,
            authMiddleware,
            roleGuard(['DOCTOR']),
            this.controller.updateMyProfile.bind(this.controller)
        );
    }
}

export default new ProfileDoctorRoute().router;
