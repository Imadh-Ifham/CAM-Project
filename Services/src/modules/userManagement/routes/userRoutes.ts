// Services/src/modules/userManagement/routes/userRoutes.ts

import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUsers);           // GET /api/users?role=admin&search=john
router.get('/:id', userController.getUser);         // GET /api/users/:id
router.post('/', userController.createUser);        // POST /api/users
router.put('/:id', userController.updateUser);      // PUT /api/users/:id
router.delete('/:id', userController.deleteUser);   // DELETE /api/users/:id

export default router;