// Services/src/modules/userManagement/routes/userRoutes.ts

import { Router } from 'express';
import * as userController from '../controllers/userController';
import User from "../../auth/models/User";

const router = Router();

router.get('/', userController.getUsers);           // GET /api/users?role=admin&search=john
router.get('/:id', userController.getUser);         // GET /api/users/:id
router.post('/', userController.createUser);        // POST /api/users
router.put('/:id', userController.updateUser);      // PUT /api/users/:id
router.delete('/:id', userController.deleteUser);   // DELETE /api/users/:id

router.get("/stats/all", async (req, res) => {
  try {
    const total = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const agents = await User.countDocuments({ role: "agent" });
    const volunteers = await User.countDocuments({ role: "volunteer" });
    const active = await User.countDocuments({ status: "active" });
    const inactive = await User.countDocuments({ status: "inactive" });

    res.json({
      success: true,
      data: { total, admins, agents, volunteers, active, inactive },
    });
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
});


export default router;