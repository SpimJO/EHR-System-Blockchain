/**
 * Staff Profile Routes (Figure 48)
 * 
 * Endpoints for medical staff profile management
 */

import { Router } from 'express';
import { baseRouter } from '@/lib/baseRouter';
import ProfileStaffController from '@/network/controllers/profileStaff.controller';
import { apiKeyMiddleware } from '@/middleware/apiKey';
import { authMiddleware } from '@/middleware/auth';
import { roleGuard } from '@/middleware/roleGuard';

class ProfileStaffRoute extends baseRouter {
    public path = '/profile/staff';
    public router: Router = Router();
    private controller = new ProfileStaffController();

    constructor() {
        super();
        this.initRoutes();
    }

    protected initRoutes(): void {
        // GET /api/profile/staff/my - Get my staff profile
        this.router.get(
            '/my',
            apiKeyMiddleware,
            authMiddleware,
            roleGuard(['STAFF']),
            this.controller.getMyProfile.bind(this.controller)
        );

        // PUT /api/profile/staff/my - Update my staff profile
        this.router.put(
            '/my',
            apiKeyMiddleware,
            authMiddleware,
            roleGuard(['STAFF']),
            this.controller.updateMyProfile.bind(this.controller)
        );
    }
}

export default new ProfileStaffRoute().router;
