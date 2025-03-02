import { Router } from 'express';
import AdminRoutes from '../routes/adminRoutes';
import AuthRoutes from '../routes/authRoutes';

const router = Router();

router.post('/', AdminRoutes);
router.get('/', AdminRoutes);
router.get('/:id', AdminRoutes);    
router.put('/:id', AdminRoutes);
router.delete('/:id', AdminRoutes);

router.post('/',AuthRoutes );
router.post('/',AuthRoutes );
export default router;