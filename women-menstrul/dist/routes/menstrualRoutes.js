import { Router } from 'express';
import { getMenstrualData, deleteMenstrualData } from '../controllers/menstrualController';
const router = Router();
router.get('/', getMenstrualData);
// router.post('/', addMenstrualData);
// router.put('/:id', updateMenstrualData);
router.delete('/:id', deleteMenstrualData);
export default router;
